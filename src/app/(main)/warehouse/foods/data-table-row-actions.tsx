import WarehouseProductForm from '@/components/forms/warehouse-product-form';
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
import { deleteProduct } from '@/services/warehouse-product.service';
import { WarehouseProduct } from '@/utils/schemas/warehouse-product.schema';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props<T> {
    row: Row<T>;
}
export function DataTableRowActions<T>({ row }: Props<T>) {
    const [openDelete, setOpenDelete] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);

    const queryClient = useQueryClient();

    const handleDelete = async () => {
        const id = (row.original as WarehouseProduct).productId;
        await deleteProduct(id);
        toast.success('Xóa sản phẩm thành công!');
        // TODO: Update query key
        queryClient.invalidateQueries({ queryKey: ['foods'] });
        setOpenDelete(false);
    };

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <DotsHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
                        Cập nhật
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-red-600">
                        Xóa <Trash size={16} />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Update */}
            <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật sản phẩm</DialogTitle>
                        <DialogDescription>Nhập</DialogDescription>
                    </DialogHeader>
                    <ScrollArea>
                        <WarehouseProductForm
                            closeModal={() => setOpenUpdate(false)}
                            defaultValues={row.original as WarehouseProduct}
                        />
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Delete */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>Bạn muốn xóa sản phẩm này?</AlertDialogDescription>
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
