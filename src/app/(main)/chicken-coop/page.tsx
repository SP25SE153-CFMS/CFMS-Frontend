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
import ChickenCoopForm from '@/components/chicken-coop-form';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getChickenCoops } from '@/services/chicken-coop.service';

export default function Page() {
    const [open, setOpen] = useState(false);

    const openModal = () => setOpen(true);
    const onOpenChange = (val: boolean) => setOpen(val);

    const { data: chickenCoops, isLoading } = useQuery({
        queryKey: ['chickenCoops'],
        queryFn: () => getChickenCoops(),
    });

    // Check if chickenCoops is loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />;
            </div>
        );
    }

    // Check if chickenCoops is not null, undefined
    if (!chickenCoops) {
        return <></>;
    }

    // Return the page
    return (
        <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Danh sách chuồng nuôi</h2>
                    <p className="text-muted-foreground">
                        Danh sách tất cả các chuồng nuôi trong khu nuôi
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="space-x-1">
                        <span>Tải file</span> <Download size={18} />
                    </Button>
                    <Button className="space-x-1" onClick={openModal}>
                        <span>Tạo</span> <Plus size={18} />
                    </Button>
                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo chuồng nuôi mới</DialogTitle>
                                <DialogDescription>
                                    Hãy nhập các thông tin dưới đây.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[600px]">
                                <ChickenCoopForm />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <DataTable data={chickenCoops} columns={columns} />
            </div>
        </div>
    );
}
