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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getResources } from '@/services/resource.service';
import { useParams } from 'next/navigation';
import { addResourceSupplier, updateResourceSupplier } from '@/services/supplier.service';
import {
    AddResourceSupplier,
    AddResourceSupplierSchema,
    ResourceSupplierSchema,
} from '@/utils/schemas/resource-supplier.schema';
import toast from 'react-hot-toast';

interface AddResourceSupplierFormProps {
    defaultValues?: Partial<AddResourceSupplier>;
    closeDialog: () => void;
}

export default function AddResourceSupplierForm({
    defaultValues,
    closeDialog,
}: AddResourceSupplierFormProps) {
    const { supplierId }: { supplierId: string } = useParams();

    // Initialize form
    const form = useForm<AddResourceSupplier>({
        resolver: zodResolver(defaultValues ? ResourceSupplierSchema : AddResourceSupplierSchema),
        defaultValues: {
            resourceId: '',
            supplierId: supplierId || '',
            description: '',
            price: 0,
            ...defaultValues,
        },
    });

    const { data: resources } = useQuery({
        queryKey: ['resources'],
        queryFn: () => getResources(),
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateResourceSupplier : addResourceSupplier,
        onSuccess: (response) => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['resources', supplierId] });
            toast.success(response.message);
        },
        onError: (error: any) => {
            console.error(error);
            toast(error?.response?.data?.message || 'Có lỗi xảy ra', { icon: '⚠️' });
        },
    });

    // Form submit handler
    async function onSubmit(values: AddResourceSupplier) {
        mutation.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="grid grid-cols-1 gap-6 px-1">
                    {/* Resource */}
                    <FormField
                        control={form.control}
                        name="resourceId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tài nguyên</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn tài nguyên" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {resources?.map((resource) => (
                                                <SelectItem
                                                    key={resource.resourceId}
                                                    value={resource.resourceId}
                                                >
                                                    {resource.equipment?.equipmentName ||
                                                        resource.medicine?.medicineName ||
                                                        resource.food?.foodName ||
                                                        resource.harvestProduct
                                                            ?.harvestProductName ||
                                                        resource.chicken?.chickenName ||
                                                        resource.breeding?.chickenName ||
                                                        'Không xác định'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập mô tả" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Price */}
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Giá</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Nhập giá" {...field} />
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
