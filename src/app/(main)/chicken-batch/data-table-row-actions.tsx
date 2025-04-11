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
import { Trash, StopCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';
import { deleteChickenBatch, endChickenBatch } from '@/services/chicken-batch.service';
import { ChickenBatch } from '@/utils/schemas/chicken-batch.schema';
import ChickenBatchForm from '@/components/forms/chicken-batch-form';
import { useRouter } from 'next/navigation';
import config from '@/configs';
import { useQueryClient } from '@tanstack/react-query';
import { ChickenBatchStatus } from '@/utils/enum/status.enum';

interface Props<T> {
    row: Row<T>;
}

export function DataTableRowActions<T>({ row }: Props<T>) {
    const router = useRouter();
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const queryClient = useQueryClient();

    const chickenBatchId = (row.original as ChickenBatch).chickenBatchId;

    const closeChickenBatch = async () => {
        try {
            await endChickenBatch(chickenBatchId);
            const chickenCoopId = sessionStorage.getItem('chickenCoopId');
            queryClient.invalidateQueries({ queryKey: ['chickenBatches', chickenCoopId] });
            toast.success('Kết thúc lứa nuôi thành công');
        } catch (error) {
            toast.error('Kết thúc lứa nuôi thất bại');
        }
    };

    const handleDelete = async () => {
        await deleteChickenBatch(chickenBatchId).then(() => {
            toast.success('Xóa lứa nuôi thành công');
            const chickenCoopId = sessionStorage.getItem('chickenCoopId');
            queryClient.invalidateQueries({ queryKey: ['chickenBatches', chickenCoopId] });
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
                    <DropdownMenuItem
                        onClick={() =>
                            router.push(
                                `${config.routes.chickenBatch}/${row.getValue('chickenBatchId')}`,
                            )
                        }
                    >
                        Xem chi tiết
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
                        Cập nhật
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={closeChickenBatch}
                        disabled={
                            (row.original as ChickenBatch).status === ChickenBatchStatus.COMPLETED
                        }
                    >
                        Kết thúc lứa nuôi <StopCircle size={16} className="ml-auto" />
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-red-600">
                        Xóa <Trash size={16} className="ml-auto" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Update Dialog */}
            <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật lứa nuôi</DialogTitle>
                        <DialogDescription>Hãy nhập các thông tin dưới đây.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[600px]">
                        <ChickenBatchForm
                            closeDialog={() => setOpenUpdate(false)}
                            defaultValues={row.original as ChickenBatch}
                            chickenCoopName={sessionStorage.getItem('chickenCoopName') || ''}
                        />
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa lứa nuôi này?
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
