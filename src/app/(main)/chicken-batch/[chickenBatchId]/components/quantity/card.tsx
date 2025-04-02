import { DataTable } from '@/components/table/data-table';
import { columns } from './columns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { downloadCSV } from '@/utils/functions/download-csv.function';
import { QuantityLog } from '@/utils/schemas/quantity-log.schema';

export default function CardQuantityLog({ quantityLogs }: { quantityLogs: QuantityLog[] }) {
    return (
        <div>
            <Card className="p-6 mb-4">
                <div className="flex flex-wrap items-center justify-between gap-x-4 space-y-2">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Nhật ký số lượng</h2>
                        <p className="text-muted-foreground">
                            Danh sách nhật ký số lượng của đàn gà
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="space-x-1"
                            onClick={() => downloadCSV(quantityLogs, 'quantity-logs.csv')}
                        >
                            <span>Tải file</span> <Download size={18} />
                        </Button>
                        {/* <Button className="space-x-1" onClick={openModal}>
                            <span>Thêm nhật ký</span> <Plus size={18} />
                        </Button>
                        <Dialog open={open} onOpenChange={onOpenChange}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Thêm nhật ký số lượng mới</DialogTitle>
                                    <DialogDescription>
                                        Hãy nhập các thông tin dưới đây.
                                    </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="max-h-[600px]">
                                    <QuantityLogForm closeDialog={() => setOpen(false)} />
                                </ScrollArea>
                            </DialogContent>
                        </Dialog> */}
                    </div>
                </div>
                <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <DataTable data={quantityLogs} columns={columns} />
                </div>
            </Card>
        </div>
    );
}
