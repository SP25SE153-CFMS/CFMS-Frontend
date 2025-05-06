import { useState } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, Notebook, Tag, Trash } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { deleteQuantityLog } from '@/services/chicken-batch.service';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { quantityLogStatusLabels } from '@/utils/enum/status.enum';
import { QuantityLogResponse } from '@/utils/types/custom.type';
import { chickenGenderLabels } from '@/utils/enum/gender.enum';
import { formatDate } from '@/utils/functions';
import TaskDialog from '../task-dialog';

interface Props<T> {
    row: Row<T>;
}

export function DataTableRowActions<T>({ row }: Props<T>) {
    const [openTask, setOpenTask] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const quantityLog = row.original as QuantityLogResponse;

    const queryClient = useQueryClient();
    const { chickenBatchId }: { chickenBatchId: string } = useParams();

    const handleDelete = async () => {
        await deleteQuantityLog(chickenBatchId, quantityLog.quantityLogId).then(() => {
            toast.success('Xóa lịch sử số lượng thành công');
            queryClient.invalidateQueries({ queryKey: ['chickenBatch', chickenBatchId] });
            setOpenDelete(false);
        });
    };

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-6 w-6 p-0">
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Mở menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setOpenTask(true)}>
                        Xem công việc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenDetails(true)}>
                        Xem chi tiết nhật ký
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
                        Cập nhật
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-red-600">
                        Xóa <Trash size={16} className="ml-auto" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Task Dialog */}
            <TaskDialog open={openTask} onOpenChange={setOpenTask} taskId={quantityLog.taskId} />

            {/* Details Dialog */}
            <Dialog open={openDetails} onOpenChange={setOpenDetails}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết nhật ký</DialogTitle>
                        <DialogDescription>
                            ID: {quantityLog.quantityLogDetails[0]?.quantityLogId}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Ngày ghi: </span>
                            <span className="text-sm font-medium">
                                {formatDate(quantityLog.logDate)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Notebook className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Loại: </span>
                            <span className="text-sm font-medium">
                                {quantityLogStatusLabels[quantityLog.logType]}
                            </span>
                        </div>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Số lượng gà</h3>
                                    <Badge variant="default" className="text-base">
                                        Tổng: {quantityLog.quantity}
                                    </Badge>
                                </div>

                                <div className="space-y-3">
                                    {quantityLog.quantityLogDetails.map((detail, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between border-b pb-2 last:border-0"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Tag className="h-4 w-4 text-muted-foreground" />
                                                <span>{chickenGenderLabels[detail.gender]}</span>
                                            </div>
                                            <Badge variant="outline">{detail.quantity} con</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {quantityLog.notes ? (
                            <div className="mt-2">
                                <h4 className="text-sm font-medium mb-1">Ghi chú</h4>
                                <p className="text-sm text-muted-foreground">{quantityLog.notes}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">Không có ghi chú</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa lịch sử số lượng này?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpenDelete(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Xóa
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
