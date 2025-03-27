'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, Search, ChevronLeft, Plus } from 'lucide-react';

import { columns } from './columns';

import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { downloadCSV } from '@/utils/functions/download-csv.function';
import { Input } from '@/components/ui/input';
import { getGrowthStages } from '@/services/growth-stage.service';
import GrowthStageForm from '@/components/forms/growth-stage-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export default function Page() {
    const [open, setOpen] = useState(false);
    const openModal = () => setOpen(true);
    const onOpenChange = (val: boolean) => setOpen(val);

    const [searchTerm, setSearchTerm] = useState('');

    const { data: growthStages, isLoading } = useQuery({
        queryKey: ['growthStages'],
        queryFn: () => getGrowthStages(),
    });

    // Check if growthStages is loading
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[75vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">
                    Đang tải dữ liệu giai đoạn phát triển...
                </p>
            </div>
        );
    }

    // Check if growthStages is not null, undefined
    if (!growthStages) {
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
                            <h1 className="text-2xl font-bold">Chưa có giai đoạn phát triển nào</h1>
                            <p className="text-muted-foreground">
                                Hãy tạo giai đoạn phát triển đầu tiên cho trang trại này
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => window.history.back()}>
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Quay lại
                            </Button>
                            <Dialog open={open} onOpenChange={onOpenChange}>
                                <DialogTrigger asChild>
                                    <Button className="h-9" onClick={openModal}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tạo giai đoạn phát triển
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Tạo giai đoạn phát triển mới</DialogTitle>
                                        <DialogDescription>
                                            Hãy nhập các thông tin dưới đây để tạo giai đoạn phát
                                            triển mới.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <GrowthStageForm closeDialog={() => setOpen(false)} />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Filter growth stages based on search term
    const filteredGrowthStages = growthStages.filter(
        (stage) =>
            searchTerm === '' ||
            stage.stageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stage.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="space-y-6">
            {/* Header */}
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
                <span>Giai đoạn phát triển</span>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Quản lý giai đoạn phát triển
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Quản lý tất cả các giai đoạn phát triển trong trang trại
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        className="h-9"
                        onClick={() => downloadCSV(growthStages, 'growth-stages.csv')}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Xuất CSV
                    </Button>
                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogTrigger asChild>
                            <Button className="h-9" onClick={openModal}>
                                <Plus className="mr-2 h-4 w-4" />
                                Tạo giai đoạn
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo giai đoạn phát triển mới</DialogTitle>
                                <DialogDescription>
                                    Hãy nhập các thông tin dưới đây để tạo giai đoạn phát triển mới.
                                </DialogDescription>
                            </DialogHeader>
                            <GrowthStageForm closeDialog={() => setOpen(false)} />
                        </DialogContent>
                    </Dialog>
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
                                placeholder="Tìm kiếm giai đoạn phát triển..."
                                className="pl-8 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable data={filteredGrowthStages} columns={columns} />
                </CardContent>
            </Card>
        </div>
    );
}
