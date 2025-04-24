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
import { CreateQuantityLogSchema, type QuantityLog } from '@/utils/schemas/quantity-log.schema';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Textarea } from '../ui/textarea';
import { useParams } from 'next/navigation';
import { addQuantityLog } from '@/services/chicken-batch.service';
import { formatDate } from '@/utils/functions';
import { vi } from 'date-fns/locale';
import { QuantityLogStatus, quantityLogStatusLabels } from '@/utils/enum/status.enum';
import dayjs from 'dayjs';
import { onError } from '@/utils/functions/form.function';

interface QuantityLogFormProps {
    defaultValues?: Partial<QuantityLog>;
    closeDialog: () => void;
    status?: QuantityLogStatus;
}

export default function QuantityLogForm({
    defaultValues,
    closeDialog,
    status = QuantityLogStatus.EXPORT,
}: QuantityLogFormProps) {
    const { chickenBatchId }: { chickenBatchId: string } = useParams();

    // Initialize form
    const form = useForm<QuantityLog>({
        resolver: zodResolver(CreateQuantityLogSchema),
        defaultValues: {
            chickenBatchId,
            logDate: new Date().toISOString(),
            notes: '',
            quantity: 0,
            logType: status,
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        // mutationFn: defaultValues ? updateQuantityLog : createQuantityLog,
        mutationFn: addQuantityLog,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['chickenBatch', chickenBatchId] });
            toast.success('Xử lý thành công');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    async function onSubmit(values: QuantityLog) {
        values.logDate = dayjs(values.logDate).format('YYYY-MM-DD');
        mutation.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 gap-6 px-1">
                    {/* Chicken Batch ID */}
                    {/* <FormField
                        control={form.control}
                        name="chickenBatchId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Lô gà</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn chuồng gà" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {chickenBatches.map((batch) => (
                                                <SelectItem
                                                    key={batch.chickenCoopId}
                                                    value={batch.chickenCoopId}
                                                >
                                                    {batch.chickenCoopName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Log Date */}
                    <FormField
                        control={form.control}
                        name="logDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Ngày {quantityLogStatusLabels[status]?.toLowerCase()}
                                </FormLabel>
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
                                            onSelect={(date) => field.onChange(date?.toISOString())}
                                            initialFocus
                                            disabled={(date) => date < new Date()}
                                            locale={vi}
                                        />
                                    </PopoverContent>
                                </Popover>
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

                    {/* Notes */}
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

                    {/* Log Type */}
                    {/* <FormField
                        control={form.control}
                        name="logType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại nhật ký</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        defaultValue={field.value.toString()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn loại nhật ký" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Nhập</SelectItem>
                                            <SelectItem value="2">Xuất</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}
                </div>
                <Button type="submit" className="mx-auto mt-6 w-60" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Gửi
                </Button>
            </form>
        </Form>
    );
}
