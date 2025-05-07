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
import type { QuantityLog } from '@/utils/schemas/quantity-log.schema';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';
import { useParams } from 'next/navigation';
import { exportChicken } from '@/services/chicken-batch.service';
import { formatDate } from '@/utils/functions';
import { vi } from 'date-fns/locale';
import { QuantityLogStatus, quantityLogStatusLabels } from '@/utils/enum/status.enum';
import dayjs from 'dayjs';
import { onError } from '@/utils/functions/form.function';
import { useCallback, useMemo, useState } from 'react';
import type { ChickenDetailRequest, ExportChicken } from '@/utils/types/custom.type';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChickenGender, chickenGenderLabels } from '@/utils/enum/gender.enum';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
            const currentQuantityInForm = quantityLogDetails?.find(
                (item) => item.gender === gender,
            );
            if (!currentQuantityInForm) return '';
            if (!detail) return `Không tồn tại ${chickenGenderLabels[gender]?.toLowerCase()}`;
            if (currentQuantityInForm?.quantity > detail.quantity) {
                return `Số lượng ${chickenGenderLabels[detail.gender]?.toLowerCase()} không được vượt quá ${detail.quantity} con`;
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

    const totalQuantity = useMemo(() => {
        return quantityLogDetails.reduce((sum, detail) => sum + detail.quantity, 0);
    }, [quantityLogDetails]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="flex flex-col space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="logDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                        Ngày {quantityLogStatusLabels[status]?.toLowerCase()}
                                    </FormLabel>
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
                                        <PopoverContent align="start" className="w-auto p-0">
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

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Ghi chú</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nhập ghi chú về việc xuất gà..."
                                            className="resize-none min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <Label className="text-sm font-medium">Chi tiết xuất chuồng</Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Thêm thông tin về số lượng và giới tính gà xuất
                                </p>
                            </div>
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
                                Thêm loại
                            </Button>
                        </div>

                        <Card className="border-dashed">
                            <CardContent className="p-4 space-y-4">
                                {quantityLogDetails.map((detail, index) => (
                                    <div key={index} className="space-y-2">
                                        {index > 0 && <Separator className="my-3" />}
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-medium">
                                                {/* {detail.gender === 0 ? 'Gà trống' : 'Gà mái'} */}
                                                Loại gà
                                            </h4>
                                            {quantityLogDetails.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2 text-destructive hover:text-destructive/90"
                                                    onClick={() => {
                                                        const newDetails = [...quantityLogDetails];
                                                        newDetails.splice(index, 1);
                                                        setQuantityLogDetails(newDetails);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Xóa
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label
                                                    htmlFor={`gender-${index}`}
                                                    className="text-xs"
                                                >
                                                    Giới tính
                                                </Label>
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
                                                    <SelectTrigger
                                                        id={`gender-${index}`}
                                                        className="mt-1"
                                                    >
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
                                            <div>
                                                <Label
                                                    htmlFor={`quantity-${index}`}
                                                    className="text-xs"
                                                >
                                                    Số lượng
                                                </Label>
                                                <Input
                                                    id={`quantity-${index}`}
                                                    type="number"
                                                    min="1"
                                                    className="mt-1"
                                                    value={detail.quantity}
                                                    onChange={(e) => {
                                                        const newDetails = [...quantityLogDetails];
                                                        newDetails[index].quantity =
                                                            Number.parseInt(e.target.value) || 0;
                                                        setQuantityLogDetails(newDetails);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {detail.gender === ChickenGender.ROOSTER &&
                                            roosterQuantityMessage && (
                                                <p className="text-destructive text-xs flex items-center mt-1">
                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                    {roosterQuantityMessage}
                                                </p>
                                            )}
                                        {detail.gender === ChickenGender.HEN &&
                                            henQuantityMessage && (
                                                <p className="text-destructive text-xs flex items-center mt-1">
                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                    {henQuantityMessage}
                                                </p>
                                            )}
                                    </div>
                                ))}

                                {totalQuantity > 0 && (
                                    <div className="flex justify-between items-center pt-2 mt-3 border-t">
                                        <span className="text-sm font-medium">Tổng số lượng:</span>
                                        <Badge variant="default" className="text-sm">
                                            {totalQuantity} con
                                        </Badge>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {quantityLogDetails.some((d) => d.quantity > 0) && (
                            <Alert
                                variant="default"
                                className="bg-amber-50 text-amber-800 border-amber-200"
                            >
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Lưu ý khi xuất chuồng</AlertTitle>
                                <AlertDescription className="text-xs">
                                    Vui lòng kiểm tra kỹ số lượng gà xuất chuồng. Sau khi xác nhận
                                    sẽ không thể hoàn tác.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button
                        type="submit"
                        className="w-full max-w-xs"
                        disabled={isErrorQuantity || mutation.isPending || totalQuantity === 0}
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            'Xác nhận xuất chuồng'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
