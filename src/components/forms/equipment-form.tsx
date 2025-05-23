'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarIcon, Loader2 } from 'lucide-react';
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
import {
    CreateEquipmentSchema,
    type Equipment,
    EquipmentSchema,
} from '@/utils/schemas/equipment.schema';
import { createEquipment, updateEquipment } from '@/services/equipment.service';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate } from '@/utils/functions';
import { vi } from 'date-fns/locale';
import { generateCode } from '@/utils/functions/generate-code.function';
import { onError } from '@/utils/functions/form.function';

interface EquipmentFormProps {
    defaultValues?: Partial<Equipment>;
    closeDialog: () => void;
}

export default function EquipmentForm({ defaultValues, closeDialog }: EquipmentFormProps) {
    // Initialize form
    const form = useForm<Equipment>({
        resolver: zodResolver(defaultValues ? EquipmentSchema : CreateEquipmentSchema),
        defaultValues: {
            equipmentId: '',
            equipmentCode: '',
            equipmentName: '',
            purchaseDate: new Date().toISOString(),
            warranty: 12,
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
            toast(error?.response?.data?.message, { icon: '⚠️' });
        },
    });

    // Form submit handler
    async function onSubmit(values: Equipment) {
        mutation.mutate(values);
    }

    const handleGenerateCode = (e: React.FocusEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const existingCodes = new Set(
            JSON.parse(sessionStorage.getItem('equipments') || '[]').map(
                (equipment: Equipment) => equipment.equipmentCode,
            ),
        );

        let code;
        let index = 1;
        do {
            code = generateCode(input, index);
            index++;
        } while (existingCodes.has(code));

        form.setValue('equipmentCode', code);
        form.setValue('equipmentName', input);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Tên thiết bị */}
                    <FormField
                        control={form.control}
                        name="equipmentName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên thiết bị</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập tên thiết bị"
                                        {...field}
                                        onBlur={handleGenerateCode}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Mã thiết bị */}
                    <FormField
                        control={form.control}
                        name="equipmentCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã thiết bị</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập mã thiết bị"
                                        {...field}
                                        readOnly
                                    />
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
                                                {formatDate(field.value)}
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
                                            locale={vi}
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
                        name="warranty"
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
                </div>

                <Button type="submit" className="mx-auto mt-6 w-60" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Gửi
                </Button>
            </form>
        </Form>
    );
}
