import {
    CreateResourceSupplier,
    CreateResourceSupplierSchema,
} from '@/utils/schemas/resource-supplier.schema';
import { CreateSupplierSchema } from '@/utils/schemas/supplier.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getWarestockResourceByFarm } from '@/services/warehouse.service';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { addResourceSupplier } from '@/services/supplier.service';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface CreateResourceProps {
    closeModal: () => void;
    supplierId: string;
}

export default function AddResourceSupplier({ closeModal, supplierId }: CreateResourceProps) {
    // console.log('Supplier ID: ', supplierId);

    const form = useForm<CreateResourceSupplier>({
        resolver: zodResolver(CreateResourceSupplierSchema),
        defaultValues: {
            description: '',
            supplierId: supplierId,
            resourceId: '',
            price: 0,
        },
    });

    // Get resource id
    const { data: resources } = useQuery({
        queryKey: ['resources'],
        queryFn: () => getWarestockResourceByFarm('all'),
    });


    const resourceOptions = resources?.map((resource) => ({
        value: resource.resourceId,
        label:
            resource.equipmentName ||
            resource.medicineName ||
            resource.foodName ||
            resource.chickenName,
    }));

    // Query client
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: addResourceSupplier,
        onSuccess: () => {
            closeModal();
            queryClient.invalidateQueries({ queryKey: ['resources', supplierId] });
            toast.success('Đã thêm sản phẩm vào nhà cung cấp.');
        },
        onError: (error: any) => {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
        },
    });

    const onSubmit = async (values: CreateResourceSupplier) => {
        const formattedData = {
            ...values,
            price: Number(values.price), // Đảm bảo price là number
            supplierId: supplierId, // Đảm bảo có supplierId
        };
        // console.log('Gửi resource: ', formattedData);
        await mutation.mutateAsync(formattedData);
    };

    const onError = (error: any) => {
        console.error(error);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    <FormField
                        control={form.control}
                        name="resourceId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Chọn tài nguyên</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn loại" />
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
                            </FormItem>
                        )}
                    />

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
                                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        'Gửi'
                    )}
                </Button>
            </form>
        </Form>
    );
}
