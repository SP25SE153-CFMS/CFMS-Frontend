'use client';

import { useForm } from 'react-hook-form';
import { AlertCircle, CalendarIcon, Loader2, Plus, Trash2 } from 'lucide-react';
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
import { type QuantityLog } from '@/utils/schemas/quantity-log.schema';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Textarea } from '../ui/textarea';
import { useParams } from 'next/navigation';
import { exportChicken } from '@/services/chicken-batch.service';
import { formatDate } from '@/utils/functions';
import { vi } from 'date-fns/locale';
import { QuantityLogStatus, quantityLogStatusLabels } from '@/utils/enum/status.enum';
import dayjs from 'dayjs';
import { onError } from '@/utils/functions/form.function';
import { useCallback, useMemo, useState } from 'react';
import { ChickenDetailRequest, ExportChicken } from '@/utils/types/custom.type';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ChickenGender, chickenGenderLabels } from '@/utils/enum/gender.enum';

interface ExportChickenFormProps {
    defaultValues?: Partial<QuantityLog>;
    closeDialog: () => void;
}

export default function ExportChickenForm({ defaultValues, closeDialog }: ExportChickenFormProps) {
    const { chickenBatchId }: { chickenBatchId: string } = useParams();

    const [quantityLogDetails, setQuantityLogDetails] = useState<ChickenDetailRequest[]>([
        { gender: 0, quantity: 0 },
    ]);

    // Initialize form
    const form = useForm<QuantityLog>({
        // resolver: zodResolver(CreateQuantityLogSchema),
        defaultValues: {
            chickenBatchId,
            logDate: new Date().toISOString(),
            notes: '',
            // quantity: 0,
            logType: QuantityLogStatus.EXPORT,
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: exportChicken,
        onSuccess: (response) => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['chickenBatch', chickenBatchId] });
            toast.success(response.message);
        },
        onError: (error: any) => {
            console.error(error);
            toast(error?.response?.data?.message, { icon: '⚠️' });
        },
    });

    // Form submit handler
    async function onSubmit(values: any) {
        const newValues: ExportChicken = {
            ...values,
            // chickenBatchId,
            logDate: dayjs(values.logDate).format('YYYY-MM-DD'),
            quantityLogDetails,
            // TOD: Add imageUrl
            imageUrl: '',
        };
        mutation.mutate(newValues);
    }

    const getQuantityMessage = useCallback(
        (gender: ChickenGender) => {
            const chickenDetails = JSON.parse(sessionStorage.getItem('chickenDetails') || '[]');
            const detail = chickenDetails.find(
                (item: ChickenDetailRequest) => item.gender === gender,
            );
            if (!detail) return '';
            const currentQuantityInForm = quantityLogDetails?.find(
                (item) => item.gender === gender,
            );
            if (!currentQuantityInForm) return '';
            if (currentQuantityInForm?.quantity > detail.quantity) {
                return `Số lượng ${chickenGenderLabels[detail.gender]?.toLowerCase()} không được vượt quá ${detail.quantity}`;
            }
            return '';
        },
        [quantityLogDetails],
    );

    const roosterQuantityMessage = useMemo(
        () => getQuantityMessage(ChickenGender.ROOSTER),
        [getQuantityMessage],
    );

    const henQuantityMessage = useMemo(
        () => getQuantityMessage(ChickenGender.HEN),
        [getQuantityMessage],
    );

    const isErrorQuantity = useMemo(() => {
        return !!roosterQuantityMessage || !!henQuantityMessage;
    }, [roosterQuantityMessage, henQuantityMessage]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
                    <div className="flex flex-col gap-6 px-1">
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
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                    )}
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
                                                onSelect={(date) =>
                                                    field.onChange(date?.toISOString())
                                                }
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
                        {/* <FormField
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
                        /> */}

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
                    </div>

                    {/* Quantity Log Details */}
                    <div className="*:not-first:mt-2">
                        <div className="flex justify-between items-center mb-2">
                            <Label htmlFor={`chickenBatchName`}>Chi tiết giống gà</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={quantityLogDetails.length >= 2}
                                onClick={() =>
                                    setQuantityLogDetails([
                                        ...quantityLogDetails,
                                        {
                                            gender: quantityLogDetails[0].gender === 0 ? 1 : 0,
                                            quantity: 0,
                                        },
                                    ])
                                }
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm
                            </Button>
                        </div>

                        <div className="space-y-4 border p-4 rounded-md">
                            {quantityLogDetails.map((detail, index) => (
                                <div key={index}>
                                    <div className="grid grid-cols-5 gap-4 pt-2">
                                        <div className="col-span-2">
                                            <Label htmlFor={`gender-${index}`}>Giới tính</Label>
                                            <Select
                                                value={detail.gender.toString()}
                                                onValueChange={(value) => {
                                                    const newDetails = [...quantityLogDetails];
                                                    newDetails[index].gender =
                                                        Number.parseInt(value);
                                                    setQuantityLogDetails(newDetails);
                                                }}
                                                disabled={quantityLogDetails.length >= 2}
                                            >
                                                <SelectTrigger id={`gender-${index}`}>
                                                    <SelectValue placeholder="Chọn giới tính" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        value="0"
                                                        disabled={
                                                            index > 0 &&
                                                            quantityLogDetails[0].gender === 0
                                                        }
                                                    >
                                                        Trống
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="1"
                                                        disabled={
                                                            index > 0 &&
                                                            quantityLogDetails[0].gender === 1
                                                        }
                                                    >
                                                        Mái
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-2">
                                            <Label htmlFor={`quantity-${index}`}>Số lượng</Label>
                                            <Input
                                                id={`quantity-${index}`}
                                                type="number"
                                                min="1"
                                                value={detail.quantity}
                                                onChange={(e) => {
                                                    const newDetails = [...quantityLogDetails];
                                                    newDetails[index].quantity =
                                                        Number.parseInt(e.target.value) || 0;
                                                    setQuantityLogDetails(newDetails);
                                                }}
                                            />
                                        </div>
                                        {quantityLogDetails.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="mt-6"
                                                onClick={() => {
                                                    const newDetails = [...quantityLogDetails];
                                                    newDetails.splice(index, 1);
                                                    setQuantityLogDetails(newDetails);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <span className="text-red-500 text-sm">
                                        {detail.gender === ChickenGender.ROOSTER &&
                                            roosterQuantityMessage}
                                    </span>
                                    <span className="text-red-500 text-sm">
                                        {detail.gender === ChickenGender.HEN && henQuantityMessage}
                                    </span>
                                </div>
                            ))}

                            {quantityLogDetails.length > 0 && (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Lưu ý</AlertTitle>
                                    <AlertDescription>
                                        Tổng số lượng gà:{' '}
                                        {quantityLogDetails.reduce(
                                            (sum, detail) => sum + detail.quantity,
                                            0,
                                        )}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>
                </div>
                <Button
                    type="submit"
                    className="mx-auto mt-6 w-60"
                    disabled={isErrorQuantity || mutation.isPending}
                >
                    {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Gửi
                </Button>
            </form>
        </Form>
    );
}
