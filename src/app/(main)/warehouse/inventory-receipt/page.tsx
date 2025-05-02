'use client';

import { DataTable } from '@/components/table/data-table';
import { useQuery } from '@tanstack/react-query';
import { columns } from './columns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card } from '@/components/ui/card';
import Image from '@/components/fallback-image';
import { Button } from '@/components/ui/button';
import { getReceipts } from '@/services/request.service';
import { getUsers } from '@/services/user.service';
import { useMemo } from 'react';
import { User } from '@/utils/schemas/user.schema';

export default function InventoryReceipt() {
    const { data: receipts, isLoading } = useQuery({
        queryKey: ['receipts'],
        queryFn: () => getReceipts(),
    });

    useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const users = await getUsers();
            sessionStorage.setItem('users', JSON.stringify(users));
            return users;
        },
    });

    const filteredReceipt = useMemo(() => {
        if (!receipts) return [];

        const users: User[] = JSON.parse(sessionStorage.getItem('users') || '[]');

        return receipts.filter((receipt) => {
            const createdBy = users.find((user) => user.userId === receipt.createdByUserId);
            return !!createdBy;
        });
    }, [receipts]);

    // console.log('Toan bo receipt: ', receipts);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
            </div>
        );
    }

    if (!receipts) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Card className="px-36 py-8">
                    <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                        <Image src="/no-data.jpg" width={300} height={300} alt="Not found" />
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
                <h2 className="text-2xl font-bold tracking-tight">Phiếu nhập/xuất nội bộ</h2>
                <p className="text-muted-foreground">Danh sách tất cả phiếu nhập/xuất nội bộ</p>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <DataTable data={filteredReceipt} columns={columns} />
            </div>
        </div>
    );
}
