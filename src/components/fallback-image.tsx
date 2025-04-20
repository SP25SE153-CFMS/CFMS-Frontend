'use client';

import type React from 'react';

import { useState, useEffect, useCallback, memo, useRef } from 'react';
import NextImage, { type ImageProps } from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ZoomIn, ZoomOut, X, RotateCw, Download, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

interface FallbackImageProps extends ImageProps {
    fallbackSrc?: string;
    preview?: boolean;
    previewTitle?: string;
}

// Memoized control button to prevent re-renders
const ControlButton = memo(
    ({
        icon: Icon,
        onClick,
        tooltip,
    }: {
        icon: React.ElementType;
        onClick: () => void;
        tooltip: string;
    }) => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClick}
                        className="h-9 w-9 rounded-full text-gray-200 hover:text-white hover:bg-gray-800"
                    >
                        <Icon size={18} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
);
ControlButton.displayName = 'ControlButton';

function Image({
    src,
    fallbackSrc = '/placeholder.svg',
    alt,
    preview = false,
    previewTitle,
    ...props
}: FallbackImageProps) {
    const [imgSrc, setImgSrc] = useState<string | typeof src>(src);
    const [error, setError] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dialogContentRef = useRef<HTMLDivElement>(null);

    // Reset states when preview is opened - memoized to prevent recreation on every render
    useEffect(() => {
        if (isPreviewOpen) {
            setScale(1);
            setRotation(0);
            setIsLoading(true);
        }
    }, [isPreviewOpen]);

    // Memoized handlers to prevent recreation on every render
    const handleZoomIn = useCallback(() => {
        setScale((prevScale) => Math.min(prevScale + 0.25, 3));
    }, []);

    const handleZoomOut = useCallback(() => {
        setScale((prevScale) => Math.max(prevScale - 0.25, 0.5));
    }, []);

    const handleRotate = useCallback(() => {
        setRotation((prevRotation) => (prevRotation + 90) % 360);
    }, []);

    const handleDownload = useCallback(() => {
        const link = document.createElement('a');
        link.href = imgSrc as string;
        link.download = alt || 'image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [imgSrc, alt]);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement
                .requestFullscreen()
                .then(() => {
                    setIsFullscreen(true);
                })
                .catch((err) => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
        } else {
            if (document.exitFullscreen) {
                document
                    .exitFullscreen()
                    .then(() => {
                        setIsFullscreen(false);
                    })
                    .catch((err) => {
                        console.error(`Error attempting to exit fullscreen: ${err.message}`);
                    });
            }
        }
    }, []);

    const closePreview = useCallback(() => {
        setIsPreviewOpen(false);
        if (isFullscreen && document.exitFullscreen) {
            document.exitFullscreen().catch((err) => {
                console.error(`Error exiting fullscreen: ${err.message}`);
            });
        }
    }, [isFullscreen]);

    // Handle click outside to close preview
    const handleDialogContentClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            // Check if the click is directly on the DialogContent (background) and not on its children
            if (e.target === e.currentTarget) {
                closePreview();
            }
        },
        [closePreview],
    );

    // Listen for fullscreen change events
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Handle keyboard shortcuts
    useEffect(() => {
        if (!isPreviewOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case '+':
                case '=':
                    handleZoomIn();
                    break;
                case '-':
                    handleZoomOut();
                    break;
                case 'r':
                    handleRotate();
                    break;
                case 'f':
                    toggleFullscreen();
                    break;
                case 'Escape':
                    if (isFullscreen) {
                        document.exitFullscreen();
                    } else {
                        closePreview();
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [
        isPreviewOpen,
        isFullscreen,
        handleZoomIn,
        handleZoomOut,
        handleRotate,
        toggleFullscreen,
        closePreview,
    ]);

    // Memoized image click handler
    const handleImageClick = useCallback(() => {
        if (preview) {
            setIsPreviewOpen(true);
        }
    }, [preview]);

    // Memoized image keydown handler
    const handleImageKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (preview && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                setIsPreviewOpen(true);
            }
        },
        [preview],
    );

    // Memoized image load handler
    const handleImageLoad = useCallback(() => {
        setIsLoading(false);
    }, []);

    // Memoized image error handler
    const handleImageError = useCallback(() => {
        setImgSrc(fallbackSrc);
        setError(true);
    }, [fallbackSrc]);

    return (
        <>
            <div
                className={cn(
                    preview && 'cursor-zoom-in relative inline-block overflow-hidden group',
                )}
                onClick={handleImageClick}
                role={preview ? 'button' : undefined}
                tabIndex={preview ? 0 : undefined}
                onKeyDown={preview ? handleImageKeyDown : undefined}
                aria-label={preview ? `View ${alt} in preview mode` : undefined}
            >
                <NextImage
                    {...props}
                    src={imgSrc || '/placeholder.svg'}
                    alt={alt}
                    onError={handleImageError}
                    className={cn(
                        props.className,
                        'transition-all duration-300 ease-in-out',
                        error ? 'fallback-image-loaded' : '',
                        preview && '!relative group-hover:scale-105 group-hover:brightness-90',
                    )}
                />
                {preview && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-black/50 text-white rounded-full p-2">
                            <Maximize2 size={20} />
                        </div>
                    </div>
                )}
            </div>

            {preview && (
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogContent
                        ref={dialogContentRef}
                        onClick={handleDialogContentClick}
                        className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden border-0 bg-transparent shadow-none"
                    >
                        <div className="w-full h-full flex flex-col">
                            {/* Header with title and close button */}
                            <div
                                className="flex justify-between items-center p-4 absolute top-0 left-0 right-0 z-10"
                                onClick={() => setIsPreviewOpen(false)}
                            >
                                {previewTitle && (
                                    <h3 className="text-white font-medium text-lg truncate max-w-[50%]">
                                        {previewTitle}
                                    </h3>
                                )}
                                <button
                                    onClick={closePreview}
                                    className="ml-auto p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                                    aria-label="Close preview"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Main image container */}
                            <div
                                className="flex items-center justify-center w-full h-full overflow-auto p-8 pt-16 pb-20"
                                onClick={() => setIsPreviewOpen(false)}
                            >
                                {isLoading && (
                                    <Skeleton className="w-[80%] h-[80%] bg-gray-800/50" />
                                )}
                                <div
                                    className={cn(
                                        'transition-all duration-300 ease-in-out',
                                        isLoading ? 'opacity-0' : 'opacity-100',
                                    )}
                                    style={{
                                        transform: `scale(${scale}) rotate(${rotation}deg)`,
                                    }}
                                >
                                    <NextImage
                                        src={imgSrc || '/placeholder.svg'}
                                        alt={alt}
                                        width={props.width ? Number(props.width) * 2 : 1200}
                                        height={props.height ? Number(props.height) * 2 : 800}
                                        className="max-h-[80vh] w-auto object-contain"
                                        onError={handleImageError}
                                        onLoad={handleImageLoad}
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Controls toolbar */}
                            <div className="absolute bottom-0 left-0 right-0 z-10">
                                <div className="flex justify-center">
                                    <div className="bg-black/60 backdrop-blur-md rounded-full p-1 flex items-center gap-1 border border-gray-700">
                                        <ControlButton
                                            icon={ZoomOut}
                                            onClick={handleZoomOut}
                                            tooltip="Zoom Out (−)"
                                        />

                                        <div className="px-2 text-white/90 text-sm font-medium min-w-[60px] text-center">
                                            {Math.round(scale * 100)}%
                                        </div>

                                        <ControlButton
                                            icon={ZoomIn}
                                            onClick={handleZoomIn}
                                            tooltip="Zoom In (+)"
                                        />

                                        <div className="w-px h-6 bg-gray-700 mx-1"></div>

                                        <ControlButton
                                            icon={RotateCw}
                                            onClick={handleRotate}
                                            tooltip="Rotate (R)"
                                        />

                                        <ControlButton
                                            icon={Download}
                                            onClick={handleDownload}
                                            tooltip="Download"
                                        />

                                        <ControlButton
                                            icon={isFullscreen ? Minimize2 : Maximize2}
                                            onClick={toggleFullscreen}
                                            tooltip={
                                                isFullscreen
                                                    ? 'Exit Fullscreen (F)'
                                                    : 'Fullscreen (F)'
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

export default memo(Image);
