'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import toast from 'react-hot-toast';
import { generateCode } from '@/utils/functions/generate-code.function';
import { onError } from '@/utils/functions/form.function';
import { Loader2 } from 'lucide-react';
import { createHarvestProduct, updateHarvestProduct } from '@/services/harvest-product.service';
import {
    CreateHarvestProductSchema,
    HarvestProduct,
    HarvestProductSchema,
    CreateHarvestProduct,
} from '@/utils/schemas/harvest-product.schema';
import { getSubCategoryByCategoryType } from '@/utils/functions/category.function';
import { CategoryType } from '@/utils/enum/category.enum';

interface HarvestProductProps {
    closeDialog: () => void;
    defaultValues?: Partial<HarvestProduct>;
}

export default function HarvestProductForm({ closeDialog, defaultValues }: HarvestProductProps) {
    const form = useForm<CreateHarvestProduct>({
        resolver: zodResolver(defaultValues ? HarvestProductSchema : CreateHarvestProductSchema),
        defaultValues: {
            harvestProductCode: '',
            harvestProductName: '',
            harvestProductTypeId: '',
            wareId: sessionStorage.getItem('wareId') || '',
            packageId: '',
            unitId: '',
            packageSize: 0,
            ...defaultValues,
        },
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: defaultValues ? updateHarvestProduct : createHarvestProduct,
        onSuccess: (res) => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['harvests'] });
            toast.success(res.message);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra', { icon: '⚠️' });
        },
    });

    const onSubmit = async (values: any) => {
        await mutation.mutateAsync(values);
    };

    const handleGenerateCode = (e: React.FocusEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const existingCodes = new Set(
            JSON.parse(sessionStorage.getItem('harvestProducts') || '[]').map(
                (product: HarvestProduct) => product.harvestProductCode,
            ),
        );

        let code;
        let index = 1;
        do {
            code = generateCode(input, index);
            index++;
        } while (existingCodes.has(code));

        form.setValue('harvestProductCode', code);
        form.setValue('harvestProductName', input);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Harvest Product Name */}
                    <FormField
                        control={form.control}
                        name="harvestProductName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên sản phẩm thu hoạch</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nhập tên sản phẩm thu hoạch..."
                                        {...field}
                                        onBlur={handleGenerateCode}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Harvest Product Code */}
                    <FormField
                        control={form.control}
                        name="harvestProductCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã sản phẩm thu hoạch</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nhập mã sản phẩm thu hoạch..."
                                        {...field}
                                        readOnly
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Harvest Product Type */}
                    <FormField
                        control={form.control}
                        name="harvestProductTypeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại sản phẩm</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn loại sản phẩm" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getSubCategoryByCategoryType(
                                                CategoryType.HARVEST_TYPE,
                                            )?.map((type) => (
                                                <SelectItem
                                                    key={type.subCategoryId}
                                                    value={type.subCategoryId}
                                                >
                                                    {type.subCategoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Package Size */}
                    <FormField
                        control={form.control}
                        name="packageSize"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quy cách đóng gói</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="Nhập quy cách đóng gói..."
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Unit Select */}
                    <FormField
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
                                                CategoryType.H_QUANTITY_UNIT,
                                            )?.map((unit) => (
                                                <SelectItem
                                                    key={unit.subCategoryId}
                                                    value={unit.subCategoryId}
                                                >
                                                    {unit.subCategoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Package Select */}
                    <FormField
                        control={form.control}
                        name="packageId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Đơn vị đóng gói</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn đơn vị đóng gói" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getSubCategoryByCategoryType(
                                                CategoryType.H_PACKAGE_UNIT,
                                            )?.map((pack) => (
                                                <SelectItem
                                                    key={pack.subCategoryId}
                                                    value={pack.subCategoryId}
                                                >
                                                    {pack.subCategoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Warehouse */}
                    <FormField
                        control={form.control}
                        name="wareId"
                        render={() => (
                            <FormItem>
                                <FormLabel>Kho</FormLabel>
                                <FormControl>
                                    <Input
                                        value={sessionStorage.getItem('warehouseName') || ''}
                                        className="bg-background"
                                        disabled
                                    />
                                </FormControl>
                                <FormMessage />
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
                    {defaultValues ? 'Cập nhật' : 'Tạo'}
                </Button>
            </form>
        </Form>
    );
}
