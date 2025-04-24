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
import { Loader2 } from 'lucide-react';
import { generateCode } from '@/utils/functions/generate-code.function';
import { getCookie } from 'cookies-next';
import config from '@/configs';
import { useState } from 'react';
import { onError } from '@/utils/functions/form.function';

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
            farmId: getCookie(config.cookies.farmId) || '',
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
    function onSubmit(values: GrowthStage) {
        const newValues = { ...values, id: values.growthStageId };
        mutation.mutate(newValues);
    }

    // eslint-disable-next-line no-unused-vars
    const handleGenerateCode = (input: string) => {
        const existingCodes = new Set(
            JSON.parse(sessionStorage.getItem('growthStages') || '[]').map(
                (stage: GrowthStage) => stage.stageCode,
            ),
        );

        let code;
        let index = 1;
        do {
            code = generateCode(input, index);
            index++;
        } while (existingCodes.has(code));

        form.setValue('stageCode', code);
        form.setValue('stageName', input);
        setNewStageCode(code);
    };

    const [newStageCode, setNewStageCode] = useState('');

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
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
                                        // onBlur={handleGenerateCode}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Stage Code */}
                    <FormField
                        control={form.control}
                        name="stageCode"
                        render={({ field }) => {
                            const growthStages = JSON.parse(
                                sessionStorage.getItem('growthStages') || '[]',
                            ) as GrowthStage[];
                            const uniqueGrowthStages = Array.from(
                                new Map(
                                    growthStages.map((stage) => [stage.stageCode, stage]),
                                ).values(),
                            );

                            return (
                                <FormItem>
                                    <FormLabel>Mã giai đoạn</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={!!defaultValues}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn mã giai đoạn" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <Input
                                                    defaultValue={newStageCode}
                                                    placeholder="Gõ vào đây để thêm mã giai đoạn mới"
                                                    onClick={() => {
                                                        if (!newStageCode) {
                                                            handleGenerateCode(
                                                                form.getValues('stageName'),
                                                            );
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        setNewStageCode(e.target.value);
                                                    }}
                                                    className="text-sm"
                                                />
                                                {uniqueGrowthStages?.map((stage) => (
                                                    <SelectItem
                                                        key={stage.stageCode}
                                                        value={stage.stageCode}
                                                    >
                                                        {stage.stageCode}
                                                    </SelectItem>
                                                ))}
                                                {newStageCode && (
                                                    <SelectItem value={newStageCode}>
                                                        {newStageCode}
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
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
                                            <SelectValue placeholder="Chọn giống gà" />
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
                                        min={1}
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
                            <FormItem>
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập mô tả" {...field} />
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
