'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { ArrowLeft, Plus, Pill } from 'lucide-react';

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
import CreateMedicineForm from '@/components/forms/medicine-create-form';
import type { WareStockResponse } from '@/utils/types/custom.type';
import { getWareStockByResourceTypeId } from '@/services/warehouse.service';
import config from '@/configs';

export default function Page() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const searchParams = useSearchParams();
    const wId: string = searchParams.get('w') || '';
    const rId: string = searchParams.get('r') || '';

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);
    const onOpenChange = (val: boolean) => setOpen(val);

    // Get data medicine trong ware-stock
    const { data: medicines = [], isLoading } = useQuery<WareStockResponse[]>({
        queryKey: ['medicines', wId, rId],
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

    if (!medicines) {
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
                                Không tìm thấy dữ liệu cho danh mục thuốc này
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
                        <Pill className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-2xl font-bold">Danh mục thuốc</CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                        Danh sách tất cả thuốc trong trang trại
                    </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                    <DataTable data={medicines} columns={columns} />
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Tạo thuốc mới</DialogTitle>
                        <DialogDescription>Hãy nhập các thông tin dưới đây.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[70vh]">
                        <div className="p-1">
                            <CreateMedicineForm closeDialog={closeModal} />
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
