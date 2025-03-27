'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CoopEquipmentSchema, type CoopEquipment } from '@/utils/schemas/coop-equipment.schema';
import dayjs from 'dayjs';
import { createCoopEquipment, updateCoopEquipment } from '@/services/coop-equipment.service';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CoopEquipmentFormProps {
    defaultValues?: Partial<CoopEquipment>;
    closeDialog: () => void;
}

export default function CoopEquipmentForm({ defaultValues, closeDialog }: CoopEquipmentFormProps) {
    // Initialize form
    const form = useForm<CoopEquipment>({
        resolver: zodResolver(CoopEquipmentSchema),
        defaultValues: {
            coopEquipmentId: '',
            chickenCoopId: '',
            equipmentId: '',
            quantity: 1,
            assignedDate: new Date().toISOString(),
            lastMaintenanceDate: null,
            nextMaintenanceDate: null,
            maintenanceInterval: 1,
            status: '',
            note: '',
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateCoopEquipment : createCoopEquipment,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['coopEquipments'] });
            toast.success(
                defaultValues
                    ? 'Cập nhật thiết bị chuồng thành công'
                    : 'Tạo thiết bị chuồng thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    async function onSubmit(values: CoopEquipment) {
        mutation.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Chicken Coop ID */}
                    <FormField
                        control={form.control}
                        name="chickenCoopId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Chuồng gà</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập ID chuồng gà" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Equipment ID */}
                    <FormField
                        control={form.control}
                        name="equipmentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Thiết bị</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập ID thiết bị" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Quantity */}
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số lượng</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Nhập số lượng" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Assigned Date */}
                    <FormField
                        control={form.control}
                        name="assignedDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày lắp đặt</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn('w-full pl-3 text-left font-normal')}
                                            >
                                                {dayjs(field.value).format('DD/MM/YYYY')}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent align="start">
                                        <Calendar
                                            mode="single"
                                            selected={
                                                field.value ? new Date(field.value) : new Date()
                                            }
                                            onSelect={(date) => field.onChange(date?.toISOString())}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Last Maintenance Date */}
                    <FormField
                        control={form.control}
                        name="lastMaintenanceDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày bảo trì cuối</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn('w-full pl-3 text-left font-normal')}
                                            >
                                                {field.value
                                                    ? dayjs(field.value).format('DD/MM/YYYY')
                                                    : 'Chọn ngày'}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent align="start">
                                        <Calendar
                                            mode="single"
                                            selected={
                                                field.value ? new Date(field.value) : undefined
                                            }
                                            onSelect={(date) => field.onChange(date?.toISOString())}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Next Maintenance Date */}
                    <FormField
                        control={form.control}
                        name="nextMaintenanceDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày bảo trì tiếp theo</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn('w-full pl-3 text-left font-normal')}
                                            >
                                                {field.value
                                                    ? dayjs(field.value).format('DD/MM/YYYY')
                                                    : 'Chọn ngày'}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent align="start">
                                        <Calendar
                                            mode="single"
                                            selected={
                                                field.value ? new Date(field.value) : undefined
                                            }
                                            onSelect={(date) => field.onChange(date?.toISOString())}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Maintenance Interval */}
                    <FormField
                        control={form.control}
                        name="maintenanceInterval"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Khoảng thời gian bảo trì (ngày)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Nhập khoảng thời gian bảo trì"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Status */}
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trạng thái</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập trạng thái" {...field} />
                                </FormControl>
                                <FormMessage />
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
                                    <Input type="text" placeholder="Nhập ghi chú" {...field} />
                                </FormControl>
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
