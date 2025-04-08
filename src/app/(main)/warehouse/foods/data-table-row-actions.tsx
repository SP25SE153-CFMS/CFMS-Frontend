'use client';
import UpdateFoodForm from '@/components/forms/food-update-form';
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
import { deleteResource } from '@/services/resource.service';
import { deleteProduct } from '@/services/warehouse-product.service';
import type { Food } from '@/utils/schemas/food.schema';
import type { WareStockResponse } from '@/utils/types/custom.type';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import type { Row } from '@tanstack/react-table';
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

    // Lấy dữ liệu từ row
    const rowData = row.original as WareStockResponse;

    // Xác định dữ liệu food từ rowData
    // Nếu rowData.foods tồn tại, sử dụng nó, nếu không thử sử dụng rowData trực tiếp
    const foodData = rowData.foods || (rowData as unknown as Food);

    // Lấy foodId từ nguồn phù hợp
    const foodId = foodData.foodId || (rowData as any).foodId;

    
    const resourceId = rowData.resourceId;

    const handleDelete = async () => {
        await deleteResource(resourceId).then(() => {
            toast.success('Xóa thức ăn thành công');
            queryClient.invalidateQueries({queryKey: ['foods']});
            setOpenDelete(false)
        })
    };

    // Kiểm tra xem có đủ dữ liệu để cập nhật không
    const canUpdate = !!foodId;

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <DotsHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setOpenUpdate(true)} disabled={!canUpdate}>
                        Cập nhật
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setOpenDelete(true)}
                        className="text-red-600"
                        disabled={!foodId}
                    >
                        Xóa <Trash size={16} />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Update */}
            {canUpdate && (
                <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Cập nhật sản phẩm</DialogTitle>
                            <DialogDescription>Nhập thông tin cập nhật</DialogDescription>
                        </DialogHeader>
                        <ScrollArea>
                            <UpdateFoodForm
                                food={{
                                    foodId: foodId,
                                    foodCode: foodData.foodCode || '',
                                    foodName: foodData.foodName || '',
                                    note: foodData.note || '',
                                    productionDate: foodData.productionDate || '',
                                    expiryDate: foodData.expiryDate || '',
                                }}
                                closeModal={() => setOpenUpdate(false)}
                            />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            )}

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
