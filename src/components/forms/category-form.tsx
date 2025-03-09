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

interface CategoryFormProps {
    defaultValues?: Partial<Category>;
    closeDialog: () => void;
}

export default function CategoryForm({ defaultValues, closeDialog }: CategoryFormProps) {
    // Initialize form
    const form = useForm<Category>({
        resolver: zodResolver(defaultValues ? CategorySchema : CreateCategorySchema),
        defaultValues: {
            categoryCode: '',
            categoryName: '',
            categoryType: '',
            description: '',
            status: 'ACTIVE',
            ...defaultValues,
        },
    });

    // Form submit handler
    async function onSubmit(values: Category) {
        if (defaultValues) {
            await updateCategory(values);
            toast.success('Cập nhật danh mục thành công');
        } else {
            await createCategory(values);
            toast.success('Tạo danh mục thành công');
        }
        closeDialog();
    }

    // Form error handler
    const onError = (error: any) => {
        console.error(error);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="grid grid-cols-1 gap-4 px-1"
            >
                {/* Mã danh mục */}
                <FormField
                    control={form.control}
                    name="categoryCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mã danh mục</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Nhập mã danh mục" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Tên danh mục */}
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
                                <Input type="text" placeholder="Nhập loại danh mục" {...field} />
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
                {/* <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Trạng thái</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                                        <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}

                <Button type="submit">Gửi</Button>
            </form>
        </Form>
    );
}
