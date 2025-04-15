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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ChickenSchema, CreateChickenSchema, type Chicken } from '@/utils/schemas/chicken.schema';
import { createChicken, updateChicken } from '@/services/chicken.service';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSubCategoryByCategoryType } from '@/utils/functions/category.function';
import { CategoryType } from '@/utils/enum/category.enum';
import { CommonStatus } from '@/utils/enum/status.enum';
import { generateCode } from '@/utils/functions/generate-code.function';
import { Loader2 } from 'lucide-react';
interface ChickenFormProps {
    defaultValues?: Partial<Chicken>;
    closeDialog: () => void;
}

export default function ChickenForm({ defaultValues, closeDialog }: ChickenFormProps) {
    // Initialize form
    const form = useForm<Chicken>({
        resolver: zodResolver(defaultValues ? ChickenSchema : CreateChickenSchema),
        defaultValues: {
            chickenId: '',
            chickenCode: '',
            chickenName: '',
            // totalQuantity: 0,
            description: '',
            status: CommonStatus.ACTIVE,
            chickenTypeId: '',
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateChicken : createChicken,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['chickens'] });
            toast.success(
                defaultValues ? 'Cập nhật giống gà thành công' : 'Tạo giống gà thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    async function onSubmit(values: Chicken) {
        mutation.mutate(values);
    }

    const handleGenerateCode = (e: React.FocusEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const existingCodes = new Set(
            JSON.parse(sessionStorage.getItem('chickens') || '[]').map(
                (chicken: Chicken) => chicken.chickenCode,
            ),
        );

        let code;
        let index = 1;
        do {
            code = generateCode(input, index);
            index++;
        } while (existingCodes.has(code));

        form.setValue('chickenCode', code);
        form.setValue('chickenName', input);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Chicken Name */}
                    <FormField
                        control={form.control}
                        name="chickenName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên giống gà</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập tên giống gà"
                                        {...field}
                                        onBlur={handleGenerateCode}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Chicken Code */}
                    <FormField
                        control={form.control}
                        name="chickenCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã giống gà</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập mã giống gà"
                                        readOnly
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Total Quantity */}
                    {/* <FormField
                        control={form.control}
                        name="totalQuantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tổng số lượng</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="Nhập tổng số lượng"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

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

                    {/* Status */}
                    {/* <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trạng thái</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        defaultValue={field.value.toString()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Hoạt động</SelectItem>
                                            <SelectItem value="0">Ngừng hoạt động</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Chicken Type ID */}
                    <FormField
                        control={form.control}
                        name="chickenTypeId"
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

                    {/* Created Date */}
                    {/* <FormField
                        control={form.control}
                        name="createdDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày tạo</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn('w-full pl-3 text-left font-normal')}
                                            >
                                                {dayjs(field.value).format('DD/MM/YYYY')}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent align="start">
                                        <Calendar
                                            mode="single"
                                            selected={
                                                field.value ? new Date(field.value) : new Date()
                                            }
                                            onSelect={(date) => field.onChange(date?.toISOString())}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}
                </div>
                <Button type="submit" className="mx-auto mt-6 w-60" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Gửi
                </Button>
            </form>
        </Form>
    );
}
