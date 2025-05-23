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
import { Plus, Trash, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';
import {
    addNutritionPlanToGrowthStage,
    deleteGrowthStage,
    deleteNutritionPlanFromGrowthStage,
    updateNutritionPlanToGrowthStage,
} from '@/services/growth-stage.service';
import { GrowthStage } from '@/utils/schemas/growth-stage.schema';
import GrowthStageForm from '@/components/forms/growth-stage-form';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getNutritionPlans } from '@/services/nutrition-plan.service';
import { GrowthStageResponse } from '@/utils/types/custom.type';
import Link from 'next/link';
import config from '@/configs';

interface Props<T> {
    row: Row<T>;
}

export function DataTableRowActions<T>({ row }: Props<T>) {
    const [openNutriPlanForm, setOpenNutriPlanForm] = useState(false);
    const [openDeleteNutritionPlan, setOpenDeleteNutritionPlan] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const { data: nutritionPlans } = useQuery({
        queryKey: ['nutritionPlans'],
        queryFn: () => getNutritionPlans(),
    });

    const [nutritionPlanId, setNutritionPlanId] = useState<string>('');

    const growthStageId = (row.original as GrowthStage).growthStageId;
    const currentNutritionPlanOfGrowthStage = (row.original as GrowthStageResponse).nutritionPlanId;

    const queryClient = useQueryClient();

    const handleDeleteGrowthStage = async () => {
        await deleteGrowthStage(growthStageId).then(() => {
            toast.success('Đã xóa giai đoạn phát triển');
            queryClient.invalidateQueries({ queryKey: ['growthStages'] });
            setOpenDelete(false);
        });
    };

    const handleDeleteNutritionPlan = async () => {
        if (!currentNutritionPlanOfGrowthStage) {
            toast('Không tìm thấy chế độ dinh dưỡng', { icon: '⚠️' });
            return;
        }
        await deleteNutritionPlanFromGrowthStage(
            growthStageId,
            currentNutritionPlanOfGrowthStage,
        ).then(() => {
            toast.success('Đã xóa chế độ dinh dưỡng');
            queryClient.invalidateQueries({ queryKey: ['growthStages'] });
            setOpenDeleteNutritionPlan(false);
        });
    };

    const upsertNutritionPlan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check if nutritionPlanId is valid
        if (!nutritionPlanId) {
            toast('Không tìm thấy chế độ dinh dưỡng', { icon: '⚠️' });
            return;
        }

        // Update nutrition plan
        if (currentNutritionPlanOfGrowthStage) {
            await updateNutritionPlanToGrowthStage(growthStageId, nutritionPlanId).then(() => {
                toast.success('Đã cập nhật chế độ dinh dưỡng');
                queryClient.invalidateQueries({ queryKey: ['growthStages'] });
                setOpenNutriPlanForm(false);
            });
            return;
        }

        // Add nutrition plan
        await addNutritionPlanToGrowthStage(growthStageId, nutritionPlanId).then(() => {
            toast.success('Đã thêm chế độ dinh dưỡng');
            queryClient.invalidateQueries({ queryKey: ['growthStages'] });
            setOpenNutriPlanForm(false);
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
                <DropdownMenuContent align="end" className="w-full">
                    {/* <DropdownMenuItem
                        onClick={() => {
                            router.push(
                                `${config.routes.growthStage}/${row.getValue('growthStageId')}`,
                            );
                        }}
                    >
                        Xem chi tiết
                    </DropdownMenuItem> */}
                    {!currentNutritionPlanOfGrowthStage && (
                        <DropdownMenuItem onClick={() => setOpenNutriPlanForm(true)}>
                            Thêm chế độ dinh dưỡng
                        </DropdownMenuItem>
                    )}
                    {!!currentNutritionPlanOfGrowthStage && (
                        <DropdownMenuItem onClick={() => setOpenNutriPlanForm(true)}>
                            Cập nhật chế độ dinh dưỡng
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
                        Cập nhật
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {!!currentNutritionPlanOfGrowthStage && (
                        <DropdownMenuItem onClick={() => setOpenDeleteNutritionPlan(true)}>
                            Loại bỏ chế độ dinh dưỡng <Trash size={16} className="ml-auto" />
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-red-600">
                        Xóa giai đoạn phát triển
                        <Trash2 size={16} className="ml-auto" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Add/Update Nutrition Plan Dialog */}
            <Dialog open={openNutriPlanForm} onOpenChange={(val) => setOpenNutriPlanForm(val)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {currentNutritionPlanOfGrowthStage ? 'Cập nhật' : 'Thêm'} chế độ dinh
                            dưỡng
                        </DialogTitle>
                        <DialogDescription>Hãy nhập các thông tin dưới đây.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={upsertNutritionPlan} className="flex flex-col">
                        <div className="grid grid-cols-1 gap-6 px-1 w-full">
                            <Select
                                onValueChange={(value) => setNutritionPlanId(value)}
                                defaultValue={currentNutritionPlanOfGrowthStage}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn chế độ dinh dưỡng" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    {nutritionPlans?.map((nutritionPlan) => (
                                        <SelectItem
                                            key={nutritionPlan.nutritionPlanId}
                                            value={nutritionPlan.nutritionPlanId}
                                        >
                                            {nutritionPlan.name}
                                        </SelectItem>
                                    ))}
                                    {nutritionPlans?.length === 0 && (
                                        <Link
                                            href={config.routes.nutritionPlan}
                                            className="text-sm font-medium flex items-center p-2"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Nhấn vào đây để tạo chế độ dinh dưỡng
                                        </Link>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" className="mx-auto mt-6 w-60">
                            Gửi
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Nutrition Plan Dialog */}
            <Dialog
                open={openDeleteNutritionPlan}
                onOpenChange={(val) => setOpenDeleteNutritionPlan(val)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xóa chế độ dinh dưỡng</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa chế độ dinh dưỡng này?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpenDeleteNutritionPlan(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteNutritionPlan}>
                            Xóa
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Update Dialog */}
            <Dialog open={openUpdate} onOpenChange={(val) => setOpenUpdate(val)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật giai đoạn phát triển</DialogTitle>
                        <DialogDescription>Hãy nhập các thông tin dưới đây.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[600px]">
                        <GrowthStageForm
                            defaultValues={row.original as GrowthStage}
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
                            Bạn có chắc chắn muốn xóa giai đoạn phát triển này?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpenDelete(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteGrowthStage}>
                            Xóa
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
