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
import { deleteNutritionPlan } from '@/services/nutrition-plan.service';
import { NutritionPlan } from '@/utils/schemas/nutrition-plan.schema';
import { useQueryClient } from '@tanstack/react-query';

interface Props<T> {
    row: Row<T>;
}

export function DataTableRowActions<T>({ row }: Props<T>) {
    const router = useRouter();
    const [openDelete, setOpenDelete] = useState(false);

    const queryClient = useQueryClient();

    const handleDelete = async () => {
        const nutritionPlanId = (row.original as NutritionPlan).nutritionPlanId;
        await deleteNutritionPlan(nutritionPlanId).then(() => {
            toast.success('Đã xóa chế độ dinh dưỡng');
            queryClient.invalidateQueries({ queryKey: ['nutritionPlans'] });
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
                    <DropdownMenuItem
                        onClick={() => {
                            router.push(
                                `${config.routes.nutritionPlan}/${row.getValue('nutritionPlanId')}`,
                            );
                        }}
                    >
                        Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() =>
                            router.push(
                                `${config.routes.updateNutritionPlan}/${row.getValue('nutritionPlanId')}`,
                            )
                        }
                    >
                        Cập nhật
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-red-600">
                        Xóa <Trash size={16} className="ml-auto" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Update Dialog */}
            {/* <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
                <DialogContent className="max-w-5xl">
                    <DialogHeader>
                        <DialogTitle>Cập nhật chế độ dinh dưỡng</DialogTitle>
                        <DialogDescription>Hãy nhập các thông tin dưới đây.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[600px]">
                        <NutritionPlanForm
                            defaultValues={row.original as NutritionPlan}
                            closeDialog={() => setOpenUpdate(false)}
                        />
                    </ScrollArea>
                </DialogContent>
            </Dialog> */}

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
