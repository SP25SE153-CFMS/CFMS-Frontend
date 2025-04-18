'use client';

import { useState } from 'react';
import NextImage, { type ImageProps } from 'next/image';

interface FallbackImageProps extends ImageProps {
    fallbackSrc?: string;
}

export default function Image({
    src,
    fallbackSrc = '/placeholder.svg',
    alt,
    ...props
}: FallbackImageProps) {
    const [imgSrc, setImgSrc] = useState<string | typeof src>(src);
    const [error, setError] = useState(false);

    return (
        <NextImage
            {...props}
            src={imgSrc || '/placeholder.svg'}
            alt={alt}
            onError={() => {
                setImgSrc(fallbackSrc);
                setError(true);
            }}
            className={`${props.className || ''} ${error ? 'fallback-image-loaded' : ''}`}
        />
    );
}
