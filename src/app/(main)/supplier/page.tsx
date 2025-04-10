'use client';

import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { columns } from './columns';
import { ScrollArea } from '@/components/ui/scroll-area';
import SupplierForm from '@/components/forms/supplier-form';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {  getSuppliersByFarmId } from '@/services/supplier.service';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { getCookie } from 'cookies-next';
import config from '@/configs';

export default function Supplier() {
    const [openDialog, setOpenDialog] = useState(false);

    const farmId = getCookie(config.cookies.farmId) ?? '';
    const { data: suppliers = [], isLoading } = useQuery({
        queryKey: ['suppliers', farmId],
        queryFn: () => getSuppliersByFarmId(farmId),
        enabled: !!farmId
    });

    const open = () => setOpenDialog(true);
    const closeDialog = () => setOpenDialog(false);
    const onOpenChange = (val: boolean) => setOpenDialog(val);


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
            </div>
        );
    }

    if (!suppliers) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Card className="px-36 py-8">
                    <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                        <Image src="/no-data.jpg" width={300} height={300} alt="Not Found" />
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
            <h1 className="text-2xl font-bold tracking-tight">Danh sách nhà cung cấp</h1>

            <div className="flex relative gap-x-4 items-center">
                <div className="absolute right-0 mb-3">
                    <Button onClick={open}>
                        <span>Tạo</span> <Plus size={18} />
                    </Button>

                    <Dialog open={openDialog} onOpenChange={onOpenChange}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="font-semibold">
                                    Thêm nhà cung cấp
                                </DialogTitle>
                                <DialogDescription>Nhập đầy đủ thông tin dưới.</DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[600px]">
                                <SupplierForm closeDialog={closeDialog} />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <DataTable data={suppliers} columns={columns} />
        </div>
    );
}
