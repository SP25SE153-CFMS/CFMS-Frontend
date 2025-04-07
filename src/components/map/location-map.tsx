/* eslint-disable no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Fix for Leaflet marker icons in Next.js
const fixLeafletIcon = () => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
};

// Custom farm marker icon
const farmIcon = new L.Icon({
    iconUrl: '/farm-marker.svg',
    iconRetinaUrl: '/farm-marker.svg',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
});

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

// Component to handle map clicks and marker placement
function LocationPicker({ onLocationSelect }: LocationPickerProps) {
    const [position, setPosition] = useState<L.LatLng | null>(null);

    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return position === null ? null : <Marker position={position} icon={farmIcon} />;
}

interface LocationMapProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialLat?: number;
    initialLng?: number;
}

export default function LocationMap({
    onLocationSelect,
    initialLat = 21.0278,
    initialLng = 105.8342,
}: LocationMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
        initialLat && initialLng ? [initialLat, initialLng] : null,
    );

    useEffect(() => {
        fixLeafletIcon();
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (initialLat && initialLng && initialLat !== 0 && initialLng !== 0) {
            setMarkerPosition([initialLat, initialLng]);
        }
    }, [initialLat, initialLng]);

    if (!isMounted) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center">
                    <MapPin className="w-12 h-12 text-gray-400 animate-bounce" />
                    <p className="mt-4 text-gray-600">Đang tải bản đồ...</p>
                </div>
            </div>
        );
    }

    // Default center (Vietnam)
    const defaultCenter: [number, number] = [initialLat || 21.0278, initialLng || 105.8342];

    return (
        <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {markerPosition && <Marker position={markerPosition} icon={farmIcon} />}

            <LocationPicker
                onLocationSelect={(lat, lng) => {
                    setMarkerPosition([lat, lng]);
                    onLocationSelect(lat, lng);
                }}
            />
        </MapContainer>
    );
}
