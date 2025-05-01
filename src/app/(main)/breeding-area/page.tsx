'use client';

import { useState } from 'react';
import Image from '@/components/fallback-image';
import {
    Download,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    LayoutGrid,
    List,
    InboxIcon,
} from 'lucide-react';

import { columns } from './columns';

import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import BreedingAreaForm from '@/components/forms/breeding-area-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteBreedingArea, getBreedingAreasByFarmId } from '@/services/breeding-area.service';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
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
import toast from 'react-hot-toast';
import { BreedingArea } from '@/utils/schemas/breeding-area.schema';
import BreedingAreaCard from './card';
import { getCookie } from 'cookies-next';
import config from '@/configs';
import Link from 'next/link';
import DeleteConfirmDialog from '@/components/delete-confirm-dialog';

export default function Page() {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
    const [tab, setTab] = useState('all');

    const {
        data: breedingAreas,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['breedingAreas'],
        queryFn: async () => {
            const breedingAreas = await getBreedingAreasByFarmId(
                getCookie(config.cookies.farmId) ?? '',
            );
            sessionStorage.setItem('breedingAreas', JSON.stringify(breedingAreas));
            return breedingAreas;
        },
    });

    const handleUpdate = (row: BreedingArea) => {
        setRow(row);
        setOpenUpdate(true);
    };

    const mutation = useMutation({
        mutationFn: deleteBreedingArea,
        onSuccess: () => {
            toast.success('Đã xóa khu nuôi');
            refetch();
            setOpenDelete(false);
        },
        onError: (error: any) => {
            console.error(error);
            toast(error?.response?.data?.message, { icon: '⚠️' });
        },
    });

    const handleDelete = async (breedingAreaId: string) => {
        mutation.mutate(breedingAreaId);
    };

    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [row, setRow] = useState<BreedingArea>({} as BreedingArea);

    // Check if breedingAreas is loading
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[75vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu khu nuôi...</p>
            </div>
        );
    }

    // Check if breedingAreas is not null, undefined
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
                            <h1 className="text-2xl font-bold">Chưa có khu nuôi nào</h1>
                            <p className="text-muted-foreground">
                                Hãy tạo khu nuôi đầu tiên cho trang trại này
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => window.history.back()}>
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Quay lại
                            </Button>
                            <Button onClick={() => setOpen(true)}>
                                <Plus className="mr-1 h-4 w-4" />
                                Tạo khu nuôi
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Create Breeding Area Dialog */}
                <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Tạo khu nuôi mới</DialogTitle>
                            <DialogDescription>
                                Hãy nhập các thông tin dưới đây để tạo khu nuôi mới.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-[70vh]">
                            <BreedingAreaForm closeDialog={() => setOpen(false)} />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    // Filter breeding areas based on search term and status
    const filteredBreedingAreas = breedingAreas
        // .filter((area) => statusFilter === 'all' || area.status.toString() === statusFilter)
        .filter(
            (area) =>
                searchTerm === '' ||
                area.breedingAreaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                area.breedingAreaCode?.toLowerCase().includes(searchTerm.toLowerCase()),
        );

    // Count areas by status
    const inactiveAreas = filteredBreedingAreas.filter((area) => area.status.toString() === '0');
    const activeAreas = filteredBreedingAreas.filter((area) => area.status.toString() === '1');

    const renderBreedingAreas = (statusFilter: string) => {
        const areas =
            statusFilter === 'all'
                ? filteredBreedingAreas
                : filteredBreedingAreas.filter((area) => area.status.toString() === statusFilter);
        if (viewMode === 'table') {
            return <DataTable data={areas} columns={columns} />;
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {areas.length === 0 && (
                    <div className="flex h-[200px] flex-col items-center justify-center gap-2 p-4 text-center mx-auto col-span-1 md:col-span-2 lg:col-span-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <InboxIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h4 className="text-sm font-medium">Không có khu nuôi nào</h4>
                    </div>
                )}
                {areas.map((area) => (
                    <BreedingAreaCard
                        key={area.breedingAreaId}
                        area={area}
                        handleUpdate={handleUpdate}
                        setOpenDelete={() => setOpenDelete(true)}
                        setRow={setRow}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center text-sm text-muted-foreground">
                <Link href={config.routes.farm}>
                    <Button variant="ghost" size="sm" className="gap-1 p-0">
                        <ChevronLeft className="h-4 w-4" />
                        Trang trại
                    </Button>
                </Link>
                <span className="mx-2">/</span>
                <span>Khu nuôi</span>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý khu nuôi</h1>
                    <p className="text-muted-foreground mt-1">
                        Quản lý tất cả các khu nuôi trong trang trại
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        className="h-9"
                        onClick={() => downloadCSV(breedingAreas, 'breeding-areas.csv')}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Xuất CSV
                    </Button>
                    <Button className="h-9" onClick={() => setOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tạo khu nuôi
                    </Button>
                </div>
            </div>

            {/* Tabs and Content */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm khu nuôi..."
                                className="pl-8 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                                <DropdownMenuContent align="end" className="w-[200px]">
                                    <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => setTab('all')}>
                                        Tất cả
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTab('0')}>
                                        Tạm ngưng
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTab('1')}>
                                        Đang hoạt động
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>Hiển thị</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => setViewMode('table')}>
                                        Dạng bảng
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setViewMode('grid')}>
                                        Dạng lưới
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <div className="border rounded-md p-1 flex">
                                <Button
                                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => setViewMode('table')}
                                >
                                    <List className="h-4 w-4" />
                                    <span className="sr-only">Dạng bảng</span>
                                </Button>
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                    <span className="sr-only">Dạng lưới</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs
                        defaultValue={tab}
                        className="w-full"
                        onValueChange={(val) => setTab(val)}
                        value={tab}
                    >
                        <TabsList className="mb-4">
                            <TabsTrigger value="all">
                                Tất cả ({filteredBreedingAreas.length})
                            </TabsTrigger>
                            <TabsTrigger value="0">Tạm ngưng ({inactiveAreas.length})</TabsTrigger>
                            <TabsTrigger value="1">
                                Đang hoạt động ({activeAreas.length})
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="all">{renderBreedingAreas('all')}</TabsContent>
                        <TabsContent value="0">{renderBreedingAreas('0')}</TabsContent>
                        <TabsContent value="1">{renderBreedingAreas('1')}</TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Create Breeding Area Dialog */}
            <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Tạo khu nuôi mới</DialogTitle>
                        <DialogDescription>
                            Hãy nhập các thông tin dưới đây để tạo khu nuôi mới.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[70vh]">
                        <BreedingAreaForm closeDialog={() => setOpen(false)} />
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Update Breeding Area Dialog */}
            <Dialog open={openUpdate} onOpenChange={(val) => setOpenUpdate(val)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Cập nhật khu nuôi</DialogTitle>
                        <DialogDescription>Hãy nhập các thông tin dưới đây.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[600px]">
                        <BreedingAreaForm
                            closeDialog={() => setOpenUpdate(false)}
                            defaultValues={row}
                        />
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                open={openDelete}
                setOpen={setOpenDelete}
                handleDelete={() => handleDelete(row.breedingAreaId)}
                confirmValue={row.breedingAreaCode}
                label="Mã khu nuôi"
                isPending={mutation.isPending}
            />
        </div>
    );
}
