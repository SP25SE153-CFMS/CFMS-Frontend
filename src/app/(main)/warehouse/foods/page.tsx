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
        <div className="flex flex-col gap-y-5">
            <h1 className="text-2xl font-bold tracking-tight">Quản lý kho thức ăn</h1>

            <div className="flex relative gap-x-4 items-center mb-4">
                {/* <p className="font-semibold whitespace-nowrap">Tìm kiếm:</p>
                <Search onSearch={setSearchValue} /> */}

                <div className="absolute right-0">
                    <Button onClick={openModal}>
                        <span>Tạo</span> <Plus size={18} />
                    </Button>

                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent>
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

            <DataTable data={foods} columns={columns} />
        </div>
    );
}
