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
import { Category, CategorySchema, CreateCategorySchema } from '@/utils/schemas/category.schema';
import { createCategory, updateCategory } from '@/services/category.service';
import { Textarea } from '../ui/textarea';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CategoryStatus, categoryStatusLabels } from '@/utils/enum/status.enum';
import { mapEnumToValues } from '@/utils/functions/enum.function';

interface CategoryFormProps {
    defaultValues?: Partial<Category>;
    closeDialog: () => void;
}

export default function CategoryForm({ defaultValues, closeDialog }: CategoryFormProps) {
    // if (defaultValues && defaultValues.status) {
    //     defaultValues.status = defaultValues.status;
    // } else
    if (defaultValues) {
        defaultValues.status = 1;
    }

    // Initialize form
    const form = useForm<Category>({
        resolver: zodResolver(defaultValues ? CategorySchema : CreateCategorySchema),
        defaultValues: {
            categoryName: '',
            categoryType: '',
            description: '',
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateCategory : createCategory,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success(
                defaultValues ? 'Cập nhật danh mục thành công' : 'Tạo danh mục thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    async function onSubmit(values: Category) {
        mutation.mutate(values);
    }

    // Form error handler
    const onError = (error: any) => {
        console.error(error);
    };

    console.log(mapEnumToValues(CategoryStatus));

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="grid grid-cols-1 gap-4 px-1"
            >
                {/* Mã danh mục */}
                <FormField
                    control={form.control}
                    name="categoryName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên danh mục</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Nhập tên danh mục" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Loại danh mục */}
                <FormField
                    control={form.control}
                    name="categoryType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Loại danh mục</FormLabel>
                            <FormControl>
                                <Input
                                    disabled
                                    type="text"
                                    placeholder="Nhập loại danh mục"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Mô tả */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Nhập mô tả" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Trạng thái */}
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Trạng thái</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mapEnumToValues(CategoryStatus).map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {categoryStatusLabels[status]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Gửi</Button>
            </form>
        </Form>
    );
}
