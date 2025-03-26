'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tractor, Ruler, Scale3d, Plus, Search, Filter, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import config from '@/configs';
import { useQuery } from '@tanstack/react-query';
import { getFarms } from '@/services/farm.service';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { scaleLabels } from '@/utils/enum/status.enum';
import { Farm } from '@/utils/schemas/farm.schema';
import FarmMap from '@/components/farm-map';

export default function Page() {
    const { data: farms, isLoading } = useQuery({
        queryKey: ['farms'],
        queryFn: () => getFarms(),
    });

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedScale, setSelectedScale] = useState<number>(0);
    const [areaRange, setAreaRange] = useState<[number, number]>([0, 10000]);
    const [showFilters, setShowFilters] = useState(true);

    const farmScales = useMemo(() => {
        if (!farms) return [];
        return Array.from(new Set(farms.map((farm) => farm.scale)));
    }, [farms]);

    // Get max area for slider
    const maxArea = useMemo(() => {
        if (!farms) return 100;
        const max = Math.max(...farms.map((farm) => farm.area || 0));
        return max > 0 ? max : 100;
    }, [farms]);

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedScale(0);
        setAreaRange([0, maxArea]);
    };

    // Apply filters to farms
    const filteredFarms = useMemo(() => {
        if (!farms) return [];

        return farms.filter((farm) => {
            // Search term filter (farm name or farm code)
            const matchesSearch =
                searchTerm === '' ||
                farm.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                farm.farmCode.toLowerCase().includes(searchTerm.toLowerCase());

            // Scale filter
            const matchesScale = selectedScale === 0 || farm.scale === selectedScale;

            // Area range filter
            const matchesArea = farm.area >= areaRange[0] && farm.area <= areaRange[1];

            return matchesSearch && matchesScale && matchesArea;
        });
    }, [farms, searchTerm, selectedScale, areaRange]);

    // Active filter count
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (searchTerm) count++;
        if (selectedScale) count++;
        if (areaRange[0] > 0 || areaRange[1] < maxArea) count++;
        return count;
    }, [searchTerm, selectedScale, areaRange, maxArea]);

    // Check if farms is loading
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[100vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">
                    Đang tải dữ liệu trang trại...
                </p>
            </div>
        );
    }

    if (!farms) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <Image
                    src="/no-data.jpg"
                    alt="Không có trang trại"
                    width={400}
                    height={400}
                    className="mb-4"
                />
                <Card className="w-[300px]">
                    <CardHeader>
                        <CardTitle className="text-center">Không có trang trại</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground">
                            Hiện tại chưa có trang trại nào được đăng ký.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Link href={config.routes.farmRegister}>
                            <Button>Đăng ký trang trại mới</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold flex items-center">
                        <Tractor className="mr-2" />
                        Danh sách Trang trại
                    </h1>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="relative"
                        >
                            <Filter size={18} className="mr-2" />
                            <span>Bộ lọc</span>
                            {activeFilterCount > 0 && (
                                <Badge
                                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                                    variant="destructive"
                                >
                                    {activeFilterCount}
                                </Badge>
                            )}
                        </Button>
                        <Link href={config.routes.farmRegister}>
                            <Button>
                                <span>Thêm trang trại</span> <Plus size={18} className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filter Section */}
                {showFilters && (
                    <Card className="mb-4">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">Lọc trang trại</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetFilters}
                                    className="h-8 px-2 text-xs"
                                >
                                    <X size={14} className="mr-1" /> Xóa bộ lọc
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {/* Search by name or code */}
                                <div className="space-y-2">
                                    <Label htmlFor="search">Tìm kiếm</Label>
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="search"
                                            placeholder="Tên hoặc mã trang trại"
                                            className="pl-8"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Filter by scale */}
                                <div className="space-y-2">
                                    <Label htmlFor="scale">Quy mô</Label>
                                    <Select
                                        value={selectedScale.toString()}
                                        onValueChange={(value) => setSelectedScale(Number(value))}
                                    >
                                        <SelectTrigger id="scale">
                                            <SelectValue placeholder="Tất cả quy mô" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả quy mô</SelectItem>
                                            {farmScales.map((scale) => (
                                                <SelectItem key={scale} value={scale.toString()}>
                                                    {scaleLabels[scale]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Filter by area range */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label htmlFor="area">Diện tích (ha)</Label>
                                        <span className="text-xs text-muted-foreground">
                                            {areaRange[0]} - {areaRange[1]} ha
                                        </span>
                                    </div>
                                    <Slider
                                        id="area"
                                        min={0}
                                        max={maxArea}
                                        step={1}
                                        value={areaRange}
                                        onValueChange={(value) =>
                                            setAreaRange(value as [number, number])
                                        }
                                        className="py-4"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Results count */}
                <div className="text-sm text-muted-foreground mb-2">
                    Hiển thị {filteredFarms.length} / {farms.length} trang trại
                </div>

                {/* Farm cards */}
                <ScrollArea>
                    {filteredFarms.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <p className="text-muted-foreground mb-4">
                                Không tìm thấy trang trại phù hợp với bộ lọc
                            </p>
                            <Button variant="outline" onClick={resetFilters}>
                                Xóa bộ lọc
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                            <div className="md:col-span-2 h-full">
                                {/* TODO: Remove fake .map() */}
                                <FarmMap
                                    farms={filteredFarms.map((farm) => ({
                                        ...farm,
                                        latitude: 10 + Math.random(),
                                        longitude: 106 + Math.random(),
                                    }))}
                                />
                            </div>

                            <ScrollArea className="h-[30rem]">
                                <div className="px-4 overflow-auto h-full border-l border-red-500">
                                    <div className="space-y-2">
                                        {filteredFarms.map((farm) => (
                                            <FarmCard farm={farm} key={farm.farmId} />
                                        ))}
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}

export function FarmCard({ farm }: { farm: Farm }) {
    return (
        <Link
            href={`${config.routes.dashboard}?farmCode=${farm.farmCode}`}
            key={farm.farmId}
            rel="noopener noreferrer"
            onClick={() => {
                sessionStorage.setItem('farmId', farm.farmId);
            }}
        >
            <Card className="hover:shadow-lg transition-shadow duration-300 mb-4">
                <CardHeader>
                    <div className="flex items-center justify-between relative">
                        <CardTitle className="flex items-center">{farm.farmName}</CardTitle>
                        <Image
                            src={farm.imageUrl || '/assets/logo/logo.png'}
                            alt={farm.farmCode}
                            width={50}
                            height={50}
                            className="rounded-md object-cover absolute right-0 mt-6"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground mb-2">Mã: {farm.farmCode}</div>
                    {/* <div className="flex items-center mb-1">
                        <MapPin className="mr-2 h-4 w-4" />{' '}
                        <span className="truncate font-medium">{farm.address}</span>
                    </div> */}
                    <div className="flex items-center mb-1">
                        <Ruler className="mr-2 h-4 w-4" />
                        <span className="truncate font-medium">Diện tích: {farm.area} ha</span>
                    </div>
                    <div className="flex items-center mb-1">
                        <Scale3d className="mr-2 h-4 w-4" />
                        <span className="truncate font-medium">
                            Quy mô: {scaleLabels[farm.scale]}
                        </span>
                    </div>
                    {/*<div className="flex items-center mb-1">
                        <Phone className="mr-2 h-4 w-4" />
                        <span className="truncate font-medium">SĐT: {farm.phoneNumber}</span>
                    </div>
                    <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />{' '}
                        <span className="truncate font-medium">{farm.website}</span>
                    </div> */}
                </CardContent>
            </Card>
        </Link>
    );
}
