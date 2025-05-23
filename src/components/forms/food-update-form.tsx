'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Food, FoodSchema } from '@/utils/schemas/food.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFood } from '@/services/food.service';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { generateCode } from '@/utils/functions/generate-code.function';
import { Loader2, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { formatDate } from '@/utils/functions';
import { Calendar } from '../ui/calendar';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { onError } from '@/utils/functions/form.function';

interface UpdateFoodProps {
    food: Food;
    closeModal: () => void;
}

export default function UpdateFoodForm({ food, closeModal }: UpdateFoodProps) {
    const formattedDefaults = {
        ...food,
        expiryDate: food.expiryDate
            ? dayjs(food.expiryDate).format('YYYY-MM-DD')
            : dayjs().format('YYYY-MM-DD'),
        productionDate: food.productionDate
            ? dayjs(food.productionDate).format('YYYY-MM-DD')
            : dayjs().format('YYYY-MM-DD'),
    };

    const form = useForm<Food>({
        resolver: zodResolver(FoodSchema),
        defaultValues: formattedDefaults,
        mode: 'onChange',
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updateFood,
        onSuccess: () => {
            closeModal();
            queryClient.invalidateQueries({ queryKey: ['foods'] });
            toast.success('Cập nhật thực phẩm thành công');
        },
        onError: (error: any) => {
            console.error(error);
            toast(error?.response?.data?.message || 'Có lỗi xảy ra', { icon: '⚠️' });
        },
    });

    const onSubmit = async (values: Food) => {
        const formattedData = {
            ...values,
            expiryDate: dayjs(values.expiryDate).format('YYYY-MM-DD'),
            productionDate: dayjs(values.productionDate).format('YYYY-MM-DD'),
        };

        await mutation.mutateAsync(formattedData);
    };

    const handleGenerateCode = (e: React.FocusEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const existingCodes = new Set(
            JSON.parse(sessionStorage.getItem('foods') || '[]').map((food: Food) => food.foodCode),
        );

        let code;
        let index = 1;
        do {
            code = generateCode(input, index);
            index++;
        } while (existingCodes.has(code));

        form.setValue('foodCode', code);
        form.setValue('foodName', input);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Hidden foodId field */}
                    <input type="hidden" {...form.register('foodId')} />

                    {/* Food name */}
                    <FormField
                        control={form.control}
                        name="foodName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên thực phẩm</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input
                                            placeholder="Nhập tên thực phẩm..."
                                            {...field}
                                            onBlur={handleGenerateCode}
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Food code */}
                    <FormField
                        control={form.control}
                        name="foodCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã thực phẩm</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input
                                            placeholder="Nhập mã thực phẩm..."
                                            readOnly
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Note */}
                    <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ghi chú</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input placeholder="Ghi chú..." {...field} />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Production date */}
                    <FormField
                        control={form.control}
                        name="productionDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày sản xuất</FormLabel>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                        !field.value && 'text-muted-foreground',
                                                    )}
                                                >
                                                    {formatDate(field.value)}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    field.value ? new Date(field.value) : undefined
                                                }
                                                onSelect={(date) => {
                                                    field.onChange(date ? date.toISOString() : '');
                                                }}
                                                initialFocus
                                                locale={vi}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Expiry date */}
                    <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hạn sử dụng</FormLabel>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                        !field.value && 'text-muted-foreground',
                                                    )}
                                                >
                                                    {formatDate(field.value)}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    field.value ? new Date(field.value) : undefined
                                                }
                                                onSelect={(date) => {
                                                    field.onChange(date ? date.toISOString() : '');
                                                }}
                                                initialFocus
                                                disabled={(date) => date < new Date()}
                                                locale={vi}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    className="ml-auto mt-6 w-40 flex"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Cập nhật
                </Button>
            </form>
        </Form>
    );
}
