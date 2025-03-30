import SupplierForm from '@/components/forms/supplier-form';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { deleteSupplier } from '@/services/supplier.service';
import { Supplier } from '@/utils/schemas/supplier.schema';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props<T> {
    row: Row<T>;
}

export function DataTableRowActions<T>({ row }: Props<T>) {
    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleDelete = async () => {
        const id = (row.original as Supplier).supplierId;
        await deleteSupplier(id);
        toast.success('Xóa nhà cung cấp thành công!');
        setOpenDelete(false);
    };
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <DotsHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    {/* Chi tiết */}
                    <DropdownMenuItem onClick={() => setOpen(true)}>Chi tiết</DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {/* Cập nhật */}
                    <DropdownMenuItem onClick={() => setUpdate(true)}>Cập nhật</DropdownMenuItem>

                    {/* Xóa */}
                    <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-red-600">
                        Xóa <Trash size={16} />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Cập nhật */}
            <Dialog open={update} onOpenChange={setUpdate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật sản phẩm</DialogTitle>
                        <DialogDescription>Nhập</DialogDescription>
                    </DialogHeader>
                    <ScrollArea>
                        <SupplierForm
                            closeDialog={() => setUpdate(false)}
                            defaultValues={row.original as Supplier}
                        />
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Xóa */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn muốn xóa nhà cung cấp này?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-3">
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
