'use client';

import { DataTable } from '@/components/table/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { downloadCSV } from '@/utils/functions/download-csv.function';
import { getUsers } from '@/services/user.service';
import EmployeeForm from '@/components/forms/employee-form';

export default function Page() {
    const [open, setOpen] = useState(false);

    const openModal = () => setOpen(true);
    const onOpenChange = (val: boolean) => setOpen(val);

    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: () => getUsers(),
    });

    // Check if users is loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
            </div>
        );
    }

    // Check if users is not null, undefined
    if (!users) {
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
        <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Quản lý nhân công</h2>
                    <p className="text-muted-foreground">
                        Danh sách tất cả các nhân công trong trang trại
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="space-x-1"
                        onClick={() => downloadCSV(users, 'employees.csv')}
                    >
                        <span>Tải file</span> <Download size={18} />
                    </Button>
                    <Button className="space-x-1" onClick={openModal}>
                        <span>Tạo</span> <Plus size={18} />
                    </Button>
                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Tạo nhân công mới</DialogTitle>
                                <DialogDescription>
                                    Hãy nhập các thông tin dưới đây.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[600px]">
                                <EmployeeForm closeDialog={() => setOpen(false)} />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <DataTable data={users} columns={columns} />
            </div>
        </div>
    );
}
