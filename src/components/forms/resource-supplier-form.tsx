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
import {
    CreateResourceSupplierSchema,
    ResourceSupplierSchema,
    type ResourceSupplier,
} from '@/utils/schemas/resource-supplier.schema';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addResourceSupplier, updateResourceSupplier } from '@/services/supplier.service';
import { getWarestockResourceByFarm } from '@/services/warehouse.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useParams } from 'next/navigation';

interface ResourceSupplierFormProps {
    defaultValues?: Partial<ResourceSupplier>;
    closeDialog: () => void;
}

export default function ResourceSupplierForm({
    defaultValues,
    closeDialog,
}: ResourceSupplierFormProps) {
    // Get supplierId from URL params
    const { supplierId }: { supplierId: string } = useParams();

    // Initialize form
    const form = useForm<ResourceSupplier>({
        resolver: zodResolver(
            defaultValues ? CreateResourceSupplierSchema : ResourceSupplierSchema,
        ),
        defaultValues: {
            resourceSupplierId: '',
            resourceId: '',
            supplierId,
            price: 0,
            description: '',
            ...defaultValues,
        },
    });

    // Get resources
    const { data: resources } = useQuery({
        queryKey: ['resources'],
        queryFn: () => getWarestockResourceByFarm('all'),
        enabled: !!defaultValues?.resourceId,
    });
    const resourceOptions = resources?.map((resource) => ({
        value:
            resource.equipmentId ||
            resource.medicineId ||
            resource.foodId ||
            resource.harvestProductId ||
            resource.chickenId,
        label:
            resource.equipmentName ||
            resource.medicineName ||
            resource.foodName ||
            resource.harvestProductName ||
            resource.chickenName,
    }));

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateResourceSupplier : addResourceSupplier,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['resourceSuppliers'] });
            toast.success(
                defaultValues
                    ? 'Cập nhật nhà cung cấp tài nguyên thành công'
                    : 'Tạo nhà cung cấp tài nguyên thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    async function onSubmit(values: ResourceSupplier) {
        mutation.mutate(values);
    }

    // Form error handler
    const onError = (error: any) => {
        console.error(error);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Vật phẩm */}
                    <FormField
                        control={form.control}
                        name="resourceId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Vật phẩm</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-9 mt-1">
                                            <SelectValue placeholder="Chọn vật phẩm" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {resourceOptions?.map((res) => (
                                            <SelectItem key={res.value} value={res.value}>
                                                {res.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ID nhà cung cấp */}
                    {/* <FormField
                        control={form.control}
                        name="supplierId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID nhà cung cấp</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập ID nhà cung cấp"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Giá */}
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Giá</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Nhập giá"
                                        min={0}
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
                                    <Input
                                        type="text"
                                        placeholder="Nhập mô tả (tuỳ chọn)"
                                        {...field}
                                    />
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
