'use client';

import { DataTable } from '@/components/table/data-table';
import { flocks } from '@/utils/data/table.data';
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
import FlockForm from '@/components/flock-form';

export default function Page() {
    const [open, setOpen] = useState(false);

    const openModal = () => setOpen(true);
    const onOpenChange = (val: boolean) => setOpen(val);

    return (
        <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Quản lý đàn gà</h2>
                    <p className="text-muted-foreground">
                        Danh sách tất cả các đàn gà trong trang trại
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
                                <DialogTitle>Tạo đàn gà mới</DialogTitle>
                                <DialogDescription>
                                    Hãy nhập các thông tin dưới đây.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[600px]">
                                <FlockForm />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <DataTable data={flocks} columns={columns} />
            </div>
        </div>
    );
}
