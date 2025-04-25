'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Warehouse } from '@/utils/schemas/warehouse.schema';
import { getWareById } from '@/services/warehouse.service';
import type { SubCategory } from '@/utils/schemas/sub-category.schema';
import { getSubFoodUnit, getSubPackage } from '@/services/category.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { generateCode } from '@/utils/functions/generate-code.function';
import { onError } from '@/utils/functions/form.function';
import { Loader2 } from 'lucide-react';
import { createHarvestProduct } from '@/services/harvest-product.service';
import {
    CreateHarvestProduct,
    CreateHarvestProductSchema,
    HarvestProduct,
} from '@/utils/schemas/harvest-product.schema';

interface CreateHarvestProductProps {
    closeDialog: () => void;
}

export default function CreateHarvestProductForm({ closeDialog }: CreateHarvestProductProps) {
    const [wId, setWId] = useState('');

    const form = useForm<CreateHarvestProduct>({
        resolver: zodResolver(CreateHarvestProductSchema),
        defaultValues: {
            harvestProductCode: '',
            harvestProductName: '',
            harvestProductTypeId: '',
            unitId: '',
            packageId: '',
            packageSize: 0,
            wareId: '',
        },
    });

    useEffect(() => {
        const storedWId = sessionStorage.getItem('wareId') ?? '';
        setWId(storedWId);
        form.setValue('wareId', storedWId);
    }, [form]);

    // Fetch warehouse data
    const { data: ware } = useQuery<Warehouse>({
        queryKey: ['ware', wId],
        queryFn: () => getWareById(wId),
        enabled: !!wId,
    });

    // Fetch subcategories for package and unit
    const { data: subPack = [] } = useQuery<SubCategory[]>({
        queryKey: ['subPack'],
        queryFn: () => getSubPackage(),
    });

    const { data: subUnit = [] } = useQuery<SubCategory[]>({
        queryKey: ['subUnit'],
        queryFn: () => getSubFoodUnit(),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createHarvestProduct,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['harvestProducts'] });
            toast.success('Tạo sản phẩm thu hoạch thành công');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
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
                                            {subPack.map((type) => (
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
                                    />
                                </FormControl>
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
                                            {subUnit.map((unit) => (
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
                                            {subPack.map((pack) => (
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
                                        value={ware?.warehouseName || ''}
                                        className="bg-background"
                                        disabled
                                    />
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
                    Tạo
                </Button>
            </form>
        </Form>
    );
}
