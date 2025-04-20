'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from '@/components/fallback-image';
import { ArrowLeft, Plus, Wheat } from 'lucide-react';

import { DataTable } from '@/components/table/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import CreateFoodForm from '@/components/forms/food-create-form';
import type { WareStockResponse } from '@/utils/types/custom.type';
import { getWareStockByResourceTypeId } from '@/services/warehouse.service';
import config from '@/configs';

export default function Foods() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [wId, setWId] = useState('');
    const [rId, setRId] = useState('');

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);
    const onOpenChange = (val: boolean) => setOpen(val);

    useEffect(() => {
        const wId = sessionStorage.getItem('wareId') ?? '';
        const rId = sessionStorage.getItem('resourceTypeId') ?? '';

        setWId(wId);
        setRId(rId);
    }, []);

    const { data: foods = [], isLoading } = useQuery<WareStockResponse[]>({
        queryKey: ['foods', wId, rId],
        queryFn: () => getWareStockByResourceTypeId(wId, rId),
        enabled: !!wId && !!rId,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <LoadingSpinner className="w-10 h-10" />
            </div>
        );
    }

    if (!foods) {
        return (
            <div className="w-full h-[70vh] flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-md">
                    <CardContent className="flex flex-col items-center justify-center pt-6 pb-8 space-y-6">
                        <div className="relative w-48 h-48">
                            <Image
                                src="/no-data.jpg"
                                fill
                                alt="Không tìm thấy dữ liệu"
                                className="object-contain"
                            />
                        </div>
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold">Danh sách không tồn tại</h1>
                            <p className="text-muted-foreground">
                                Không tìm thấy dữ liệu cho kho thức ăn này
                            </p>
                        </div>
                        <Button
                            variant="default"
                            onClick={() => window.history.back()}
                            className="px-6"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Quay lại
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(config.routes.ware)}
                    className="w-auto"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Trở về
                </Button>

                <Button onClick={openModal} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo mới
                </Button>
            </div>

            <Card className="shadow-sm border-muted">
                <CardHeader className="pb-6 items-center justify-center">
                    <div className="flex items-center gap-2">
                        <Wheat className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-2xl font-bold">Quản lý kho thức ăn</CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                        Danh sách tất cả thức ăn trong trang trại
                    </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                    <DataTable data={foods} columns={columns} />
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Tạo hàng hóa</DialogTitle>
                        <DialogDescription>Nhập đầy đủ các thông tin dưới.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[70vh]">
                        <div className="p-1">
                            <CreateFoodForm closeModal={closeModal} />
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
