'use client';

import { DataTable } from '@/components/table/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
// } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from '@/components/fallback-image';
import Link from 'next/link';
import config from '@/configs';
import { Separator } from '@/components/ui/separator';
import { getWareById, getWareStockByResourceTypeId } from '@/services/warehouse.service';

export default function Page() {
    // const [open, setOpen] = useState(false);
    const [wId, setWId] = useState('');
    const [rId, setRId] = useState('');

    // const openModal = () => setOpen(true);
    // const onOpenChange = (val: boolean) => setOpen(val);

    useEffect(() => {
        const wId = sessionStorage.getItem('wareId') ?? '';
        const rId = sessionStorage.getItem('resourceTypeId') ?? '';

        setWId(wId);
        setRId(rId);
    }, []);

    const { data, isLoading } = useQuery({
        queryKey: ['data', wId, rId],
        queryFn: () => getWareStockByResourceTypeId(wId, rId),
        enabled: !!wId && !!rId,
    });

    const { data: ware } = useQuery({
        queryKey: ['ware', wId],
        queryFn: () => getWareById(wId),
        enabled: !!wId,
    });

    // Check if data is loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
            </div>
        );
    }

    // Check if data is not null, undefined
    if (!data || !ware) {
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

    // Return the page
    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link href={config.routes.ware}>
                    <Button type="button" variant="outline" className="w-auto">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Trở về
                    </Button>
                </Link>

                {/* <Button onClick={openModal} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo mới
                </Button> */}
            </div>

            <Card className="shadow-sm border-muted">
                <CardHeader className="pb-6 items-center justify-center">
                    <div className="flex items-center gap-2">
                        {/* <Wheat className="h-5 w-5 text-muted-foreground" /> */}
                        <CardTitle className="text-2xl font-bold">
                            Quản lý {ware.warehouseName}
                        </CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                        Danh sách tất cả dữ liệu trong {ware.warehouseName} của trang trại
                    </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                    <DataTable data={data} columns={columns} />
                </CardContent>
            </Card>

            {/* <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Tạo dữ liệu</DialogTitle>
                        <DialogDescription>Nhập đầy đủ các thông tin dưới.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[70vh]">
                        <div className="p-1">
                            <ChickenForm closeDialog={() => setOpen(false)} />
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog> */}
        </div>
    );
}
