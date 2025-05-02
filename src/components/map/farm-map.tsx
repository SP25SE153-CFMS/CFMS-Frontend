'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { Farm } from '@/utils/schemas/farm.schema';

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

// Component to fit bounds to all markers
function SetBoundsToMarkers({ farms }: { farms: Farm[] }) {
    const map = useMap();

    useEffect(() => {
        if (farms.length > 0) {
            const bounds = L.latLngBounds(farms.map((farm) => [farm.latitude, farm.longitude]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [farms, map]);

    return null;
}

interface FarmMapProps {
    farms: Farm[];
}

export default function FarmMap({ farms }: FarmMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        fixLeafletIcon();
        setIsMounted(true);

        // Cleanup to prevent "already initialized" error
        return () => {
            const mapContainers = document.getElementsByClassName('leaflet-container');
            if (mapContainers.length > 0) {
                for (const container of Array.from(mapContainers)) {
                    container.remove();
                }
            }
        };
    }, []);

    // Default center
    const centerOfVietnam: [number, number] = [14.0583, 108.2772];
    const defaultCenter: [number, number] =
        farms.length > 0 ? [farms[0].latitude, farms[0].longitude] : centerOfVietnam;

    // Custom icon for farm markers
    const farmIcon = new L.Icon({
        iconUrl: '/chicken-marker.svg',
        iconRetinaUrl: '/chicken-marker.svg',
        iconSize: [35, 35],
        iconAnchor: [17, 35],
        popupAnchor: [0, -35],
    });

    if (!isMounted) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center">
                    <MapPin className="w-12 h-12 text-gray-400 animate-bounce" />
                    <p className="mt-4 text-gray-600">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <MapContainer
            center={defaultCenter}
            zoom={4}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {farms.map((farm) => (
                <Marker
                    key={farm.farmId}
                    position={[farm.latitude, farm.longitude]}
                    icon={farmIcon}
                >
                    <Popup>
                        <div className="p-1 max-w-xs">
                            <h3 className="font-bold text-lg">{farm.farmName}</h3>
                            <p className="text-sm text-gray-600">Địa chỉ: {farm.address}</p>
                            <p className="mt-2">Diện tích: {farm.area} ha</p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            <SetBoundsToMarkers farms={farms} />
        </MapContainer>
    );
}
