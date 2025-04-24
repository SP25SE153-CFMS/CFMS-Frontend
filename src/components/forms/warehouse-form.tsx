'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
    CreateWarehouseSchema,
    WarehouseSchema,
    type Warehouse,
} from '@/utils/schemas/warehouse.schema';
import { createWarehouse, updateWarehouse } from '@/services/warehouse.service';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CategoryType } from '@/utils/enum/category.enum';
import { getSubCategoryByCategoryType } from '@/utils/functions/category.function';
import { getCookie } from 'cookies-next';
import config from '@/configs';
import { onError } from '@/utils/functions/form.function';

interface WarehouseFormProps {
    defaultValues?: Partial<Warehouse>;
    closeDialog: () => void;
}

export default function WarehouseForm({ defaultValues, closeDialog }: WarehouseFormProps) {
    // Get farmId from cookies
    const farmId = getCookie(config.cookies.farmId);

    // Initialize form
    const form = useForm<Warehouse>({
        resolver: zodResolver(defaultValues ? WarehouseSchema : CreateWarehouseSchema),
        defaultValues: {
            wareId: '',
            farmId,
            resourceTypeId: '',
            warehouseName: '',
            maxQuantity: 0,
            maxWeight: 0,
            currentQuantity: 0,
            currentWeight: 0,
            description: '',
            status: 1,
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateWarehouse : createWarehouse,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['wares', farmId] });
            toast.success(defaultValues ? 'Cập nhật kho thành công' : 'Tạo kho thành công');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    async function onSubmit(values: Warehouse) {
        mutation.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Tên kho */}
                    <FormField
                        control={form.control}
                        name="warehouseName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên kho</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập tên kho" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Loại kho */}
                    <FormField
                        control={form.control}
                        name="resourceTypeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại kho</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn loại kho" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getSubCategoryByCategoryType(
                                                CategoryType.RESOURCE,
                                            ).map((item) => (
                                                <SelectItem
                                                    key={item.subCategoryId}
                                                    value={item.subCategoryId}
                                                >
                                                    {item.description}
                                                </SelectItem>
                                            ))}
                                            {/* <SelectItem value="other">Khác</SelectItem> */}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Số lượng tối đa */}
                    <FormField
                        control={form.control}
                        name="maxQuantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số lượng tối đa</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="Nhập số lượng tối đa"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Khối lượng tối đa */}
                    <FormField
                        control={form.control}
                        name="maxWeight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Khối lượng tối đa</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="Nhập khối lượng tối đa"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Số lượng hiện tại */}
                    {/* <FormField
                        control={form.control}
                        name="currentQuantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số lượng hiện tại</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="Nhập số lượng hiện tại"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Khối lượng hiện tại */}
                    {/* <FormField
                        control={form.control}
                        name="currentWeight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Khối lượng hiện tại</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="Nhập khối lượng hiện tại"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Trạng thái */}
                    {/* <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trạng thái</FormLabel>
                                <FormControl>
                                    <Input type="number"
                                    min={0} placeholder="Nhập trạng thái" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Mô tả */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Nhập mô tả" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="mx-auto mt-6 w-60" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Gửi
                </Button>
            </form>
        </Form>
    );
}
