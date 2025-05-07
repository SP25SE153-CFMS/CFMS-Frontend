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
import { Trash } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';
import { deleteVaccinationLog } from '@/services/vaccination-log.service';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import TaskDialog from '../task-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { getCriteria } from '@/utils/functions/category.function';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { HealthLogResponse } from '@/utils/types/custom.type';

interface Props<T> {
    row: Row<T>;
}

export function DataTableRowActions<T>({ row }: Props<T>) {
    const [openTask, setOpenTask] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const healthLog = row.original as HealthLogResponse;

    const queryClient = useQueryClient();
    const { chickenBatchId }: { chickenBatchId: string } = useParams();

    const handleDelete = async () => {
        await deleteVaccinationLog(healthLog.healthLogId).then(() => {
            toast.success('Xóa nhật ký sức khỏe thành công');
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-red-600">
                        Xóa <Trash size={16} className="ml-auto" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Task Dialog */}
            <TaskDialog open={openTask} onOpenChange={setOpenTask} taskId={healthLog.taskId} />

            {/* Details Dialog */}
            <Dialog open={openDetails} onOpenChange={setOpenDetails}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chi tiết nhật ký</DialogTitle>
                        <DialogDescription>
                            Dưới đây là các thông tin chi tiết của nhật ký sức khỏe.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col">
                        <Table>
                            <TableHeader className="bg-muted/50 sticky top-0">
                                <TableRow>
                                    <TableHead className="font-medium">Tiêu chí đánh giá</TableHead>
                                    <TableHead className="font-medium">Kết quả</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {healthLog.healthLogDetails.length > 0 ? (
                                    healthLog.healthLogDetails.map((log, index) => (
                                        <TableRow key={index} className="hover:bg-muted/30">
                                            <TableCell className="font-medium">
                                                {getCriteria(log.criteriaId)}
                                            </TableCell>
                                            <TableCell>{log.result || 'Không có'}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center py-6 text-muted-foreground"
                                        >
                                            Không tìm thấy dữ liệu phù hợp
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa lịch sử sức khỏe này?
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
