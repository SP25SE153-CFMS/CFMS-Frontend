'use client';
import { Button } from '@/components/ui/button';
import config from '@/configs';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StockReceipt() {
    const router = useRouter();
    return (
        <div className="flex flex-col gap-y-5">
            <h1 className="text-2xl font-bold tracking-tight">Danh sách đơn hàng</h1>

            <div className="flex relative gap-x-4 items-center">
                <div className="absolute right-0 mb-3">
                    <Button onClick={() => router.push(config.routes.createStockReceipt)}>
                        <span>Tạo đơn hàng</span> <Plus size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
