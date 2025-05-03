'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import {
    CalendarIcon,
    ClipboardList,
    Loader2,
    Plus,
    Stethoscope,
    Trash2,
    CalendarPlus2Icon as CalendarIcon2,
} from 'lucide-react';
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
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';
import { useParams } from 'next/navigation';
import { addHealthLog } from '@/services/chicken-batch.service';
import { formatDate } from '@/utils/functions';
import { vi } from 'date-fns/locale';
import dayjs from 'dayjs';
import { getTasksByFarmId } from '@/services/task.service';
import { getCookie } from 'cookies-next';
import config from '@/configs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getSubCategoryByCategoryType } from '@/utils/functions/category.function';
import { CategoryType } from '@/utils/enum/category.enum';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Define schema for validation
const HealthLogSchema = z.object({
    startDate: z.string(),
    endDate: z.string(),
    notes: z.string().optional(),
    chickenBatchId: z.string(),
    taskId: z.string(),
    healthLogDetails: z.array(
        z.object({
            criteriaId: z.string(),
            result: z.string(),
        }),
    ),
});

type HealthLog = z.infer<typeof HealthLogSchema>;

interface HealthLogFormProps {
    defaultValues?: Partial<HealthLog>;
    closeDialog: () => void;
}

export default function HealthLogForm({ defaultValues, closeDialog }: HealthLogFormProps) {
    const { chickenBatchId }: { chickenBatchId: string } = useParams();

    // Initialize form
    const form = useForm<HealthLog>({
        resolver: zodResolver(HealthLogSchema),
        defaultValues: {
            chickenBatchId,
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            notes: '',
            taskId: '',
            healthLogDetails: [{ criteriaId: '', result: '' }],
            ...defaultValues,
        },
    });

    // Get all tasks
    const farmId = getCookie(config.cookies.farmId) ?? '';

    const { data: tasks } = useQuery({
        queryKey: ['tasks'],
        queryFn: () => getTasksByFarmId(farmId),
    });

    const sortedTasks = useMemo(() => {
        return tasks?.sort((a, b) => {
            if (a.startWorkDate && b.startWorkDate) {
                return new Date(a.startWorkDate).getTime() - new Date(b.startWorkDate).getTime();
            }
            return 0;
        });
    }, [tasks]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'healthLogDetails',
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: addHealthLog,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['chickenBatch', chickenBatchId] });
            toast.success('Xử lý thành công');
        },
        onError: (error: any) => {
            console.error(error);
            toast(error?.response?.data?.message, { icon: '⚠️' });
        },
    });

    // Form submit handler
    async function onSubmit(values: any) {
        values.startDate = dayjs(values.startDate).format('YYYY-MM-DD');
        values.endDate = dayjs(values.endDate).format('YYYY-MM-DD');
        mutation.mutate(values);
    }

    const healthCriteria = useMemo(
        () => getSubCategoryByCategoryType(CategoryType.CHICKEN_CRITERIA),
        [],
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6 px-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="text-sm font-medium flex items-center">
                                            <CalendarIcon2 className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                                            Ngày bắt đầu
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
                                                        field.value
                                                            ? new Date(field.value)
                                                            : new Date()
                                                    }
                                                    onSelect={(date) =>
                                                        field.onChange(date?.toISOString())
                                                    }
                                                    initialFocus
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
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="text-sm font-medium flex items-center">
                                            <CalendarIcon2 className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                                            Ngày kết thúc
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
                                                        field.value
                                                            ? new Date(field.value)
                                                            : new Date()
                                                    }
                                                    onSelect={(date) =>
                                                        field.onChange(date?.toISOString())
                                                    }
                                                    initialFocus
                                                    locale={vi}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="taskId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium flex items-center">
                                        <ClipboardList className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                                        Công việc liên quan
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="h-auto">
                                                <SelectValue placeholder="Chọn công việc liên quan" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[300px]">
                                                {sortedTasks?.map((task) => (
                                                    <SelectItem
                                                        key={task.taskId}
                                                        value={task.taskId}
                                                    >
                                                        <div className="flex flex-col items-start py-1">
                                                            <span className="text-sm font-medium text-black">
                                                                {task.taskName}
                                                            </span>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {task.description ||
                                                                    'Không có mô tả'}
                                                            </p>
                                                            {task.startWorkDate && (
                                                                <div className="flex items-center mt-1">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs font-normal"
                                                                    >
                                                                        {dayjs(
                                                                            task.startWorkDate,
                                                                        ).format('DD/MM/YYYY')}
                                                                        {task?.shiftSchedule
                                                                            ?.shiftName &&
                                                                            ` - ${task?.shiftSchedule?.shiftName}`}
                                                                    </Badge>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
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
                                            placeholder="Nhập ghi chú về tình trạng sức khỏe..."
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
                                <h3 className="text-sm font-medium">Các tiêu chí sức khỏe</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Thêm các tiêu chí đánh giá sức khỏe và kết quả tương ứng
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ criteriaId: '', result: '' })}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm tiêu chí
                            </Button>
                        </div>

                        <Card className="border-dashed">
                            <CardContent className="p-4 space-y-4">
                                {fields.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <p>Chưa có tiêu chí nào. Vui lòng thêm tiêu chí.</p>
                                    </div>
                                ) : (
                                    fields.map((item, index) => (
                                        <div key={item.id} className="space-y-3">
                                            {index > 0 && <Separator className="my-3" />}
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-sm font-medium">
                                                    Tiêu chí #{index + 1}
                                                </h4>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2 text-destructive hover:text-destructive/90"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Xóa
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`healthLogDetails.${index}.criteriaId`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs">
                                                                Tiêu chí
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Chọn tiêu chí đánh giá" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {healthCriteria.map(
                                                                            (criteria) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        criteria.subCategoryId
                                                                                    }
                                                                                    value={
                                                                                        criteria.subCategoryId
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        criteria.subCategoryName
                                                                                    }
                                                                                </SelectItem>
                                                                            ),
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`healthLogDetails.${index}.result`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs">
                                                                Kết quả
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Nhập kết quả đánh giá"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button
                        type="submit"
                        className="w-full max-w-xs"
                        disabled={mutation.isPending || fields.length === 0}
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            'Lưu nhật ký sức khỏe'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
