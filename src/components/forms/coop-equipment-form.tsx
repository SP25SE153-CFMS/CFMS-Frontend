'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarIcon, Loader2, Plus } from 'lucide-react';
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
    CoopEquipmentSchema,
    CreateCoopEquipmentSchema,
    type CoopEquipment,
} from '@/utils/schemas/coop-equipment.schema';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { addCoopEquipment, updateCoopEquipment } from '@/services/chicken-coop.service';
import { vi } from 'date-fns/locale';
import { formatDate } from '@/utils/functions';
import { Textarea } from '../ui/textarea';
import { onError } from '@/utils/functions/form.function';
import { getWarestockResourceByFarm } from '@/services/warehouse.service';
import Link from 'next/link';
import config from '@/configs';

interface CoopEquipmentFormProps {
    defaultValues?: Partial<CoopEquipment>;
    closeDialog: () => void;
}

export default function CoopEquipmentForm({ defaultValues, closeDialog }: CoopEquipmentFormProps) {
    const { chickenCoopId }: { chickenCoopId: string } = useParams();

    const { data: equipments } = useQuery({
        queryKey: ['equipments'],
        queryFn: () => getWarestockResourceByFarm('equipment'),
    });

    // Initialize form
    const form = useForm<CoopEquipment>({
        resolver: zodResolver(defaultValues ? CoopEquipmentSchema : CreateCoopEquipmentSchema),
        defaultValues: {
            coopEquipmentId: '',
            chickenCoopId,
            equipmentId: '',
            quantity: 1,
            assignedDate: undefined,
            lastMaintenanceDate: null,
            nextMaintenanceDate: null,
            maintenanceInterval: 1,
            status: 0,
            note: '',
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateCoopEquipment : addCoopEquipment,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['chickenCoop', chickenCoopId] });
            toast.success(
                defaultValues
                    ? 'Cập nhật thiết bị chuồng thành công'
                    : 'Thêm thiết bị vào chuồng thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast(error?.response?.data?.message, { icon: '⚠️' });
        },
    });

    // Form submit handler
    async function onSubmit(values: CoopEquipment) {
        values.assignedDate = dayjs(values.assignedDate).format('YYYY-MM-DD');
        values.lastMaintenanceDate = dayjs(values.lastMaintenanceDate).format('YYYY-MM-DD');
        values.nextMaintenanceDate = dayjs(values.nextMaintenanceDate).format('YYYY-MM-DD');

        mutation.mutate(values);
    }

    // const chickenCoops: ChickenCoop[] = JSON.parse(sessionStorage.getItem('chickenCoops') || '[]');

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Chicken Coop ID */}
                    {/* <FormField
                        control={form.control}
                        name="chickenCoopId"
                        render={() => (
                            <FormItem>
                                <FormLabel>Chuồng gà</FormLabel>
                                <FormControl>
                                    {chickenCoops && (
                                        <Input
                                            type="text"
                                            placeholder="Chuồng gà"
                                            value={
                                                chickenCoops.find(
                                                    (coop) => coop.chickenCoopId === chickenCoopId,
                                                )?.chickenCoopName
                                            }
                                            readOnly
                                        />
                                    )}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Equipment ID */}
                    <FormField
                        control={form.control}
                        name="equipmentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thiết bị</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn thiết bị" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {equipments?.map((equipment) => (
                                                <SelectItem
                                                    key={equipment.equipmentId}
                                                    value={equipment.equipmentId}
                                                >
                                                    {equipment.equipmentName}
                                                </SelectItem>
                                            ))}
                                            {equipments?.length === 0 && (
                                                <div className="p-2">
                                                    <Link
                                                        href={config.routes.ware}
                                                        className="text-sm font-medium flex items-center p-2 rounded-md hover:bg-muted"
                                                    >
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Tạo trang thiết bị
                                                    </Link>
                                                </div>
                                            )}
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
                                <FormLabel>Số lượng</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="Nhập số lượng"
                                        {...field}
                                    />
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
                                                {formatDate(field.value)}
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
                                            onSelect={(date) => {
                                                field.onChange(date?.toISOString());
                                                form.setValue(
                                                    'lastMaintenanceDate',
                                                    date
                                                        ? date.toISOString()
                                                        : new Date().toISOString(),
                                                );
                                                form.setValue(
                                                    'nextMaintenanceDate',
                                                    dayjs(date)
                                                        .add(
                                                            Number(
                                                                form.getValues(
                                                                    'maintenanceInterval',
                                                                ) || 0,
                                                            ),
                                                            'day',
                                                        ) // Ensure quantity is a number
                                                        .toISOString(),
                                                );
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

                    {/* Last Maintenance Date */}
                    <FormField
                        control={form.control}
                        name="lastMaintenanceDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày bảo trì gần nhất</FormLabel>
                                {/* <Popover>
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
                                            onSelect={(date) => {
                                                field.onChange(date?.toISOString());
                                                form.setValue(
                                                    'nextMaintenanceDate',
                                                    dayjs(date)
                                                        .add(
                                                            Number(
                                                                form.getValues(
                                                                    'maintenanceInterval',
                                                                ) || 0,
                                                            ),
                                                            'day',
                                                        ) // Ensure quantity is a number
                                                        .toISOString(),
                                                );
                                            }}
                                            initialFocus
                                            locale={vi}
                                        />
                                    </PopoverContent>
                                </Popover> */}
                                <Button
                                    variant={'outline'}
                                    className={cn('w-full pl-3 text-left font-normal')}
                                    disabled
                                >
                                    {field.value ? dayjs(field.value).format('DD/MM/YYYY') : '-'}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
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
                                {/* <Popover>
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
                                            locale={vi}
                                        />
                                    </PopoverContent>
                                </Popover> */}
                                <Button
                                    variant={'ghost'}
                                    className={cn('w-full pl-3 text-left font-normal')}
                                    disabled
                                >
                                    {field.value ? dayjs(field.value).format('DD/MM/YYYY') : '-'}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
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
                                        min={1}
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value; // Get the input value
                                            field.onChange(value); // Update the field value
                                            form.setValue(
                                                'nextMaintenanceDate',
                                                dayjs(form.getValues('lastMaintenanceDate'))
                                                    .add(Number(value || 0), 'day') // Ensure the value is a number
                                                    .toISOString(),
                                            );
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Status */}
                    {/* <FormField
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
                                            {mapEnumToValues(EquipmentStatus).map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {equipmentStatusLabels[status]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Note */}
                    <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Ghi chú</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Nhập ghi chú" {...field} />
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
