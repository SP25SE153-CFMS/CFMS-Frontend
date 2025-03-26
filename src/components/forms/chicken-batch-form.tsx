'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChickenBatch, CreateChickenBatchSchema } from '@/utils/schemas/chicken-batch.schema';
import { createChickenBatch, updateChickenBatch } from '@/services/chicken-batch.service';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { mapEnumToValues } from '@/utils/functions/enum.function';
import { ChickenBatchStatus, chickenBatchStatusVariant } from '@/utils/enum/status.enum';
import AutoForm from '../ui/auto-form';

interface ChickenBatchFormProps {
    defaultValues?: Partial<ChickenBatch>;
    closeDialog: () => void;
    chickenCoopName: string;
}

export default function ChickenBatchForm({
    defaultValues,
    closeDialog,
    chickenCoopName,
}: ChickenBatchFormProps) {
    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateChickenBatch : createChickenBatch,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['chickenBatches'] });
            toast.success(
                defaultValues ? 'Cập nhật lứa nuôi thành công' : 'Tạo lứa nuôi thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Đã xảy ra lỗi');
        },
    });

    // Form submit handler
    async function onSubmit(values: any) {
        mutation.mutate(values);
    }

    return (
        <AutoForm
            formSchema={CreateChickenBatchSchema}
            values={defaultValues}
            onSubmit={onSubmit}
            fieldConfig={{
                chickenBatchName: { label: '!!! Tên lứa nuôi' },
                note: { fieldType: 'textarea' },
                status: {
                    fieldType: ({ field }) => (
                        <FormItem>
                            <FormLabel>Trạng thái</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mapEnumToValues(ChickenBatchStatus).map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {chickenBatchStatusVariant[status]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    ),
                },
                chickenCoopId: {
                    fieldType: () => (
                        <FormItem>
                            <FormLabel>Chuồng nuôi</FormLabel>
                            <FormControl>
                                <Input value={chickenCoopName} disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    ),
                },
            }}
        >
            <Button type="submit" className="mx-auto w-60 relative left-1/2 -translate-x-1/2">
                Gửi
            </Button>
        </AutoForm>
    );
}
