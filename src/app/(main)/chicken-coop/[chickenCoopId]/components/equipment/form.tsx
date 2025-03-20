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

interface CoopEquipmentFormProps {
    defaultValues?: Partial<typeof CoopEquipmentSchema._type>;
    closeDialog: () => void;
}

export default function CoopEquipmentForm({ defaultValues, closeDialog }: CoopEquipmentFormProps) {
    const queryClient = useQueryClient();

    // Initialize form
    const form = useForm({
        resolver: zodResolver(CoopEquipmentSchema),
        defaultValues: {
            coopEquipmentId: '',
            chickenCoopId: '',
            equipmentId: '',
            equipmentCode: '',
            equipmentName: '',
            purchaseDate: new Date().toISOString(),
            warranty: 12,
            ...defaultValues,
        },
    });

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateCoopEquipment : createCoopEquipment,
        onSuccess: ({ message }) => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['coopEquipments'] });
            toast.success(message);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message);
        },
    });

    const onSubmit = async (values: any) => {
        await mutation.mutateAsync(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Chicken Coop ID */}
                    <FormField
                        control={form.control}
                        name="chickenCoopId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chuồng Gà</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn chuồng gà" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {chickenCoops.map((coop) => (
                                                <SelectItem
                                                    key={coop.chickenCoopId}
                                                    value={coop.chickenCoopId}
                                                >
                                                    {coop.chickenCoopName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                <FormLabel>Thiết Bị</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn thiết bị" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {equipments.map((equip) => (
                                                <SelectItem
                                                    key={equip.equipmentId}
                                                    value={equip.equipmentId}
                                                >
                                                    {equip.equipmentName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                <FormLabel>Số Lượng</FormLabel>
                                <FormControl>
                                    <Input type="number" min={1} max={1000} {...field} />
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
                                <FormLabel>Ngày Gán</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Maintain Date */}
                    <FormField
                        control={form.control}
                        name="warranty"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày Bảo Trì</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        {...field}
                                        value={field.value ?? ''}
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
