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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { Scroll, Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ResourceSuppliers from './resource-supplier';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getFarms } from '@/services/farm.service';

interface Props<T> {
    row: Row<T>;
}

export function DataTableRowActions<T>({ row }: Props<T>) {
    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectFarmId, setSelectFarmId] = useState('');

    const supplierId = (row.original as Supplier).supplierId;
    console.log("Id nhà cung cấp được chọn: ", supplierId)

    const queryClient = useQueryClient();

    const handleDelete = async () => {
        const id = (row.original as Supplier).supplierId;
        // console.log('ID: ', id);
        await deleteSupplier(id);
        toast.success('Đã xóa');

        queryClient.invalidateQueries({ queryKey: ['suppliers'] });

        setOpenDelete(false);
    };

    // Lấy dữ liệu từ Farm
    const { data: farms, isLoading } = useQuery({
        queryKey: ['farms'],
        queryFn: () => getFarms(),
    });

    const handleFarmChange = (farmId: string) => {
        setSelectFarmId(farmId);
        console.log('Choose: ', farmId);
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

            {/* Chi tiết */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>Tài nguyên của nhà cung cấp</DialogHeader>
                    <p>Chọn trang trại</p>
                    <Select onValueChange={handleFarmChange} value={selectFarmId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Trang trại" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Chọn trang trại</SelectLabel>
                                {isLoading ? (
                                    <SelectItem value="loading">Đang tải trang trại....</SelectItem>
                                ) : farms && farms.length > 0 ? (
                                    farms.map((farm) => (
                                        <SelectItem key={farm.farmId} value={farm.farmId}>
                                            {farm.farmName}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="empty">Không có trang trại nào</SelectItem>
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <ScrollArea>
                        {selectFarmId ? (
                            <ResourceSuppliers
                                supplierId={supplierId}
                                farmId={selectFarmId}
                            />
                        ) : (
                            <span className="p-4 text-center text-gray-500">
                                Vui lòng chọn trang trại để xem tài nguyên
                            </span>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>

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
