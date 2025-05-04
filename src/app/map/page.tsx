'use client';

import { useState } from 'react';
import { GoogleMapComponent } from '@/components/map/google-map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Plus } from 'lucide-react';

export default function MapExamplePage() {
    // Replace with your Google Maps API key
    const apiKey = 'AIzaSyCW6AQb03hCbfixlHYsWRsLoUyoU_qrhUs';

    const [markers, setMarkers] = useState([
        {
            id: '1',
            position: { lat: 37.7749, lng: -122.4194 },
            title: 'San Francisco',
            info: 'The cultural, commercial, and financial center of Northern California.',
        },
    ]);

    const [newMarkerTitle, setNewMarkerTitle] = useState('');
    const [newMarkerLat, setNewMarkerLat] = useState('');
    const [newMarkerLng, setNewMarkerLng] = useState('');

    const addMarker = () => {
        if (newMarkerTitle && newMarkerLat && newMarkerLng) {
            const lat = Number.parseFloat(newMarkerLat);
            const lng = Number.parseFloat(newMarkerLng);

            if (!isNaN(lat) && !isNaN(lng)) {
                setMarkers([
                    ...markers,
                    {
                        id: Date.now().toString(),
                        position: { lat, lng },
                        title: newMarkerTitle,
                        info: `Custom marker at ${lat}, ${lng}`,
                    },
                ]);

                // Reset form
                setNewMarkerTitle('');
                setNewMarkerLat('');
                setNewMarkerLng('');
            }
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Google Maps</CardTitle>
                    <CardDescription>
                        Interactive map with custom markers using shadcn/ui styling
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!apiKey ? (
                        <div className="p-4 mb-4 text-amber-800 bg-amber-100 rounded-md">
                            <p>Please add your Google Maps API key to the environment variables:</p>
                            <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
                            </pre>
                        </div>
                    ) : null}

                    <GoogleMapComponent
                        apiKey={apiKey}
                        markers={markers}
                        height={500}
                        className="mb-8"
                    />

                    <div className="mt-6 border-t pt-6">
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                            <MapPin className="mr-2 h-5 w-5" />
                            Add Custom Marker
                        </h3>

                        <div className="grid gap-4 sm:grid-cols-4">
                            <div className="sm:col-span-2">
                                <Label htmlFor="marker-title">Location Name</Label>
                                <Input
                                    id="marker-title"
                                    value={newMarkerTitle}
                                    onChange={(e) => setNewMarkerTitle(e.target.value)}
                                    placeholder="e.g. My Favorite Place"
                                />
                            </div>
                            <div>
                                <Label htmlFor="marker-lat">Latitude</Label>
                                <Input
                                    id="marker-lat"
                                    value={newMarkerLat}
                                    onChange={(e) => setNewMarkerLat(e.target.value)}
                                    placeholder="e.g. 37.7749"
                                />
                            </div>
                            <div>
                                <Label htmlFor="marker-lng">Longitude</Label>
                                <Input
                                    id="marker-lng"
                                    value={newMarkerLng}
                                    onChange={(e) => setNewMarkerLng(e.target.value)}
                                    placeholder="e.g. -122.4194"
                                />
                            </div>
                            <div className="sm:col-span-4">
                                <Button
                                    onClick={addMarker}
                                    className="mt-2"
                                    disabled={!newMarkerTitle || !newMarkerLat || !newMarkerLng}
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add Marker
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
