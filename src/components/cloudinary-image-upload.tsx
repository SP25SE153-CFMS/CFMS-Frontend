'use client';

import type React from 'react';

import { useState, useRef, useCallback } from 'react';
import { X, UploadCloud } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Image from '@/components/fallback-image';
import { env } from '@/env';

type AspectRatio = 'square' | 'portrait' | 'landscape' | 'auto';

interface CloudinaryImageUploadProps {
    // eslint-disable-next-line no-unused-vars
    onUploadComplete?: (url: string) => void;
    className?: string;
    aspectRatio?: AspectRatio;
    uploadPreset?: string;
    cloudName?: string;
    maxSizeMB?: number;
    disabled?: boolean;
    accept?: string[];
    defaultImage?: string;
}

const ASPECT_RATIO_CLASSES: Record<AspectRatio, string> = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    auto: 'aspect-auto',
};

export function CloudinaryImageUpload({
    onUploadComplete,
    className = '',
    aspectRatio = 'square',
    uploadPreset = env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    maxSizeMB = 5,
    disabled = false,
    accept = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    defaultImage,
    ...props
}: CloudinaryImageUploadProps) {
    const [file, setFile] = useState<{ file: File; preview: string; url?: string } | null>(
        defaultImage
            ? { file: new File([], 'default'), preview: defaultImage, url: defaultImage }
            : null,
    );
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // const uploadToCloudinary = useCallback(async () => {
    //     if (!file || !cloudName) return;

    //     setUploading(true);
    //     setUploadProgress(0);
    //     setError(null);

    //     const formData = new FormData();
    //     formData.append('file', file.file);
    //     formData.append('upload_preset', uploadPreset);

    //     let progressInterval;

    //     try {
    //         // Simulate progress
    //         progressInterval = setInterval(() => {
    //             setUploadProgress((prev) => Math.min(prev + 10, 90));
    //         }, 300);

    //         // Using axios instead of fetch
    //         const response = await axios.post(
    //             `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    //             formData,
    //             {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',
    //                 },
    //                 // Optional: Add real progress tracking
    //                 onUploadProgress: (progressEvent) => {
    //                     if (progressEvent.total) {
    //                         const percentCompleted = Math.round(
    //                             (progressEvent.loaded * 100) / progressEvent.total,
    //                         );
    //                         setUploadProgress(Math.min(percentCompleted, 90));
    //                     }
    //                 },
    //             },
    //         );

    //         // Axios automatically throws for non-2xx responses, so we don't need to check response.ok
    //         // Axios also automatically parses JSON, so we can access data directly
    //         const data = response.data;
    //         setUploadProgress(100);

    //         // Update the file with its Cloudinary URL
    //         setFile((prev) => (prev ? { ...prev, url: data.secure_url } : null));

    //         // Call the callback with the URL
    //         onUploadComplete?.(data.secure_url);
    //     } catch (error) {
    //         console.error('Upload error:', error);
    //         // Handle axios error
    //         if (axios.isAxiosError(error)) {
    //             setError(
    //                 error.response?.data?.error?.message ||
    //                     error.message ||
    //                     'Upload failed. Please try again.',
    //             );
    //         } else {
    //             setError(
    //                 error instanceof Error ? error.message : 'Upload failed. Please try again.',
    //             );
    //         }
    //     } finally {
    //         clearInterval(progressInterval);
    //         setUploading(false);
    //     }
    // }, [file, cloudName, uploadPreset, onUploadComplete]);

    // const setUploadImage = useImageUploadStore((state) => state.setUploadImage);
    // // Register the function when component mounts
    // useEffect(() => {
    //     setUploadImage(() => uploadToCloudinary);
    // }, []);

    // Memoize handlers to prevent unnecessary re-renders
    const handleFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];
            if (!selectedFile) return;

            // Reset error state
            setError(null);

            // Check file size
            if (selectedFile.size > maxSizeMB * 1024 * 1024) {
                setError(`File too large: ${selectedFile.name} exceeds the ${maxSizeMB}MB limit.`);
                return;
            }

            // Revoke previous object URL to avoid memory leaks
            if (file?.preview) {
                URL.revokeObjectURL(file.preview);
            }

            setFile({
                file: selectedFile,
                preview: URL.createObjectURL(selectedFile),
            });

            // Reset the input value so the same file can be selected again
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // await uploadToCloudinary();
            if (!selectedFile || !cloudName) return;

            setUploading(true);
            setUploadProgress(0);
            setError(null);

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('upload_preset', uploadPreset);

            let progressInterval;

            try {
                // Simulate progress
                progressInterval = setInterval(() => {
                    setUploadProgress((prev) => Math.min(prev + 10, 90));
                }, 300);

                // Using axios instead of fetch
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        // Optional: Add real progress tracking
                        onUploadProgress: (progressEvent) => {
                            if (progressEvent.total) {
                                const percentCompleted = Math.round(
                                    (progressEvent.loaded * 100) / progressEvent.total,
                                );
                                setUploadProgress(Math.min(percentCompleted, 90));
                            }
                        },
                    },
                );

                // Axios automatically throws for non-2xx responses, so we don't need to check response.ok
                // Axios also automatically parses JSON, so we can access data directly
                const data = response.data;
                setUploadProgress(100);

                // Update the file with its Cloudinary URL
                setFile((prev) => (prev ? { ...prev, url: data.secure_url } : null));

                // Call the callback with the URL
                onUploadComplete?.(data.secure_url);
            } catch (error) {
                console.error('Upload error:', error);
                // Handle axios error
                if (axios.isAxiosError(error)) {
                    setError(
                        error.response?.data?.error?.message ||
                            error.message ||
                            'Upload failed. Please try again.',
                    );
                } else {
                    setError(
                        error instanceof Error ? error.message : 'Upload failed. Please try again.',
                    );
                }
            } finally {
                clearInterval(progressInterval);
                setUploading(false);
            }
        },
        [cloudName, file?.preview, maxSizeMB, onUploadComplete, uploadPreset],
    );

    const removeFile = useCallback(() => {
        if (file?.preview) {
            URL.revokeObjectURL(file.preview);
        }
        setFile(null);
        setError(null);
    }, [file]);

    const triggerFileInput = useCallback(() => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, [disabled]);

    const acceptedFileTypes = accept.map((type) => type.split('/')[1]?.toUpperCase()).join(', ');

    return (
        <div className={cn('space-y-2', className)} {...props}>
            <div
                className={cn(
                    'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors border-muted-foreground/50',
                    disabled && 'cursor-not-allowed opacity-60',
                    error && 'border-destructive/50 bg-destructive/5 hover:border-destructive',
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={accept.join(',')}
                    className="hidden"
                    disabled={disabled || uploading}
                />

                {file ? (
                    <div className="space-y-4 w-full">
                        <div className="overflow-hidden">
                            <div className="relative">
                                <div
                                    className={cn(
                                        'relative overflow-hidden rounded-md flex',
                                        ASPECT_RATIO_CLASSES[aspectRatio],
                                    )}
                                >
                                    <Image
                                        fill
                                        src={file.preview || '/no-data.jpg'}
                                        alt={file.file.name}
                                        className="h-full w-full object-contain"
                                        sizes="(max-width: 768px) 100vw, 300px"
                                        priority
                                        preview
                                    />
                                </div>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute right-0 top-0 h-6 w-6 rounded-full"
                                    onClick={removeFile}
                                    disabled={uploading || disabled}
                                    type="button"
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Remove file</span>
                                </Button>
                            </div>
                            <p className="mt-2 truncate text-xs text-center text-muted-foreground">
                                {file.file.name}
                            </p>
                        </div>

                        {uploading && (
                            <div className="space-y-2">
                                <Progress value={uploadProgress} className="h-2 w-full" />
                                <p className="text-xs text-muted-foreground">
                                    Đang tải lên... {uploadProgress}%
                                </p>
                            </div>
                        )}
                        {/* : (
                             <Button
                                 onClick={uploadToCloudinary}
                                 disabled={uploading || !cloudName || disabled}
                                 className="w-full"
                                 type="button"
                             >
                                 {file.url ? (
                                     <>
                                         <Upload className="mr-2 h-4 w-4" />
                                         Tải lại
                                     </>
                                 ) : (
                                     <>
                                         <Upload className="mr-2 h-4 w-4" />
                                         Tải lên cloud
                                     </>
                                 )}
                             </Button>
                         ) */}
                    </div>
                ) : (
                    <div
                        onClick={triggerFileInput}
                        className="flex flex-col items-center justify-center gap-1 text-center cursor-pointer"
                    >
                        <UploadCloud className="h-10 w-10 text-muted-foreground" />
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium">Kéo và thả tập tin vào đây</p>
                            <p className="text-xs text-muted-foreground">hoặc nhấn để tìm kiếm</p>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                            {acceptedFileTypes} lên đến {maxSizeMB} MB
                        </div>
                    </div>
                )}
            </div>

            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
    );
}
