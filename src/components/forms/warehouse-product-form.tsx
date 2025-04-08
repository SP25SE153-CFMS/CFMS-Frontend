'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { CreateFood, CreateFoodSchema, Food, FoodSchema } from '@/utils/schemas/food.schema';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Warehouse } from '@/utils/schemas/warehouse.schema';
import { getWareById } from '@/services/warehouse.service';
import { SubCategory } from '@/utils/schemas/sub-category.schema';
import { getSubPackage, getSubUnit } from '@/services/category.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { createFood, updateFood } from '@/services/food.service';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import toast from 'react-hot-toast';

type MutationFnType = typeof createFood | typeof updateFood;
interface FoodProps {
    defaultValues?: Partial<Food>;
    closeModal: () => void;
    wId: string;
}
export default function FoodsForm({ defaultValues, closeModal, wId }: FoodProps) {
    const form = useForm<CreateFood>({
        resolver: zodResolver(defaultValues ? FoodSchema : CreateFoodSchema),
        defaultValues: {
            foodCode: '',
            foodName: '',
            note: '',
            expiryDate: defaultValues?.expiryDate || dayjs().format('YYYY-MM-DD'),
            productionDate: defaultValues?.productionDate || dayjs().format('YYYY-MM-DD'),
            wareId: wId,
            packageId: '',
            unitId: '',
            packageSize: 0,
            ...defaultValues,
        },
        mode: 'onChange',
    });

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
        queryFn: () => getSubUnit(),
    });

    // Submit
    // const onSubmit = async (values: Food) => {
    //     try {
    //         const dataToSubmit = {
    //             ...values,
    //         };
    //         if (defaultValues) {
    //             await updateProduct(dataToSubmit);
    //             toast.success("Cập nhật sản phẩm thành công")
    //         } else {
    //             await createProduct(dataToSubmit);
    //             toast.success('Tạo sản phẩm thành công');
    //         }
    //         closeModal();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data: CreateFood) => {
            if (defaultValues?.foodId) {
                return updateFood({
                    ...data,
                    foodId: defaultValues.foodId,
                });
            }
            return createFood(data);
        },
        onSuccess: () => {
            closeModal();
            queryClient.invalidateQueries({ queryKey: ['foods'] });
            toast.success(
                defaultValues ? 'Cập nhật thực phẩm thành công' : 'Tạo thực phẩm thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
        },
    });

    // Hàm submit có thể xử lý cả hai trường hợp
    const onSubmit = async (values: CreateFood) => {
        console.log('Values từ form:', values);
        try {
            const formattedData = {
                ...values,
                packageSize: 0,
            };

            console.log('Data sau khi format:', formattedData);

            await mutation.mutateAsync(formattedData);
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Food name */}
                    <FormField
                        control={form.control}
                        name="foodName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên thực phẩm</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input placeholder="Nhập tên thực phẩm..." {...field} />
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
                                        <Input placeholder="Nhập mã thực phẩm..." {...field} />
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
                                    <Input type="date" {...field} />
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
                                    <Input type="date" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Kho */}
                    {!defaultValues && (
                        <FormField
                            control={form.control}
                            name="wareId"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Kho</FormLabel>
                                        <FormControl>
                                            <div>
                                                {/* Hidden input để lưu wareId */}
                                                <input type="hidden" {...field} value={wId} />
                                                {/* Input hiển thị để show warehouseName */}
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
                    )}

                    {/* Cách đóng gói */}
                    {!defaultValues && (
                        <FormField
                            control={form.control}
                            name="packageId"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Đóng gói</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn cách đóng gói" />
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
                                );
                            }}
                        />
                    )}

                    {/* Đơn vị */}
                    {!defaultValues && (
                        <FormField
                            control={form.control}
                            name="unitId"
                            render={({ field }) => {
                                return (
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
                                );
                            }}
                        />
                    )}

                    {/* Số lượng */}
                    {!defaultValues && (
                        <FormField
                            control={form.control}
                            name="packageSize"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Số lượng</FormLabel>
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
                    )}
                </div>

                <Button type="submit" className="ml-auto mt-6 w-40 flex">
                    Tạo
                </Button>
            </form>
        </Form>
    );
}
