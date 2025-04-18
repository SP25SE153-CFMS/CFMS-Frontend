'use client';

import { useState, useEffect } from 'react';
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

export default function Image({
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

    // Reset states when preview is opened
    useEffect(() => {
        if (isPreviewOpen) {
            setScale(1);
            setRotation(0);
            setIsLoading(true);
        }
    }, [isPreviewOpen]);

    const handleZoomIn = () => {
        setScale((prevScale) => Math.min(prevScale + 0.25, 3));
    };

    const handleZoomOut = () => {
        setScale((prevScale) => Math.max(prevScale - 0.25, 0.5));
    };

    const handleRotate = () => {
        setRotation((prevRotation) => (prevRotation + 90) % 360);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imgSrc as string;
        link.download = alt || 'image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const toggleFullscreen = () => {
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
    };

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
                        setIsPreviewOpen(false);
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPreviewOpen, isFullscreen]);

    return (
        <>
            <div
                className={cn(
                    preview && 'cursor-zoom-in relative inline-block overflow-hidden group',
                )}
                onClick={preview ? () => setIsPreviewOpen(true) : undefined}
                role={preview ? 'button' : undefined}
                tabIndex={preview ? 0 : undefined}
                onKeyDown={
                    preview
                        ? (e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setIsPreviewOpen(true);
                              }
                          }
                        : undefined
                }
                aria-label={preview ? `View ${alt} in preview mode` : undefined}
            >
                <NextImage
                    {...props}
                    src={imgSrc || '/placeholder.svg'}
                    alt={alt}
                    onError={() => {
                        setImgSrc(fallbackSrc);
                        setError(true);
                    }}
                    // className={`${props.className || ''} ${error ? 'fallback-image-loaded' : ''}`}
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
                    <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden border-0 bg-transparent shadow-none">
                        <div className="w-full h-full flex flex-col">
                            {/* Header with title and close button */}
                            {/* <div className="flex justify-between items-center p-4 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent"> */}
                            <div className="flex justify-between items-center p-4 absolute top-0 left-0 right-0 z-10">
                                {previewTitle && (
                                    <h3 className="text-white font-medium text-lg truncate max-w-[50%]">
                                        {previewTitle}
                                    </h3>
                                )}
                                <button
                                    onClick={() => {
                                        setIsPreviewOpen(false);
                                        setIsFullscreen(false);
                                    }}
                                    className="ml-auto p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                                    aria-label="Close preview"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Main image container */}
                            <div className="flex items-center justify-center w-full h-full overflow-auto p-8 pt-16 pb-20">
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
                                        onError={() => {
                                            setImgSrc(fallbackSrc);
                                        }}
                                        onLoad={() => setIsLoading(false)}
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Controls toolbar */}
                            <div className="absolute bottom-0 left-0 right-0 z-10">
                                <div className="flex justify-center">
                                    <div className="bg-black/60 backdrop-blur-md rounded-full p-1 flex items-center gap-1 border border-gray-700">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={handleZoomOut}
                                                        className="h-9 w-9 rounded-full text-gray-200 hover:text-white hover:bg-gray-800"
                                                    >
                                                        <ZoomOut size={18} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <p>Zoom Out (−)</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <div className="px-2 text-white/90 text-sm font-medium min-w-[60px] text-center">
                                            {Math.round(scale * 100)}%
                                        </div>

                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={handleZoomIn}
                                                        className="h-9 w-9 rounded-full text-gray-200 hover:text-white hover:bg-gray-800"
                                                    >
                                                        <ZoomIn size={18} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <p>Zoom In (+)</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <div className="w-px h-6 bg-gray-700 mx-1"></div>

                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={handleRotate}
                                                        className="h-9 w-9 rounded-full text-gray-200 hover:text-white hover:bg-gray-800"
                                                    >
                                                        <RotateCw size={18} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <p>Rotate (R)</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={handleDownload}
                                                        className="h-9 w-9 rounded-full text-gray-200 hover:text-white hover:bg-gray-800"
                                                    >
                                                        <Download size={18} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <p>Download</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={toggleFullscreen}
                                                        className="h-9 w-9 rounded-full text-gray-200 hover:text-white hover:bg-gray-800"
                                                    >
                                                        {isFullscreen ? (
                                                            <Minimize2 size={18} />
                                                        ) : (
                                                            <Maximize2 size={18} />
                                                        )}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <p>
                                                        {isFullscreen
                                                            ? 'Exit Fullscreen (F)'
                                                            : 'Fullscreen (F)'}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
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
