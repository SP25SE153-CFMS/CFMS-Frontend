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
import { useParams } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import CoopEquipmentForm from '@/components/forms/coop-equipment-form';
import { CoopEquipment } from '@/utils/schemas/coop-equipment.schema';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { deleteCoopEquipment } from '@/services/chicken-coop.service';

interface Props<T> {
    row: Row<T>;
}

export function DataTableRowActions<T>({ row }: Props<T>) {
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const queryClient = useQueryClient();
    const { chickenCoopId }: { chickenCoopId: string } = useParams();

    const handleDelete = async () => {
        const coopEquipmentId = (row.original as CoopEquipment).coopEquipmentId;
        await deleteCoopEquipment(chickenCoopId, coopEquipmentId).then(() => {
            toast.success('Đã xóa thiết bị chuồng nuôi');
            queryClient.invalidateQueries({ queryKey: ['chickenCoop', chickenCoopId] });
            setOpenDelete(false);
        });
    };

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-6 w-6 p-0">
                        <DotsHorizontalIcon className="h-2 w-2" />
                        <span className="sr-only">Mở menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    {/* <DropdownMenuItem
                        onClick={() => {
                            router.push(
                                `${config.routes.chickenCoop}?coopEquipmentId=${row.getValue('coopEquipmentId')}`,
                            );
                            sessionStorage.setItem(
                                'coopEquipmentId',
                                row.getValue('coopEquipmentId'),
                            );
                        }}
                    >
                        Xem chi tiết
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
                        Cập nhật
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-red-600">
                        Xóa <Trash size={16} className="ml-auto" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Update Dialog */}
            <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật thiết bị chuồng nuôi</DialogTitle>
                        <DialogDescription>Hãy nhập các thông tin dưới đây.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[600px]">
                        <CoopEquipmentForm
                            closeDialog={() => setOpenUpdate(false)}
                            defaultValues={row.original as CoopEquipment}
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
                            Bạn có chắc chắn muốn xóa thiết bị chuồng nuôi này?
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
