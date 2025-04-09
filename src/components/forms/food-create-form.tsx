'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { CreateFood, CreateFoodSchema } from '@/utils/schemas/food.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Warehouse } from '@/utils/schemas/warehouse.schema';
import { getWareById } from '@/services/warehouse.service';
import type { SubCategory } from '@/utils/schemas/sub-category.schema';
import { getSubFoodUnit, getSubPackage } from '@/services/category.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { createFood } from '@/services/food.service';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

interface CreateFoodProps {
    closeModal: () => void;
}

export default function CreateFoodForm({ closeModal }: CreateFoodProps) {
    const [wId, setWId] = useState('');

    const form = useForm<CreateFood>({
        resolver: zodResolver(CreateFoodSchema),
        defaultValues: {
            foodCode: '',
            foodName: '',
            note: '',
            wareId: '',
            packageId: '',
            unitId: '',
            packageSize: 0,
            productionDate: dayjs().format('YYYY-MM-DD'),
            expiryDate: dayjs().format('YYYY-MM-DD'),
        },
        mode: 'onChange',
    });

    useEffect(() => {
        const storedWId = sessionStorage.getItem('wareId') ?? '';
        setWId(storedWId);
        form.setValue('wareId', storedWId);
    }, [form]);

    // Gọi data ware để lấy id và tên kho
    const { data: ware } = useQuery<Warehouse>({
        queryKey: ['ware', wId],
        queryFn: () => getWareById(wId),
        enabled: !!wId,
    });

    // Gọi sub package
    const { data: subPack = [] } = useQuery<SubCategory[]>({
        queryKey: ['subPack'],
        queryFn: () => getSubPackage(),
    });

    // Gọi sub unit
    const { data: subUnit = [] } = useQuery<SubCategory[]>({
        queryKey: ['subUnit'],
        queryFn: () => getSubFoodUnit(),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createFood,
        onSuccess: () => {
            closeModal();
            queryClient.invalidateQueries({ queryKey: ['foods'] });
            toast.success('Tạo thức ăn thành công');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
        },
    });

    const onSubmit = async (values: CreateFood) => {
        const formattedData = {
            ...values,
            expiryDate: dayjs(values.expiryDate).format('YYYY-MM-DD'),
            productionDate: dayjs(values.productionDate).format('YYYY-MM-DD'),
        };

        await mutation.mutateAsync(formattedData);
    };

    const onError = (error: any) => {
        console.error(error);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Food name */}
                    <FormField
                        control={form.control}
                        name="foodName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên thức ăn</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input placeholder="Nhập tên thức ăn..." {...field} />
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
                                <FormLabel>Mã thức ăn</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input placeholder="Nhập mã thức ăn..." {...field} />
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
                                    <Input placeholder="DD-MM-YYYY" {...field} />
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
                                    <Input placeholder="DD-MM-YYYY" {...field} />
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

                    {/* Ware */}
                    <FormField
                        control={form.control}
                        name="wareId"
                        render={({ field }) => {
                            useEffect(() => {
                                field.onChange(wId);
                            }, [wId, field]);
                            return (
                                <FormItem>
                                    <FormLabel>Kho</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input
                                                value={ware?.warehouseName || ''}
                                                disabled
                                                className="bg-background"
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            );
                        }}
                    />

                    {/* Quy cách tính */}
                    <FormField
                        control={form.control}
                        name="packageSize"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Quy cách tính</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input
                                                {...field}
                                                value="0"
                                                disabled
                                                className="bg-background"
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            );
                        }}
                    />

                    <div className="flex space-x-8">
                        {/* Unit Select */}
                        <FormField
                            control={form.control}
                            name="unitId"
                            render={({ field }) => (
                                <FormItem className="mt-8">
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn đơn vị" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subUnit.map((u) => (
                                                    <SelectItem
                                                        key={u.subCategoryId}
                                                        value={u.subCategoryId}
                                                    >
                                                        {u.subCategoryName}
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
                                <FormItem className="mt-8">
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn đơn vị đóng gói" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subPack.map((p) => (
                                                    <SelectItem
                                                        key={p.subCategoryId}
                                                        value={p.subCategoryId}
                                                    >
                                                        {p.subCategoryName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" className="ml-auto mt-6 w-40 flex">
                    Tạo
                </Button>
            </form>
        </Form>
    );
}
