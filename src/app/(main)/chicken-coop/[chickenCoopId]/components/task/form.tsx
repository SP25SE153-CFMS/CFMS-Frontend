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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { TaskLogSchema, type TaskLog } from '@/utils/schemas/task-log.schema';
import { createTaskLog, updateTaskLog } from '@/services/task-log.service';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChickenCoop } from '@/utils/schemas/chicken-coop.schema';

interface AddTaskLogFormProps {
    defaultValues?: Partial<TaskLog>;
    closeDialog: () => void;
}

export default function AddTaskLogForm({ defaultValues, closeDialog }: AddTaskLogFormProps) {
    // Initialize form
    const form = useForm<TaskLog>({
        resolver: zodResolver(TaskLogSchema),
        defaultValues: {
            chickenCoopId: '',
            completedAt: '',
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateTaskLog : createTaskLog,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['taskLogs'] });
            toast.success(
                defaultValues
                    ? 'Cập nhật nhật ký công việc thành công'
                    : 'Thêm nhật ký công việc thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast(error?.response?.data?.message, { icon: '⚠️' });
        },
    });

    // Form submit handler
    async function onSubmit(values: TaskLog) {
        mutation.mutate(values);
    }

    const chickenCoops: ChickenCoop[] = JSON.parse(sessionStorage.getItem('chickenCoops') || '[]');

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Chọn loại công việc */}
                    {/* <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại công việc</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập loại công việc"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Chọn chuồng gà */}
                    <FormField
                        control={form.control}
                        name="chickenCoopId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chuồng gà</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn chuồng gà" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {chickenCoops?.map((coop) => (
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

                    {/* Ngày bắt đầu */}
                    {/* <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày bắt đầu</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn('w-full pl-3 text-left font-normal')}
                                            >
                                                {dayjs(new Date(field.value)).format('DD/MM/YYYY')}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(field.value)}
                                            onSelect={(date) => field.onChange(date?.toISOString())}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}
                </div>

                <Button type="submit" className="mx-auto mt-6 w-60">
                    Gửi
                </Button>
            </form>
        </Form>
    );
}
