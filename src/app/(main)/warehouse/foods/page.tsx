'use client';

import { useState } from 'react';
import { DataTable } from '@/components/table/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useSearchParams } from 'next/navigation';
import { WareStockResponse } from '@/utils/types/custom.type';
import { getWareStockByResourceTypeId } from '@/services/warehouse.service';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import CreateFoodForm from '@/components/forms/food-create-form';

export default function Foods() {
    const [open, setOpen] = useState(false);
    const searchParams = useSearchParams();
    const wareId: string = searchParams.get('w') || '';
    const resourceTypeId: string = searchParams.get('r') || '';

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);
    const onOpenChange = (val: boolean) => setOpen(val);

    const { data: foods = [], isLoading } = useQuery<WareStockResponse[]>({
        queryKey: ['foods', wareId, resourceTypeId],
        queryFn: () => getWareStockByResourceTypeId(wareId, resourceTypeId),
        enabled: !!wareId && !!resourceTypeId,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
            </div>
        );
    }

    if (!foods) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Card className="px-8 py-8 md:px-36">
                    <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                        <Image
                            src="/no-data.jpg"
                            width={300}
                            height={300}
                            alt="Not Found"
                            className="object-contain"
                        />
                        <h1 className="text-2xl font-bold">Danh sách không tồn tại</h1>
                        <Button variant="outline" onClick={() => window.history.back()}>
                            Quay lại
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }
    return (
        <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quản lý kho thức ăn</h1>
                    <p className="text-muted-foreground">
                        Danh sách tất cả thức ăn trong trang trại
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button className="space-x-1" onClick={openModal}>
                        <span>Tạo</span> <Plus size={18} />
                    </Button>

                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader>
                                <DialogTitle className="font-semibold">Tạo hàng hóa</DialogTitle>
                                <DialogDescription>
                                    Nhập đầy đủ các thông tin dưới.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[600px]">
                                <CreateFoodForm closeModal={closeModal} />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <DataTable data={foods} columns={columns} />
            </div>
        </div>
    );
}
