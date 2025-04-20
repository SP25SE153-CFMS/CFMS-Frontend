'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from '@/components/fallback-image';
import { Download, ChevronLeft, Search, Filter } from 'lucide-react';

import { DataTable } from '@/components/table/data-table';
import { columns } from './columns';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getChickenBatchByCoopId } from '@/services/chicken-batch.service';
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
import { getChickenCoopsByBreedingAreaId } from '@/services/chicken-coop.service';
import ChickenBatchForm from '@/components/forms/chicken-batch-form';
import { cn } from '@/lib/utils';
import config from '@/configs';
import Link from 'next/link';
import { getCookie } from 'cookies-next';

export default function Page() {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBreedingAreaId, setSelectedBreedingAreaId] = useState('');
    const [selectedChickenCoopId, setSelectedChickenCoopId] = useState('');

    const onOpenChange = (val: boolean) => setOpen(val);

    // Fetch all breeding areas
    const { data: breedingAreas, isLoading: isLoadingBreedingAreas } = useQuery({
        queryKey: ['breedingAreas'],
        queryFn: async () => {
            const farmId = getCookie(config.cookies.farmId) ?? '';
            const areas = await getBreedingAreasByFarmId(farmId);
            const filteredAreas = areas.filter((area) => area.chickenCoops.length > 0);
            sessionStorage.setItem('breedingAreas', JSON.stringify(filteredAreas));
            return filteredAreas;
        },
    });

    // Fetch all chicken coops (only if a breeding area is selected)
    const {
        data: chickenCoops,
        isLoading: isLoadingChickenCoops,
        // refetch,
    } = useQuery({
        queryKey: ['chickenCoops', selectedBreedingAreaId],
        queryFn: () => getChickenCoopsByBreedingAreaId(selectedBreedingAreaId),
        enabled: !!selectedBreedingAreaId,
    });

    // Fetch chicken batches based on selected chicken coop
    const { data: chickenBatches, isLoading: isLoadingChickenBatches } = useQuery({
        queryKey: ['chickenBatches', selectedChickenCoopId],
        queryFn: () => getChickenBatchByCoopId(selectedChickenCoopId),
        enabled: !!selectedChickenCoopId,
    });

    // Set initial breeding area from sessionStorage
    useEffect(() => {
        const storedBreedingAreaId = sessionStorage.getItem('breedingAreaId') ?? '';
        if (storedBreedingAreaId && !selectedBreedingAreaId) {
            setSelectedBreedingAreaId(storedBreedingAreaId);
        }
        const storedChickenCoopId = sessionStorage.getItem('chickenCoopId') ?? '';
        if (storedChickenCoopId && !selectedChickenCoopId) {
            setSelectedChickenCoopId(storedChickenCoopId);
            sessionStorage.setItem(
                'chickenCoopName',
                chickenCoops?.find((coop) => coop.chickenCoopId === storedChickenCoopId)
                    ?.chickenCoopName ?? '',
            );
        }
    }, [chickenCoops, selectedBreedingAreaId, selectedChickenCoopId]);

    // Refetch chicken coops when breeding area changes
    // useEffect(() => {
    //     if (breedingAreas && breedingAreas.length > 0) {
    //         setSelectedBreedingAreaId(breedingAreas[0].breedingAreaId);
    //     }
    //     if (selectedBreedingAreaId) {
    //         // queryClient.invalidateQueries(['chickenCoops', selectedBreedingAreaId]);
    //         refetch(); // Ensures immediate refetch
    //         setSelectedChickenCoopId(chickenCoops?.[0]?.chickenCoopId ?? '');
    //         sessionStorage.setItem(
    //             'chickenCoopName',
    //             chickenCoops?.find((coop) => coop.chickenCoopId === chickenCoops?.[0].chickenCoopId)
    //                 ?.chickenCoopName ?? '',
    //         );
    //     }
    // }, [breedingAreas, chickenCoops, refetch, selectedBreedingAreaId]);

    // Handle breeding area change
    const handleBreedingAreaChange = (breedingAreaId: string) => {
        setSelectedBreedingAreaId(breedingAreaId);
        sessionStorage.setItem('breedingAreaId', breedingAreaId);
    };

    // Handle chicken coop change
    const handleChickenCoopChange = (chickenCoopId: string) => {
        setSelectedChickenCoopId(chickenCoopId);
        sessionStorage.setItem('chickenCoopId', chickenCoopId);
        sessionStorage.setItem(
            'chickenCoopName',
            chickenCoops?.find((coop) => coop.chickenCoopId === chickenCoopId)?.chickenCoopName ??
                '',
        );
    };

    // Filtered data based on search query
    const filteredData = chickenBatches?.filter(
        (batch) =>
            batch.chickenBatchName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            batch.chickenBatchId?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Get current chicken coop
    const currentChickenCoop = chickenCoops?.find(
        (coop) => coop.chickenCoopId === selectedChickenCoopId,
    );

    const isLoading = isLoadingBreedingAreas || isLoadingChickenCoops || isLoadingChickenBatches;

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
                                Hãy tạo khu vực nuôi trước khi tạo lứa nuôi
                            </p>
                        </div>
                        <Link href={config.routes.breadingArea}>
                            <Button variant="outline">
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Tạo khu nuôi
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!selectedBreedingAreaId || !selectedChickenCoopId) {
        return (
            <div className="w-full h-[70vh] flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg border-muted/40">
                    <CardContent className="flex flex-col justify-center items-center pt-6 pb-8 gap-6">
                        <div className="relative w-64 h-64">
                            <Image
                                src="/chicken-coop.png"
                                fill
                                className="object-contain"
                                alt="Chọn khu vực"
                            />
                        </div>
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold">Chọn khu nuôi và chuồng nuôi</h1>
                            <p className="text-muted-foreground">
                                Vui lòng chọn khu nuôi và chuồng nuôi để xem danh sách lứa nuôi
                            </p>
                        </div>
                        <div className="w-full max-w-xs">
                            <Select
                                value={selectedBreedingAreaId}
                                onValueChange={handleBreedingAreaChange}
                            >
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
                            <Select
                                value={selectedChickenCoopId}
                                onValueChange={handleChickenCoopChange}
                            >
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Chọn chuồng nuôi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {chickenCoops?.map((coop) => (
                                        <SelectItem
                                            key={coop.chickenCoopId}
                                            value={coop.chickenCoopId}
                                        >
                                            {coop.chickenCoopName}
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

    // if (!chickenBatches) {
    //     return (
    //         <div className="space-y-6">
    //             <div className="flex items-center text-sm text-muted-foreground">
    //                 <Button
    //                     variant="ghost"
    //                     size="sm"
    //                     className="gap-1 p-0"
    //                     onClick={() => window.history.back()}
    //                 >
    //                     <ChevronLeft className="h-4 w-4" />
    //                     Khu vực nuôi
    //                 </Button>
    //                 <span className="mx-2">/</span>
    //                 <span>Lứa nuôi</span>
    //             </div>

    //             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    //                 <div>
    //                     <div className="flex items-center gap-3">
    //                         <h1 className="text-3xl font-bold tracking-tight">
    //                             Danh sách lứa nuôi
    //                         </h1>
    //                         <Badge variant="outline" className="text-sm">
    //                             {currentChickenCoop?.chickenCoopName}
    //                         </Badge>
    //                     </div>
    //                     <p className="text-muted-foreground mt-1">
    //                         Quản lý tất cả các lứa nuôi trong khu vực
    //                     </p>
    //                 </div>
    //                 <div className="flex flex-wrap gap-2">
    //                     <Select
    //                         value={selectedBreedingAreaId}
    //                         onValueChange={handleBreedingAreaChange}
    //                     >
    //                         <SelectTrigger className="w-[200px]">
    //                             <SelectValue placeholder="Chọn khu vực nuôi" />
    //                         </SelectTrigger>
    //                         <SelectContent>
    //                             {breedingAreas.map((area) => (
    //                                 <SelectItem
    //                                     key={area.breedingAreaId}
    //                                     value={area.breedingAreaId}
    //                                 >
    //                                     {area.breedingAreaName}
    //                                 </SelectItem>
    //                             ))}
    //                         </SelectContent>
    //                     </Select>
    //                     <Button className="h-9" onClick={openModal}>
    //                         <Plus className="mr-2 h-4 w-4" />
    //                         Tạo lứa nuôi
    //                     </Button>
    //                 </div>
    //             </div>

    //             <div className="w-full h-[50vh] flex items-center justify-center p-4">
    //                 <Card className="w-full max-w-md shadow-lg border-muted/40 mt-24">
    //                     <CardContent className="flex flex-col justify-center items-center pt-6 pb-8 gap-6">
    //                         <div className="relative w-64 h-64">
    //                             <Image
    //                                 src="/no-data.jpg"
    //                                 fill
    //                                 className="object-contain"
    //                                 alt="Không có dữ liệu"
    //                             />
    //                         </div>
    //                         <div className="text-center space-y-2">
    //                             <h1 className="text-2xl font-bold">Chưa có lứa nuôi nào</h1>
    //                             <p className="text-muted-foreground">
    //                                 Hãy tạo lứa nuôi đầu tiên cho khu vực này
    //                             </p>
    //                         </div>
    //                         <Button onClick={openModal}>
    //                             <Plus className="mr-1 h-4 w-4" />
    //                             Tạo lứa nuôi
    //                         </Button>
    //                     </CardContent>
    //                 </Card>
    //             </div>

    //             <Dialog open={open} onOpenChange={onOpenChange}>
    //                 <DialogContent className="sm:max-w-[500px]">
    //                     <DialogHeader>
    //                         <DialogTitle>Tạo lứa nuôi mới</DialogTitle>
    //                         <DialogDescription>
    //                             Hãy nhập các thông tin dưới đây để tạo lứa nuôi mới.
    //                         </DialogDescription>
    //                     </DialogHeader>
    //                     <ChickenBatchForm
    //                         chickenCoopName={currentChickenCoop?.chickenCoopName ?? ''}
    //                         closeDialog={() => setOpen(false)}
    //                     />
    //                 </DialogContent>
    //             </Dialog>
    //         </div>
    //     );
    // }

    const inactiveBatches = filteredData?.filter((batch) => batch.status.toString() === '0');
    const activeBatches = filteredData?.filter((batch) => batch.status.toString() === '1');

    return (
        <div className="space-y-6">
            <div className="flex items-center text-sm text-muted-foreground">
                <Link
                    href={config.routes.chickenCoop}
                    className={cn(buttonVariants({ variant: 'ghost' }), 'p-0')}
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Chuồng nuôi</span>
                </Link>
                <span className="mx-2">/</span>
                <span>Lứa nuôi</span>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">Danh sách lứa nuôi</h1>
                        <Badge variant="outline" className="text-sm">
                            {currentChickenCoop?.chickenCoopName}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Quản lý tất cả các lứa nuôi trong khu vực
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Select value={selectedBreedingAreaId} onValueChange={handleBreedingAreaChange}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Chọn khu nuôi" />
                        </SelectTrigger>
                        <SelectContent>
                            {breedingAreas.map((area) => (
                                <SelectItem key={area.breedingAreaId} value={area.breedingAreaId}>
                                    {area.breedingAreaName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedChickenCoopId} onValueChange={handleChickenCoopChange}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Chọn chuồng nuôi" />
                        </SelectTrigger>
                        <SelectContent>
                            {chickenCoops?.map((coop) => (
                                <SelectItem key={coop.chickenCoopId} value={coop.chickenCoopId}>
                                    {coop.chickenCoopName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        className="h-9"
                        onClick={() => downloadCSV(chickenBatches || [], 'chicken-batches.csv')}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Xuất CSV
                    </Button>
                    {/* <Button className="h-9" onClick={openModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tạo lứa nuôi
                    </Button> */}
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm lứa nuôi..."
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
                                <DropdownMenuContent align="end">
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
                                    <DropdownMenuItem>Tất cả lứa</DropdownMenuItem>
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
                            <TabsTrigger value="all">
                                Tất cả ({chickenBatches?.length ?? 0})
                            </TabsTrigger>
                            <TabsTrigger value="active">
                                Đang hoạt động ({activeBatches?.length ?? 0})
                            </TabsTrigger>
                            <TabsTrigger value="inactive">
                                Tạm ngưng ({inactiveBatches?.length ?? 0})
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="m-0">
                            <DataTable data={filteredData || []} columns={columns} />
                        </TabsContent>
                        <TabsContent value="active" className="m-0">
                            <DataTable data={activeBatches || []} columns={columns} />
                        </TabsContent>
                        <TabsContent value="inactive" className="m-0">
                            <DataTable data={inactiveBatches || []} columns={columns} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Tạo lứa nuôi mới</DialogTitle>
                        <DialogDescription>
                            Hãy nhập các thông tin dưới đây để tạo lứa nuôi mới.
                        </DialogDescription>
                    </DialogHeader>
                    <ChickenBatchForm
                        chickenCoopName={currentChickenCoop?.chickenCoopName ?? ''}
                        closeDialog={() => setOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
