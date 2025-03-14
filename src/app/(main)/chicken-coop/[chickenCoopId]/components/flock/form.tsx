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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
    CreateEquipmentSchema,
    type Equipment,
    EquipmentSchema,
} from '@/utils/schemas/equipment.schema';
import dayjs from 'dayjs';
import { createEquipment, updateEquipment } from '@/services/equipment.service';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface AddEquipmentFormProps {
    defaultValues?: Partial<Equipment>;
    closeDialog: () => void;
}

export default function AddEquipmentForm({ defaultValues, closeDialog }: AddEquipmentFormProps) {
    // Initialize form
    const form = useForm<Equipment>({
        resolver: zodResolver(defaultValues ? EquipmentSchema : CreateEquipmentSchema),
        defaultValues: {
            equipmentId: '',
            equipmentCode: '',
            equipmentName: '',
            purchaseDate: new Date().toISOString(),
            warrantyPeriod: 12,
            status: 'AVAILABLE',
            cost: 0,
            quantity: 1,
            createdAt: new Date().toISOString(),
            updatedAt: null,
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateEquipment : createEquipment,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['equipments'] });
            toast.success(
                defaultValues ? 'Cập nhật thiết bị thành công' : 'Tạo thiết bị thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    async function onSubmit(values: Equipment) {
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
                    {/* Mã thiết bị */}
                    <FormField
                        control={form.control}
                        name="equipmentCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã thiết bị</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập mã thiết bị" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tên thiết bị */}
                    <FormField
                        control={form.control}
                        name="equipmentName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên thiết bị</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập tên thiết bị" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Ngày mua */}
                    <FormField
                        control={form.control}
                        name="purchaseDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày mua</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value && 'text-muted-foreground',
                                                )}
                                            >
                                                {dayjs(new Date(field.value)).format('DD/MM/YYYY')}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={
                                                field.value ? new Date(field.value) : undefined
                                            }
                                            onSelect={(date) => {
                                                field.onChange(date ? date.toISOString() : '');
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Thời gian bảo hành */}
                    <FormField
                        control={form.control}
                        name="warrantyPeriod"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thời gian bảo hành (tháng)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Nhập số tháng"
                                        min={1}
                                        max={12}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Trạng thái */}
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trạng thái</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="IN_USE">Đang sử dụng</SelectItem>
                                            <SelectItem value="BROKEN">Hỏng</SelectItem>
                                            <SelectItem value="AVAILABLE">Sẵn sàng</SelectItem>
                                            <SelectItem value="UNDER_MAINTENANCE">
                                                Bảo trì
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Chi phí */}
                    <FormField
                        control={form.control}
                        name="cost"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chi phí</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Nhập chi phí"
                                        min={0}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Số lượng */}
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số lượng</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Nhập số lượng"
                                        {...field}
                                        min={0}
                                    />
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
