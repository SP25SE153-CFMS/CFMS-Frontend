'use client';

import { DataTable } from '@/components/table/data-table';
import { columns } from './columns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Plus, Stethoscope } from 'lucide-react';
import { downloadCSV } from '@/utils/functions/download-csv.function';
import { HealthLog } from '@/utils/schemas/health-log.schema';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import HealthLogForm from '@/components/forms/health-log-form';
import { useState } from 'react';

export default function CardHealthLog({ healthLogs }: { healthLogs: HealthLog[] }) {
    const [open, setOpen] = useState(false);

    const onOpenChange = (val: boolean) => setOpen(val);

    return (
        <div>
            <Card className="p-6 mb-4">
                <div className="flex flex-wrap items-center justify-between gap-x-4 space-y-2">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Nhật ký sức khỏe</h2>
                        <p className="text-muted-foreground">
                            Danh sách nhật ký sức khỏe của lứa nuôi
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="space-x-1"
                            onClick={() => downloadCSV(healthLogs, 'health-logs.csv')}
                        >
                            <span>Tải file</span> <Download size={18} />
                        </Button>
                        <Button className="space-x-1" onClick={() => setOpen(true)}>
                            <span>Đánh giá</span> <Plus size={18} />
                        </Button>
                        <Dialog open={open} onOpenChange={onOpenChange}>
                            <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                    <DialogTitle className="flex">
                                        <Stethoscope className="w-5 h-5 mr-2 text-primary" />
                                        Thêm đánh giá sức khỏe mới
                                    </DialogTitle>
                                    <DialogDescription>
                                        Hãy nhập các thông tin dưới đây.
                                    </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="max-h-[600px]">
                                    <HealthLogForm closeDialog={() => setOpen(false)} />
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <DataTable data={healthLogs} columns={columns} />
                </div>
            </Card>
        </div>
    );
}
