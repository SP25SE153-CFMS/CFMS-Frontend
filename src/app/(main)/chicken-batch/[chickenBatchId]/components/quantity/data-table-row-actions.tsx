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
import { Calendar, Info, Notebook, Trash, Users } from 'lucide-react';
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
import { Card, CardContent } from '@/components/ui/card';
import { quantityLogStatusLabels } from '@/utils/enum/status.enum';
import { QuantityLogResponse } from '@/utils/types/custom.type';
import { ChickenGender } from '@/utils/enum/gender.enum';
import { formatDate } from '@/utils/functions';

interface Props<T> {
    row: Row<T>;
}

export function DataTableRowActions<T>({ row }: Props<T>) {
    // const [openTask, setOpenTask] = useState(false);
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

    // Calculate summary statistics
    const totalChickens = quantityLog?.quantityLogDetails?.reduce(
        (sum, detail) => sum + (detail.quantity || 0),
        0,
    );
    const totalRoosters = quantityLog?.quantityLogDetails
        ?.filter((detail) => detail.gender === ChickenGender.ROOSTER) // Assuming 0 is rooster based on the code
        .reduce((sum, detail) => sum + (detail.quantity || 0), 0);
    const totalHens = quantityLog?.quantityLogDetails
        ?.filter((detail) => detail.gender === ChickenGender.HEN) // Assuming 1 is hen based on the code
        .reduce((sum, detail) => sum + (detail.quantity || 0), 0);

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
                    {/* <DropdownMenuItem onClick={() => setOpenTask(true)}>
                        Xem công việc
                    </DropdownMenuItem> */}
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
            {/* <TaskDialog open={openTask} onOpenChange={setOpenTask} taskId={quantityLog.taskId} /> */}

            {/* Details Dialog */}
            <Dialog open={openDetails} onOpenChange={setOpenDetails}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết nhật ký</DialogTitle>
                        <DialogDescription>
                            Dưới đây là thông tin chi tiết về số lượng gà trong lứa
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
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
                                {quantityLog?.quantityLogDetails?.length > 0 ? (
                                    <div className="space-y-4">
                                        {/* Summary Section */}
                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/10 border border-primary/20">
                                                <Users className="h-5 w-5 mb-1 text-primary" />
                                                <span className="text-sm text-muted-foreground">
                                                    Tổng số
                                                </span>
                                                <span className="text-xl font-bold">
                                                    {totalChickens}
                                                </span>
                                            </div>

                                            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                                <div className="h-5 w-5 mb-1 text-blue-500">♂</div>
                                                <span className="text-sm text-muted-foreground">
                                                    Gà trống
                                                </span>
                                                <span className="text-xl font-bold text-blue-500">
                                                    {totalRoosters}
                                                </span>
                                            </div>

                                            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                                                <div className="h-5 w-5 mb-1 text-pink-500">♀</div>
                                                <span className="text-sm text-muted-foreground">
                                                    Gà mái
                                                </span>
                                                <span className="text-xl font-bold text-pink-500">
                                                    {totalHens}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Visualization */}
                                        <div className="relative h-6 bg-muted rounded-full overflow-hidden mb-4">
                                            {totalChickens > 0 && (
                                                <>
                                                    <div
                                                        className="absolute h-full bg-blue-500 transition-all duration-500"
                                                        style={{
                                                            width: `${(totalRoosters / totalChickens) * 100}%`,
                                                        }}
                                                    />
                                                    <div
                                                        className="absolute h-full bg-pink-500 transition-all duration-500"
                                                        style={{
                                                            width: `${(totalHens / totalChickens) * 100}%`,
                                                            left: `${(totalRoosters / totalChickens) * 100}%`,
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground mb-4">
                                            <span>
                                                Gà trống:{' '}
                                                {Math.round(
                                                    (totalRoosters / totalChickens) * 100,
                                                ) || 0}
                                                %
                                            </span>
                                            <span>
                                                Gà mái:{' '}
                                                {Math.round((totalHens / totalChickens) * 100) || 0}
                                                %
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center p-8">
                                        <div className="text-center">
                                            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                                <Info className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-medium mb-1">
                                                Không có thông tin chi tiết
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Chưa có dữ liệu về giống gà này
                                            </p>
                                        </div>
                                    </div>
                                )}
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
