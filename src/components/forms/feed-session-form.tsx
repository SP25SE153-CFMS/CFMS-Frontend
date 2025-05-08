'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
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
    CreateFeedSessionSchema,
    FeedSession,
    FeedSessionSchema,
} from '@/utils/schemas/feed-session.schema';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';
import { useParams } from 'next/navigation';
import { getSubCategoryByCategoryType } from '@/utils/functions/category.function';
import { CategoryType } from '@/utils/enum/category.enum';
import { SelectNative } from '../ui/select-native';
import { addFeedSession, updateFeedSession } from '@/services/nutrition-plan.service';
import { onError } from '@/utils/functions/form.function';
import { TimePicker } from '../ui/time-picker';
interface FeedSessionFormProps {
    defaultValues?: Partial<FeedSession>;
    closeDialog: () => void;
}

export default function FeedSessionForm({ defaultValues, closeDialog }: FeedSessionFormProps) {
    const { nutritionPlanId } = useParams();

    // Initialize form
    const form = useForm<FeedSession>({
        resolver: zodResolver(defaultValues ? FeedSessionSchema : CreateFeedSessionSchema),
        defaultValues: {
            feedSessionId: '',
            nutritionPlanId: nutritionPlanId as string,
            startTime: '',
            endTime: '',
            feedAmount: 0,
            unitId: getSubCategoryByCategoryType(CategoryType.WEIGHT_UNIT)[0]?.subCategoryId || '',
            note: '',
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateFeedSession : addFeedSession,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['nutritionPlan', nutritionPlanId] });
            toast.success(
                defaultValues ? 'Cập nhật lịch cho ăn thành công' : 'Thêm lịch cho ăn thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast(error?.response?.data?.message, { icon: '⚠️' });
        },
    });

    // Form submit handler
    async function onSubmit(values: FeedSession) {
        mutation.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 gap-6 px-1">
                    {/* Thời gian cho ăn */}
                    <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thời gian bắt đầu cho ăn</FormLabel>
                                <FormControl>
                                    <TimePicker
                                        value={field.value}
                                        onChange={(value) => {
                                            if (value) {
                                                field.onChange(value);
                                            }
                                        }}
                                        className="w-full"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Thời gian cho ăn */}
                    <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thời gian kết thúc cho ăn</FormLabel>
                                <FormControl>
                                    <TimePicker
                                        value={field.value}
                                        onChange={(value) => {
                                            if (value) {
                                                field.onChange(value);
                                            }
                                        }}
                                        className="w-full"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Lượng thức ăn */}
                    <FormField
                        control={form.control}
                        name="feedAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lượng thức ăn</FormLabel>
                                <div className="flex rounded-md shadow-sm">
                                    <Input
                                        className="rounded-e-none h-10"
                                        type="number"
                                        placeholder="Nhập lượng thức ăn"
                                        min={0}
                                        step={0.1}
                                        {...field}
                                    />
                                    <SelectNative
                                        className="text-muted-foreground hover:text-foreground w-fit rounded-s-none h-10 bg-muted/50"
                                        onChange={(e) => form.setValue('unitId', e.target.value)}
                                        defaultValue={
                                            form.getValues('unitId') ||
                                            getSubCategoryByCategoryType(
                                                CategoryType.WEIGHT_UNIT,
                                            )[0]?.subCategoryId
                                        }
                                    >
                                        {getSubCategoryByCategoryType(
                                            CategoryType.WEIGHT_UNIT,
                                        )?.map((unit) => (
                                            <option
                                                key={unit.subCategoryId}
                                                value={unit.subCategoryId}
                                            >
                                                {unit.subCategoryName}
                                            </option>
                                        ))}
                                    </SelectNative>
                                </div>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Đơn vị */}
                    {/* <FormField
                        control={form.control}
                        name="unitId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Đơn vị</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn đơn vị" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getSubCategoryByCategoryType(
                                                CategoryType.WEIGHT_UNIT,
                                            )?.map((unit) => (
                                                <option
                                                    key={unit.subCategoryId}
                                                    value={unit.subCategoryId}
                                                >
                                                    {unit.subCategoryName}
                                                </option>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Ghi chú */}
                    <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ghi chú</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Nhập ghi chú (không bắt buộc)"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="mx-auto mt-6 w-60" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {defaultValues ? 'Cập nhật' : 'Thêm'}
                </Button>
            </form>
        </Form>
    );
}
