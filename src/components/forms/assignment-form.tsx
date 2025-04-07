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
    AssignmentSchema,
    CreateAssignmentSchema,
    type Assignment,
} from '@/utils/schemas/assignment.schema';
import dayjs from 'dayjs';
import { createAssignment, updateAssignment } from '@/services/assignment.service';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapEnumToValues } from '@/utils/functions/enum.function';
import { AssignmentStatus } from '@/utils/enum/status.enum';

interface AssignmentFormProps {
    defaultValues?: Partial<Assignment>;
    closeDialog: () => void;
}

export default function AssignmentForm({ defaultValues, closeDialog }: AssignmentFormProps) {
    // Initialize form
    const form = useForm<Assignment>({
        resolver: zodResolver(defaultValues ? AssignmentSchema : CreateAssignmentSchema),
        defaultValues: {
            assignmentId: '',
            taskId: '',
            assignedToId: '',
            assignedDate: new Date().toISOString(),
            // shiftScheduleId: '',
            taskScheduleId: '',
            status: 0,
            note: '',
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateAssignment : createAssignment,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
            toast.success(
                defaultValues ? 'Cập nhật phân công thành công' : 'Tạo phân công thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    async function onSubmit(values: Assignment) {
        mutation.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Task ID */}
                    <FormField
                        control={form.control}
                        name="taskId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Công việc</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập ID công việc" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Assigned To ID */}
                    <FormField
                        control={form.control}
                        name="assignedToId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Người được phân công</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập ID người được phân công"
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
                                <FormLabel>Ngày phân công</FormLabel>
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

                    {/* Shift Schedule ID */}
                    {/* <FormField
                        control={form.control}
                        name="shiftScheduleId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Lịch ca</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập ID lịch ca" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Task Schedule ID */}
                    <FormField
                        control={form.control}
                        name="taskScheduleId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Lịch công việc</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập ID lịch công việc"
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
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value?.toString()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mapEnumToValues(AssignmentStatus).map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
