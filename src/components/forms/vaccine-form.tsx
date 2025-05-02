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
import { Textarea } from '@/components/ui/textarea';
import { Vaccine, VaccineSchema } from '@/utils/schemas/vaccine.schema';
import { createVaccine, updateVaccine } from '@/services/vaccine.service';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { onError } from '@/utils/functions/form.function';

interface VaccineFormProps {
    defaultValues?: Partial<Vaccine>;
    closeDialog: () => void;
}

export default function VaccineForm({ defaultValues, closeDialog }: VaccineFormProps) {
    // Initialize form
    const form = useForm<Vaccine>({
        resolver: zodResolver(VaccineSchema),
        defaultValues: {
            vaccineId: '',
            name: '',
            notes: '',
            productionDate: new Date(),
            expiryDate: new Date(),
            dosage: '',
            instructions: '',
            batchNumber: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            supplierId: '',
            diseaseId: 1,
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateVaccine : createVaccine,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['vaccines'] });
            toast.success(defaultValues ? 'Cập nhật vắc-xin thành công' : 'Tạo vắc-xin thành công');
        },
        onError: (error: any) => {
            console.error(error);
            toast(error?.response?.data?.message, { icon: '⚠️' });
        },
    });

    // Form submit handler
    async function onSubmit(values: Vaccine) {
        mutation.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
                    {/* Tên vắc-xin */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên vắc-xin</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập tên vắc-xin" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Ghi chú */}
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ghi chú</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Nhập ghi chú" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Ngày sản xuất */}
                    <FormField
                        control={form.control}
                        name="productionDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày sản xuất</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        value={new Date(field.value).toISOString().slice(0, 16)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Ngày hết hạn */}
                    <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày hết hạn</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        value={new Date(field.value).toISOString().slice(0, 16)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Liều lượng */}
                    <FormField
                        control={form.control}
                        name="dosage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Liều lượng</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập liều lượng" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Hướng dẫn sử dụng */}
                    <FormField
                        control={form.control}
                        name="instructions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hướng dẫn sử dụng</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Nhập hướng dẫn sử dụng" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Số lô */}
                    <FormField
                        control={form.control}
                        name="batchNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số lô</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập số lô" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ID nhà cung cấp */}
                    <FormField
                        control={form.control}
                        name="supplierId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Nhà cung cấp</FormLabel>
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
                    />

                    {/* ID bệnh */}
                    <FormField
                        control={form.control}
                        name="diseaseId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Bệnh</FormLabel>
                                <FormControl>
                                    <Input type="number" min={0} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="mx-auto w-60" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Gửi
                </Button>
            </form>
        </Form>
    );
}
