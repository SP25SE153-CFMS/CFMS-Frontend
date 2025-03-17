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
import {
    CreateSubCategorySchema,
    SubCategory,
    SubCategorySchema,
} from '@/utils/schemas/category.schema';
import { categories } from '@/utils/data/table.data';
import { Category } from '@/utils/schemas/category.schema';
import dayjs from 'dayjs';
import { Textarea } from '../ui/textarea';
import { useParams } from 'next/navigation';
import { mapEnumToValues } from '@/utils/functions/enum.function';
import { CategoryStatus, categoryStatusLabels } from '@/utils/enum/status.enum';

interface SubCategoryFormProps {
    defaultValues?: Partial<SubCategory>;
    closeDialog: () => void;
}

export default function SubCategoryForm({ defaultValues, closeDialog }: SubCategoryFormProps) {
    const { categoryId } = useParams();

    // Initialize form
    const form = useForm<SubCategory>({
        resolver: zodResolver(defaultValues ? SubCategorySchema : CreateSubCategorySchema),
        defaultValues: {
            subCategoryId: '',
            subCategoryName: '',
            description: '',
            status: '0',
            dataType: '',
            createdDate: new Date(),
            categoryId: categoryId as string,
            ...defaultValues,
        },
    });

    // Form submit handler
    function onSubmit(values: SubCategory) {
        console.log('SubCategory data:', values);
        closeDialog();
    }

    // Form error handler
    const onError = (error: any) => {
        console.error(error);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-6 px-1">
                    {/* Tên danh mục con */}
                    <FormField
                        control={form.control}
                        name="subCategoryName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên danh mục con</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập tên danh mục con"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Kiểu dữ liệu */}
                    <FormField
                        control={form.control}
                        name="dataType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kiểu dữ liệu</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập kiểu dữ liệu" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Ngày tạo */}
                    <FormField
                        control={form.control}
                        name="createdDate"
                        render={() => (
                            <FormItem>
                                <FormLabel>Ngày tạo</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        value={dayjs(new Date()).format('YYYY-MM-DD')}
                                        disabled
                                        className="bg-gray-200"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Chọn danh mục cha */}
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Danh mục cha</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn danh mục cha" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category: Category) => (
                                                <SelectItem
                                                    key={category.categoryId}
                                                    value={category.categoryId}
                                                >
                                                    {category.categoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                        defaultValue={field.value}
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
                </div>

                <Button type="submit" className="mx-auto w-60">
                    Gửi
                </Button>
            </form>
        </Form>
    );
}
