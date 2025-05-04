/* eslint-disable no-undef */
'use client';

import { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { env } from '@/env';

// Define types for our component props
interface MapProps {
    center?: { lat: number; lng: number };
    zoom?: number;
    markers?: Array<{
        id: string;
        position: { lat: number; lng: number };
        title?: string;
        info?: React.ReactNode;
    }>;
    height?: string | number;
    width?: string | number;
    className?: string;
}

// Default center coordinates (San Francisco)
const defaultCenter = { lat: 37.7749, lng: -122.4194 };

export function GoogleMapComponent({
    center = defaultCenter,
    zoom = 10,
    markers = [],
    height = 400,
    width = '100%',
    className = '',
}: MapProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    });

    const [, setMap] = useState<google.maps.Map | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);

    const onLoad = useCallback(
        (map: google.maps.Map) => {
            mapRef.current = map;
            setMap(map);

            // Auto-focus on markers
            if (markers.length > 0) {
                const bounds = new google.maps.LatLngBounds();
                markers.forEach((marker) => bounds.extend(marker.position));
                map.fitBounds(bounds);
            }
        },
        [markers],
    );

    const onUnmount = useCallback(() => {
        mapRef.current = null;
        setMap(null);
    }, []);

    if (loadError) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle>LỖI BẢN ĐỒ</CardTitle>
                    <CardDescription>Không thể mở Google Maps</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 text-center text-red-500">
                        Lỗi khi mở Google Maps. Vui lòng kiểm tra API key của bạn và thử lại.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardContent className="p-0 overflow-hidden rounded-md">
                {!isLoaded ? (
                    <Skeleton
                        className="w-full h-[400px]"
                        style={{ height: height, width: width }}
                    />
                ) : (
                    <GoogleMap
                        mapContainerStyle={{ height, width }}
                        center={center}
                        zoom={zoom}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        options={{
                            fullscreenControl: true,
                            streetViewControl: true,
                            mapTypeControl: true,
                            zoomControl: true,
                        }}
                    >
                        {markers.map((marker) => (
                            <Marker
                                key={marker.id}
                                position={marker.position}
                                title={marker.title}
                                onClick={() => setSelectedMarker(marker.id)}
                            >
                                {selectedMarker === marker.id && marker.info && (
                                    <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                                        <div className="p-2 max-w-xs">{marker.info}</div>
                                    </InfoWindow>
                                )}
                            </Marker>
                        ))}
                    </GoogleMap>
                )}
            </CardContent>
        </Card>
    );
}
