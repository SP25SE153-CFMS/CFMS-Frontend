'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from '@/components/fallback-image';
import { Download, Plus, ChevronLeft, Search, Filter } from 'lucide-react';

import { DataTable } from '@/components/table/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChickenCoopForm from '@/components/forms/chicken-coop-form';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getChickenCoopsByBreedingAreaId } from '@/services/chicken-coop.service';
import { getBreedingAreasByFarmId } from '@/services/breeding-area.service';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { downloadCSV } from '@/utils/functions/download-csv.function';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getCookie } from 'cookies-next';
import config from '@/configs';
import Link from 'next/link';

export default function Page() {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBreedingAreaId, setSelectedBreedingAreaId] = useState('');

    const openModal = () => setOpen(true);
    const onOpenChange = (val: boolean) => setOpen(val);

    // Fetch all breeding areas
    const { data: breedingAreas, isLoading: isLoadingBreedingAreas } = useQuery({
        queryKey: ['breedingAreas'],
        queryFn: async () => {
            const areas = await getBreedingAreasByFarmId(getCookie(config.cookies.farmId) ?? '');
            sessionStorage.setItem('breedingAreas', JSON.stringify(areas));
            return areas;
        },
    });

    // Set initial breeding area from sessionStorage
    useEffect(() => {
        const storedBreedingAreaId = sessionStorage.getItem('breedingAreaId') ?? '';
        if (storedBreedingAreaId && !selectedBreedingAreaId) {
            setSelectedBreedingAreaId(storedBreedingAreaId);
        }
    }, [selectedBreedingAreaId]);

    // Fetch chicken coops based on selected breeding area
    const { data: chickenCoops, isLoading: isLoadingChickenCoops } = useQuery({
        queryKey: ['chickenCoops', selectedBreedingAreaId],
        queryFn: async () => {
            const coops = await getChickenCoopsByBreedingAreaId(selectedBreedingAreaId);
            sessionStorage.setItem('chickenCoops', JSON.stringify(coops));
            return coops;
        },
        enabled: !!selectedBreedingAreaId,
    });

    // Handle breeding area change
    const handleBreedingAreaChange = (breedingAreaId: string) => {
        setSelectedBreedingAreaId(breedingAreaId);
        sessionStorage.setItem('breedingAreaId', breedingAreaId);
    };

    // Filtered data based on search query
    const filteredData = chickenCoops?.filter(
        (coop) =>
            coop.chickenCoopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            coop.chickenCoopCode?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Get current breeding area name
    const currentBreedingArea = breedingAreas?.find(
        (area) => area.breedingAreaId === selectedBreedingAreaId,
    );

    const isLoading = isLoadingBreedingAreas || isLoadingChickenCoops;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!breedingAreas || breedingAreas.length === 0) {
        return (
            <div className="w-full h-[70vh] flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg border-muted/40">
                    <CardContent className="flex flex-col justify-center items-center pt-6 pb-8 gap-6">
                        <div className="relative w-64 h-64">
                            <Image
                                src="/no-data.jpg"
                                fill
                                className="object-contain"
                                alt="Không có dữ liệu"
                            />
                        </div>
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold">Chưa có khu vực nuôi nào</h1>
                            <p className="text-muted-foreground">
                                Hãy tạo khu vực nuôi trước khi tạo chuồng nuôi
                            </p>
                        </div>
                        <Link href={config.routes.breadingArea}>
                            <Button variant="outline">
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Quay lại
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!selectedBreedingAreaId) {
        return (
            <div className="w-full h-[70vh] flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg border-muted/40">
                    <CardContent className="flex flex-col justify-center items-center pt-6 pb-8 gap-6">
                        <div className="relative w-64 h-64">
                            <Image
                                src="/breeding-area.png"
                                fill
                                className="object-contain"
                                alt="Chọn khu vực"
                            />
                        </div>
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold">Chọn khu vực nuôi</h1>
                            <p className="text-muted-foreground">
                                Vui lòng chọn khu vực nuôi để xem danh sách chuồng nuôi
                            </p>
                        </div>
                        <div className="w-full max-w-xs">
                            <Select onValueChange={handleBreedingAreaChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn khu vực nuôi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {breedingAreas.map((area) => (
                                        <SelectItem
                                            key={area.breedingAreaId}
                                            value={area.breedingAreaId}
                                        >
                                            {area.breedingAreaName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!chickenCoops) {
        return (
            <div className="space-y-6">
                <div className="flex items-center text-sm text-muted-foreground">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 p-0"
                        onClick={() => window.history.back()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Khu vực nuôi
                    </Button>
                    <span className="mx-2">/</span>
                    <span>Chuồng nuôi</span>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">
                                Danh sách chuồng nuôi
                            </h1>
                            <Badge variant="outline" className="text-sm">
                                {currentBreedingArea?.breedingAreaName}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">
                            Quản lý tất cả các chuồng nuôi trong khu vực
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Select
                            value={selectedBreedingAreaId}
                            onValueChange={handleBreedingAreaChange}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Chọn khu vực nuôi" />
                            </SelectTrigger>
                            <SelectContent>
                                {breedingAreas.map((area) => (
                                    <SelectItem
                                        key={area.breedingAreaId}
                                        value={area.breedingAreaId}
                                    >
                                        {area.breedingAreaName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button className="h-9" onClick={openModal}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo chuồng nuôi
                        </Button>
                    </div>
                </div>

                <div className="w-full h-[50vh] flex items-center justify-center p-4">
                    <Card className="w-full max-w-md shadow-lg border-muted/40 mt-24">
                        <CardContent className="flex flex-col justify-center items-center pt-6 pb-8 gap-6">
                            <div className="relative w-64 h-64">
                                <Image
                                    src="/no-data.jpg"
                                    fill
                                    className="object-contain"
                                    alt="Không có dữ liệu"
                                />
                            </div>
                            <div className="text-center space-y-2">
                                <h1 className="text-2xl font-bold">Chưa có chuồng nuôi nào</h1>
                                <p className="text-muted-foreground">
                                    Hãy tạo chuồng nuôi đầu tiên cho khu vực này
                                </p>
                            </div>
                            <Button onClick={openModal}>
                                <Plus className="mr-1 h-4 w-4" />
                                Tạo chuồng nuôi
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center text-sm text-muted-foreground">
                <Link href={config.routes.breadingArea}>
                    <Button variant="ghost" size="sm" className="gap-1 p-0">
                        <ChevronLeft className="h-4 w-4" />
                        Khu vực nuôi
                    </Button>
                </Link>
                <span className="mx-2">/</span>
                <span>Chuồng nuôi</span>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">Danh sách chuồng nuôi</h1>
                        <Badge variant="outline" className="text-sm">
                            {currentBreedingArea?.breedingAreaName}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Quản lý tất cả các chuồng nuôi trong khu vực
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Select value={selectedBreedingAreaId} onValueChange={handleBreedingAreaChange}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Chọn khu vực nuôi" />
                        </SelectTrigger>
                        <SelectContent>
                            {breedingAreas.map((area) => (
                                <SelectItem key={area.breedingAreaId} value={area.breedingAreaId}>
                                    {area.breedingAreaName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        className="h-9"
                        onClick={() => downloadCSV(chickenCoops, 'chicken-coops.csv')}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Xuất CSV
                    </Button>
                    <Button className="h-9" onClick={openModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tạo chuồng nuôi
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm chuồng nuôi..."
                                className="pl-8 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-9">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Lọc
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[220px]">
                                    <DropdownMenuLabel>Khu vực nuôi</DropdownMenuLabel>
                                    {breedingAreas.map((area) => (
                                        <DropdownMenuItem
                                            key={area.breedingAreaId}
                                            onClick={() =>
                                                handleBreedingAreaChange(area.breedingAreaId)
                                            }
                                            className="flex items-center justify-between"
                                        >
                                            {area.breedingAreaName}
                                            {area.breedingAreaId === selectedBreedingAreaId && (
                                                <Badge variant="secondary" className="ml-2">
                                                    Đang chọn
                                                </Badge>
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                                    <DropdownMenuItem>Tất cả chuồng</DropdownMenuItem>
                                    <DropdownMenuItem>Đang hoạt động</DropdownMenuItem>
                                    <DropdownMenuItem>Tạm ngưng</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="all">Tất cả ({chickenCoops.length})</TabsTrigger>
                            <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
                            <TabsTrigger value="inactive">Tạm ngưng</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="m-0">
                            <DataTable data={filteredData || []} columns={columns} />
                        </TabsContent>
                        <TabsContent value="active" className="m-0">
                            <DataTable
                                data={filteredData?.filter((coop) => coop.status === 0) || []}
                                columns={columns}
                            />
                        </TabsContent>
                        <TabsContent value="inactive" className="m-0">
                            <DataTable
                                data={filteredData?.filter((coop) => coop.status === 1) || []}
                                columns={columns}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Tạo chuồng nuôi mới</DialogTitle>
                        <DialogDescription>
                            Hãy nhập các thông tin dưới đây để tạo chuồng nuôi mới.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[70vh]">
                        <ChickenCoopForm closeDialog={() => setOpen(false)} />
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
