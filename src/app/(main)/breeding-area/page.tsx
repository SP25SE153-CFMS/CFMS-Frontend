'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, Plus, Search, Filter, ChevronLeft, LayoutGrid, List } from 'lucide-react';

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
import { useQuery } from '@tanstack/react-query';
import { getBreedingAreasByFarmId } from '@/services/breeding-area.service';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { downloadCSV } from '@/utils/functions/download-csv.function';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import config from '@/configs';
import Link from 'next/link';
import { breedingAreaStatusLabels, breedingAreaStatusVariant } from '@/utils/enum/status.enum';

export default function Page() {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const openModal = () => setOpen(true);
    const closeDialog = () => setOpen(false);
    const onOpenChange = (val: boolean) => setOpen(val);

    const { data: breedingAreas, isLoading } = useQuery({
        queryKey: ['breedingAreas'],
        queryFn: () => getBreedingAreasByFarmId(sessionStorage.getItem('farmId') ?? ''),
    });

    // Check if breedingAreas is loading
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
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
                            <Button onClick={openModal}>
                                <Plus className="mr-1 h-4 w-4" />
                                Tạo khu nuôi
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Filter breeding areas based on search term and status
    const filteredBreedingAreas = breedingAreas.filter(
        (area) =>
            searchTerm === '' ||
            area.breedingAreaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (area.breedingAreaCode?.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (statusFilter === 'all' || area.status === statusFilter)),
    );

    // Count areas by status
    const inactiveAreas = breedingAreas.filter((area) => area.status.toString() === '0');
    const activeAreas = breedingAreas.filter((area) => area.status.toString() === '1');

    // Return the page
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
                    Trang trại
                </Button>
                <span className="mx-2">/</span>
                <span>Khu nuôi</span>
            </div>

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
                    <Button className="h-9" onClick={openModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tạo khu nuôi
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
                                    <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                                        Tất cả khu nuôi
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter('0')}>
                                        Đang hoạt động
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter('1')}>
                                        Tạm ngưng
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
                        defaultValue="all"
                        className="w-full"
                        onValueChange={(value) => setStatusFilter(value === 'all' ? 'all' : value)}
                    >
                        <TabsList className="mb-4">
                            <TabsTrigger value="all">Tất cả ({breedingAreas.length})</TabsTrigger>
                            <TabsTrigger value="0">Tạm ngưng ({inactiveAreas.length})</TabsTrigger>
                            <TabsTrigger value="1">
                                Đang hoạt động ({activeAreas.length})
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="m-0">
                            {viewMode === 'table' ? (
                                <DataTable data={filteredBreedingAreas} columns={columns} />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredBreedingAreas.map((area) => (
                                        <Card key={area.breedingAreaId} className="overflow-hidden">
                                            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {area.breedingAreaName}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {area.breedingAreaCode}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={breedingAreaStatusVariant[area.status]}
                                                >
                                                    {breedingAreaStatusLabels[area.status]}
                                                </Badge>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-2">
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {area.notes || 'Không có ghi chú'}
                                                </p>
                                            </CardContent>
                                            <CardFooter className="p-4 pt-0 flex justify-between">
                                                <Link
                                                    href={`${config.routes.chickenCoop}?breedingAreaId=${area.breedingAreaId}`}
                                                    onClick={() =>
                                                        sessionStorage.setItem(
                                                            'breedingAreaId',
                                                            area.breedingAreaId,
                                                        )
                                                    }
                                                >
                                                    <Button variant="outline" size="sm">
                                                        Xem chuồng nuôi
                                                    </Button>
                                                </Link>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <span className="sr-only">Mở menu</span>
                                                            <Filter className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            Chỉnh sửa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>Xóa</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="0" className="m-0">
                            {viewMode === 'table' ? (
                                <DataTable data={filteredBreedingAreas} columns={columns} />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredBreedingAreas.map((area) => (
                                        <Card key={area.breedingAreaId} className="overflow-hidden">
                                            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {area.breedingAreaName}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {area.breedingAreaCode}
                                                    </p>
                                                </div>
                                                <Badge variant="default">Hoạt động</Badge>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-2">
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {area.notes || 'Không có ghi chú'}
                                                </p>
                                            </CardContent>
                                            <CardFooter className="p-4 pt-0 flex justify-between">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        sessionStorage.setItem(
                                                            'breedingAreaId',
                                                            area.breedingAreaId,
                                                        );
                                                        window.location.href = '/chicken-coops';
                                                    }}
                                                >
                                                    Xem chuồng nuôi
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <span className="sr-only">Mở menu</span>
                                                            <Filter className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            Chỉnh sửa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>Xóa</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="1" className="m-0">
                            {viewMode === 'table' ? (
                                <DataTable data={filteredBreedingAreas} columns={columns} />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredBreedingAreas.map((area) => (
                                        <Card key={area.breedingAreaId} className="overflow-hidden">
                                            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {area.breedingAreaName}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {area.breedingAreaCode}
                                                    </p>
                                                </div>
                                                <Badge variant="secondary">Tạm ngưng</Badge>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-2">
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {area.notes || 'Không có ghi chú'}
                                                </p>
                                            </CardContent>
                                            <CardFooter className="p-4 pt-0 flex justify-between">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        sessionStorage.setItem(
                                                            'breedingAreaId',
                                                            area.breedingAreaId,
                                                        );
                                                        window.location.href = '/chicken-coops';
                                                    }}
                                                >
                                                    Xem chuồng nuôi
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <span className="sr-only">Mở menu</span>
                                                            <Filter className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            Chỉnh sửa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>Xóa</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Tạo khu nuôi mới</DialogTitle>
                        <DialogDescription>
                            Hãy nhập các thông tin dưới đây để tạo khu nuôi mới.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[70vh]">
                        <BreedingAreaForm closeDialog={closeDialog} />
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
