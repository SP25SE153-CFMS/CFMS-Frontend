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
import { deleteEquipment } from '@/services/equipment.service';
import { Equipment } from '@/utils/schemas/equipment.schema';
import EquipmentForm from '@/components/forms/equipment-form';
import { useQueryClient } from '@tanstack/react-query';
import { WareStockResponse } from '@/utils/types/custom.type';
import { deleteResource } from '@/services/resource.service';
import UpdateEquipmentForm from '@/components/forms/equipment-update-form';

interface Props<T> {
    row: Row<T>;
}

export function DataTableRowActions<T>({ row }: Props<T>) {
    // Lấy dữ liệu từ row
    const rowData = row.original as WareStockResponse;
    const eData = rowData.equipments || (rowData as unknown as Equipment);
    const equipmentId = eData.equipmentId;

    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const queryClient = useQueryClient();

    const resourceId = rowData.resourceId;

    const handleDelete = async () => {
        await deleteResource(resourceId).then(() => {
            toast.success('Xóa thiết bị thành công');
            queryClient.invalidateQueries({ queryKey: ['equipments'] });
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
                <DropdownMenuContent align="end" className="w-[160px]">
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Cập nhật thiết bị</DialogTitle>
                        <DialogDescription>Hãy nhập các thông tin dưới đây.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[600px]">
                        <UpdateEquipmentForm
                            equipment={{
                                equipmentId: equipmentId,
                                equipmentCode: eData.equipmentCode || '',
                                equipmentName: eData.equipmentName || '',
                                usage: eData.usage || '',
                                material: eData.material || '',
                                materialId: eData.materialId || '',
                                purchaseDate: eData.purchaseDate || '',
                                sizeUnitId: eData.sizeUnitId || '',
                                size:
                                    typeof eData.size === 'number'
                                        ? eData.size
                                        : Number(eData.size) || 0,
                                warranty:
                                    typeof eData.warranty === 'number'
                                        ? eData.warranty
                                        : Number(eData.warranty) || 0,
                                weight:
                                    typeof eData.weight === 'number'
                                        ? eData.weight
                                        : Number(eData.weight) || 0,
                                weightUnitId: eData.weightUnitId || '',
                            }}
                            closeDialog={() => setOpenUpdate(false)}
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
                            Bạn có chắc chắn muốn xóa thiết bị này?
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
