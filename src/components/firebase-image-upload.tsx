'use client';

import * as React from 'react';
import Image from '@/components/fallback-image';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    // eslint-disable-next-line no-unused-vars
    onFileChange?: (file: File | null) => void;
    value?: File | null;
    disabled?: boolean;
    maxSize?: number; // in MB
    accept?: string[];
}

export function FirebaseImageUpload({
    onFileChange,
    value,
    disabled = false,
    maxSize = 5, // 5MB default
    accept = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    className,
    ...props
}: ImageUploadProps) {
    const [preview, setPreview] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    // Create preview when file changes
    React.useEffect(() => {
        if (!value) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(value);
        setPreview(objectUrl);

        // Free memory when component unmounts
        return () => URL.revokeObjectURL(objectUrl);
    }, [value]);

    const onDrop = React.useCallback(
        (acceptedFiles: File[], rejectedFiles: any[]) => {
            if (disabled) return;

            // Handle rejected files
            if (rejectedFiles.length > 0) {
                const rejectedFile = rejectedFiles[0];
                if (rejectedFile.errors[0]?.code === 'file-too-large') {
                    setError(`File is too large. Max size is ${maxSize}MB`);
                } else if (rejectedFile.errors[0]?.code === 'file-invalid-type') {
                    setError('File type not supported');
                } else {
                    setError('Error uploading file');
                }
                return;
            }

            // Handle accepted files
            if (acceptedFiles.length > 0) {
                setError(null);
                onFileChange?.(acceptedFiles[0]);
            }
        },
        [disabled, maxSize, onFileChange],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: accept.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
        maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
        disabled,
        maxFiles: 1,
    });

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFileChange?.(null);
        setError(null);
    };

    return (
        <div className={cn('space-y-2', className)} {...props}>
            <div
                {...getRootProps()}
                className={cn(
                    'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
                    isDragActive
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-muted-foreground/50 hover:border-primary/75',
                    disabled && 'cursor-not-allowed opacity-60',
                    error && 'border-destructive/50 bg-destructive/5 hover:border-destructive',
                )}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-md">
                        <Image
                            src={preview || '/no-data.jpg'}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute right-0 top-0 h-6 w-6 rounded-full"
                            onClick={removeImage}
                            disabled={disabled}
                        >
                            <X className="h-2 w-2" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-1 text-center">
                        <UploadCloud className="h-10 w-10 text-muted-foreground" />
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium">
                                {isDragActive ? 'Thả tập tin ở đây' : 'Kéo và thả tập tin vào đây'}
                            </p>
                            <p className="text-xs text-muted-foreground">hoặc nhấn để tìm kiếm</p>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                            {accept.map((file) => file.split('/')[1]?.toUpperCase()).join(', ')} lên
                            đến {maxSize} MB
                        </div>
                    </div>
                )}
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
