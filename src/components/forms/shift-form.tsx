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
import { CreateShiftSchema, type Shift, ShiftSchema } from '@/utils/schemas/shift.schema';
import { createShift, updateShift } from '@/services/shift.service';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TimePicker } from '../ui/time-picker';

interface ShiftFormProps {
    defaultValues?: Partial<Shift>;
    closeDialog: () => void;
}

export default function ShiftForm({ defaultValues, closeDialog }: ShiftFormProps) {
    // Initialize form
    const form = useForm<Shift>({
        resolver: zodResolver(defaultValues ? ShiftSchema : CreateShiftSchema),
        defaultValues: {
            shiftId: '',
            shiftName: '',
            startTime: '',
            endTime: '',
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateShift : createShift,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['shifts'] });
            toast.success(
                defaultValues ? 'Cập nhật ca làm việc thành công' : 'Tạo ca làm việc thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    async function onSubmit(values: Shift) {
        mutation.mutate(values);
    }

    // Form error handler
    const onError = (error: any) => {
        console.error(error);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 gap-6 px-1">
                    {/* Tên ca làm việc */}
                    <FormField
                        control={form.control}
                        name="shiftName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên ca làm việc</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập tên ca làm việc"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Thời gian bắt đầu */}
                    <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thời gian bắt đầu</FormLabel>
                                <TimePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="w-full"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Thời gian kết thúc */}
                    <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thời gian kết thúc</FormLabel>
                                <TimePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="w-full"
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="mx-auto mt-6 w-60">
                    Gửi
                </Button>
            </form>
        </Form>
    );
}
