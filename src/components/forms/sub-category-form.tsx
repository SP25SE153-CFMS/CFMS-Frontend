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
import { SubCategory, SubCategorySchema } from '@/utils/schemas/category.schema';
import { categories } from '@/utils/data/table.data';
import { Category } from '@/utils/schemas/category.schema';
import dayjs from 'dayjs';

export default function SubCategoryForm() {
    const form = useForm<SubCategory>({
        resolver: zodResolver(SubCategorySchema),
        defaultValues: {
            subCategoryId: '',
            subCategoryName: '',
            description: '',
            status: 'ACTIVE',
            dataType: '',
            createdDate: new Date(),
            categoryId: '',
        },
    });

    function onSubmit(values: SubCategory) {
        console.log('SubCategory data:', values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
                {/* ID danh mục con */}
                {/* <FormField
                    control={form.control}
                    name="subCategoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>ID danh mục con</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Nhập ID danh mục con" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}

                {/* Tên danh mục con */}
                <FormField
                    control={form.control}
                    name="subCategoryName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên danh mục con</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Nhập tên danh mục con" {...field} />
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                <Input type="text" placeholder="Nhập mô tả" {...field} />
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
                                        {['ACTIVE', 'INACTIVE'].map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
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
