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
} from '@/utils/schemas/sub-category.schema';
import { Textarea } from '../ui/textarea';
import { useParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { addSubCategory, updateSubCategory } from '@/services/category.service';
import { DataType, dataTypeLabels } from '@/utils/enum';
import { Loader2 } from 'lucide-react';
import { onError } from '@/utils/functions/form.function';

interface SubCategoryFormProps {
    defaultValues?: Partial<SubCategory>;
    closeDialog: () => void;
    categoryName: string;
}

export default function SubCategoryForm({
    defaultValues,
    closeDialog,
    categoryName = '',
}: SubCategoryFormProps) {
    const { categoryId } = useParams();

    // Initialize form
    const form = useForm<SubCategory>({
        resolver: zodResolver(defaultValues ? SubCategorySchema : CreateSubCategorySchema),
        defaultValues: {
            subCategoryId: '',
            subCategoryName: '',
            description: '',
            status: 0,
            dataType: DataType.STRING,
            categoryId: categoryId as string,
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutation for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateSubCategory : addSubCategory,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success(
                defaultValues ? 'Cập nhật danh mục con thành công' : 'Thêm danh mục con thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    function onSubmit(values: SubCategory) {
        mutation.mutate(values);
    }

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
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn kiểu dữ liệu" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(DataType).map((datatype) => (
                                                <SelectItem key={datatype} value={datatype}>
                                                    {dataTypeLabels[datatype]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Chọn danh mục cha */}
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={() => (
                            <FormItem>
                                <FormLabel>Danh mục cha</FormLabel>
                                <FormControl>
                                    <Input disabled value={categoryName} />
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
                    /> */}
                </div>

                <Button type="submit" className="mx-auto w-60" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Gửi
                </Button>
            </form>
        </Form>
    );
}
