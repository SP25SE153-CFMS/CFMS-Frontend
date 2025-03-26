'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateNutritionPlanSchema, NutritionPlan } from '@/utils/schemas/nutrition-plan.schema';
import { createNutritionPlan, updateNutritionPlan } from '@/services/nutrition-plan.service';
import { Textarea } from '../ui/textarea';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Label } from '../ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CreateNutritionPlanDetail } from '@/utils/schemas/nutrition-plan-detail.schema';
import { SelectNative } from '../ui/select-native';
import { getUnits } from '@/services/category.service';
import { getFoods } from '@/services/food.service';
import { useDialogStore } from '@/store/use-dialog-store';

interface NutritionPlanFormProps {
    defaultValues?: Partial<NutritionPlan>;
}

export default function NutritionPlanForm({ defaultValues }: NutritionPlanFormProps) {
    // Initialize form
    const form = useForm<NutritionPlan>({
        resolver: zodResolver(CreateNutritionPlanSchema),
        defaultValues: {
            name: '',
            description: '',
            target: '',
            ...defaultValues,
        },
    });

    const { data: units } = useQuery({
        queryKey: ['units'],
        queryFn: () => getUnits(),
    });

    const { data: foods } = useQuery({
        queryKey: ['foods'],
        queryFn: () => getFoods(),
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateNutritionPlan : createNutritionPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nutritionPlans'] });
            toast.success(
                defaultValues
                    ? 'Cập nhật chế độ dinh dưỡng thành công'
                    : 'Tạo chế độ dinh dưỡng thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    async function onSubmit(values: NutritionPlan) {
        const newValues = {
            ...values,
            nutritionPlanDetails,
        };
        mutation.mutate(newValues);
    }

    // Form error handler
    const onError = (error: any) => {
        console.error(error);
    };

    const [nutritionPlanDetails, setNutriPlanDetails] = useState<CreateNutritionPlanDetail[]>([
        { foodId: foods?.[0].foodId ?? '', foodWeight: 0, unitId: units?.[0].subCategoryId ?? '' },
    ]);

    const addNutriPlanDetail = () => {
        setNutriPlanDetails([...nutritionPlanDetails, { foodId: '', foodWeight: 0, unitId: '' }]);
    };

    const removeNutriPlanDetail = (index: number) => {
        const newNutriPlanDetails = nutritionPlanDetails.filter((_, i) => i !== index);
        setNutriPlanDetails(newNutriPlanDetails);
    };

    const updateNutriPlanDetail = <K extends keyof CreateNutritionPlanDetail>(
        index: number,
        field: K,
        value: CreateNutritionPlanDetail[K],
    ) => {
        const newNutriPlanDetails = [...nutritionPlanDetails];
        newNutriPlanDetails[index][field] = value;
        setNutriPlanDetails(newNutriPlanDetails);
    };

    const { open, onOpenChange } = useDialogStore();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {defaultValues ? (
                    <span>Cập nhật</span>
                ) : (
                    <Button className="space-x-1">Tạo mới</Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {defaultValues ? 'Cập nhật' : 'Tạo mới'} chế độ dinh dưỡng
                    </DialogTitle>
                    <DialogDescription>Hãy nhập các thông tin dưới đây.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[600px]">
                    <Form {...form}>
                        <form
                            id="nutrition-plan-form"
                            onSubmit={form.handleSubmit(onSubmit, onError)}
                            className="grid grid-cols-1 gap-4 px-1"
                        >
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Tên kế hoạch</Label>
                                        <Input
                                            id="name"
                                            placeholder="Nhập tên kế hoạch"
                                            required
                                            {...form.register('name')}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="target">Mục tiêu</Label>
                                        <Input
                                            id="target"
                                            placeholder="Nhập mục tiêu"
                                            required
                                            {...form.register('target')}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Danh sách thức ăn
                                    </h3>
                                    {nutritionPlanDetails.map((item, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md mb-4"
                                        >
                                            <div className="space-y-2">
                                                <Label htmlFor={`foodId-${index}`}>Sản phẩm</Label>
                                                <Select
                                                    onValueChange={(value) =>
                                                        updateNutriPlanDetail(
                                                            index,
                                                            'foodId',
                                                            value,
                                                        )
                                                    }
                                                    required
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn sản phẩm" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {foods?.map((food) => (
                                                            <SelectItem
                                                                key={food.foodId}
                                                                value={food.foodId}
                                                            >
                                                                {food.foodName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="*:not-first:mt-2">
                                                    <Label>Khối lượng</Label>
                                                    <div className="flex rounded-md shadow-xs mt-2">
                                                        <Input
                                                            className="-me-px rounded-e-none shadow-none focus-visible:z-10"
                                                            placeholder="1"
                                                            type="number"
                                                            min={0}
                                                            onChange={(e) =>
                                                                updateNutriPlanDetail(
                                                                    index,
                                                                    'foodWeight',
                                                                    Number(e.target.value),
                                                                )
                                                            }
                                                        />
                                                        <SelectNative
                                                            className="text-muted-foreground hover:text-foreground w-fit rounded-s-none shadow-none bg-gray-50"
                                                            onChange={(e) =>
                                                                updateNutriPlanDetail(
                                                                    index,
                                                                    'unitId',
                                                                    e.target.value,
                                                                )
                                                            }
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                                selected
                                                                hidden
                                                            >
                                                                -
                                                            </option>
                                                            {units?.map((unit) => (
                                                                <option
                                                                    key={unit.subCategoryId}
                                                                    value={unit.subCategoryId}
                                                                >
                                                                    {unit.subCategoryName}
                                                                </option>
                                                            ))}
                                                        </SelectNative>
                                                    </div>
                                                </div>
                                            </div>

                                            {index > 0 && (
                                                <div className="md:col-span-2 flex justify-end">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeNutriPlanDetail(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Xóa thức ăn
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addNutriPlanDetail}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Thêm thức ăn
                                    </Button>
                                </div>

                                <div className="mt-6 space-y-2">
                                    <Label htmlFor="description">Ghi chú</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Nhập ghi chú (nếu có)"
                                        {...form.register('description')}
                                    />
                                </div>
                            </div>
                        </form>
                    </Form>
                </ScrollArea>
                <DialogFooter>
                    <Button type="submit" form="nutrition-plan-form" disabled={mutation.isPending}>
                        {defaultValues ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
