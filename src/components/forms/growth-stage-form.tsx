'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    CreateGrowthStageSchema,
    GrowthStageSchema,
    type GrowthStage,
} from '@/utils/schemas/growth-stage.schema';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGrowthStage, updateGrowthStage } from '@/services/growth-stage.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getSubCategoryByCategoryType } from '@/utils/functions/category.function';
import { CategoryType } from '@/utils/enum/category.enum';
import { Textarea } from '../ui/textarea';
import { Loader2 } from 'lucide-react';

interface GrowthStageFormProps {
    defaultValues?: Partial<GrowthStage>;
    closeDialog: () => void;
}

export default function GrowthStageForm({ defaultValues, closeDialog }: GrowthStageFormProps) {
    // Initialize form
    const form = useForm<GrowthStage>({
        resolver: zodResolver(defaultValues ? GrowthStageSchema : CreateGrowthStageSchema),
        defaultValues: {
            growthStageId: '',
            stageCode: '',
            stageName: '',
            chickenType: '',
            minAgeWeek: 0,
            maxAgeWeek: 0,
            description: '',
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateGrowthStage : createGrowthStage,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['growthStages'] });
            toast.success(
                defaultValues
                    ? 'Cập nhật giai đoạn tăng trưởng thành công'
                    : 'Tạo giai đoạn tăng trưởng thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    async function onSubmit(values: GrowthStage) {
        const newValues = { ...values, id: values.growthStageId };
        mutation.mutate(newValues);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Stage Code */}
                    {/* <FormField
                        control={form.control}
                        name="stageCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã giai đoạn</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập mã giai đoạn"
                                        disabled={defaultValues !== undefined}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Stage Name */}
                    <FormField
                        control={form.control}
                        name="stageName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên giai đoạn</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập tên giai đoạn"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Chicken Type */}
                    <FormField
                        control={form.control}
                        name="chickenType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại gà</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getSubCategoryByCategoryType(CategoryType.CHICKEN).map(
                                                (status) => (
                                                    <SelectItem
                                                        key={status.subCategoryId}
                                                        value={status.subCategoryId}
                                                    >
                                                        {status.subCategoryName}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Min Age Week */}
                    <FormField
                        control={form.control}
                        name="minAgeWeek"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tuổi bắt đầu (tuần)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="Nhập tuổi bắt đầu (tuần)"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Max Age Week */}
                    <FormField
                        control={form.control}
                        name="maxAgeWeek"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tuổi kết thúc (tuần)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="Nhập tuổi kết thúc (tuần)"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Nhập mô tả" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" className="mx-auto mt-6 w-60" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Gửi
                </Button>
            </form>
        </Form>
    );
}
