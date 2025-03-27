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
import { useRouter } from 'next/navigation';
import config from '@/configs';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';
import NutritionPlanForm from '@/components/forms/nutrition-plan-form';
import { useDialogStore } from '@/store/use-dialog-store';
import { deleteNutritionPlan } from '@/services/nutrition-plan.service';
import { NutritionPlan } from '@/utils/schemas/nutrition-plan.schema';

interface Props<T> {
    row: Row<T>;
}

export function DataTableRowActions<T>({ row }: Props<T>) {
    const router = useRouter();
    const [openDelete, setOpenDelete] = useState(false);

    const handleDelete = async () => {
        const nutritionId = (row.original as NutritionPlan).nutritionPlanId;
        await deleteNutritionPlan(nutritionId).then(() => {
            toast.success('Đã xóa chế độ dinh dưỡng');
            setOpenDelete(false);
        });
    };

    const { openDialog } = useDialogStore();

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
                    <DropdownMenuItem
                        onClick={() => {
                            router.push(
                                `${config.routes.chickenCoop}?breedingAreaId=${row.getValue('breedingAreaId')}`,
                            );
                            sessionStorage.setItem(
                                'breedingAreaId',
                                row.getValue('breedingAreaId'),
                            );
                        }}
                    >
                        Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={openDialog}>
                        <NutritionPlanForm defaultValues={{}} />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-red-600">
                        Xóa <Trash size={16} className="ml-auto" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa chế độ dinh dưỡng này?
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
