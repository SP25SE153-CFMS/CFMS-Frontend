'use client';

import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { columns } from './columns';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card } from '@/components/ui/card';
import Image from '@/components/fallback-image';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import config from '@/configs';
import { getStockReceiptsByFarmId } from '@/services/stock-receipt.service';

export default function StockReceipt() {
    const router = useRouter();

    const { data: stockReceipts = [], isLoading } = useQuery({
        queryKey: ['stockReceipts'],
        queryFn: () => getStockReceiptsByFarmId(),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
            </div>
        );
    }

    if (!stockReceipts) {
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
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                        <h1 className="text-2xl font-bold tracking-tight">Danh sách đơn hàng</h1>
                    </div>

                    <p className="text-muted-foreground">
                        Danh sách tất cả các đơn hàng trong trang trại
                    </p>
                </div>
                <Button onClick={() => router.push(config.routes.createStockReceipt)}>
                    <span>Tạo đơn hàng</span> <Plus size={18} />
                </Button>
            </div>
            <Separator className="mb-6" />

            <DataTable data={stockReceipts} columns={columns} />
        </div>
    );
}
