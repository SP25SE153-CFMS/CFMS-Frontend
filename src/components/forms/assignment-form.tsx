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
import { createAssignment, updateAssignment } from '@/services/assignment.service';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTasks } from '@/services/task.service';
import { getEmployeesByFarmId } from '@/services/farm.service';
import { getCookie } from 'cookies-next';
import config from '@/configs';
import { Textarea } from '../ui/textarea';
import { AssignmentStatus, TaskStatus } from '@/utils/enum/status.enum';
import { vi } from 'date-fns/locale';
import { formatDate } from '@/utils/functions';
import MultipleSelector from '../ui/multiselect';
import { useState } from 'react';

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
            // taskScheduleId: '',
            status: AssignmentStatus.ASSIGNED,
            note: '',
            ...defaultValues,
        },
    });

    const { data: tasks } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const tasks = await getTasks();
            return tasks.filter((task) => task.status === TaskStatus.PENDING);
        },
    });

    const { data: farmEmployees } = useQuery({
        queryKey: ['farm-employees'],
        queryFn: () => getEmployeesByFarmId(getCookie(config.cookies.farmId) ?? ''),
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

    const [assignedToIds, setAssignedToIds] = useState<string[]>([]);

    // Form submit handler
    async function onSubmit(values: any) {
        values.assignedToIds = assignedToIds;
        mutation.mutate(values);
    }

    function onError(error: any) {
        console.error(error);
        // toast.error(error?.response?.data?.message);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 gap-6 px-1">
                    {/* Task ID */}
                    <FormField
                        control={form.control}
                        name="taskId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Công việc</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn công việc" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tasks?.map((task) => (
                                                <SelectItem key={task.taskId} value={task.taskId}>
                                                    {task.taskName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Assigned To ID */}
                    <FormField
                        control={form.control}
                        name="assignedToId"
                        render={() => (
                            <FormItem>
                                <FormLabel>Người được phân công</FormLabel>
                                <FormControl>
                                    {/* <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn người được phân công" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {farmEmployees?.map((employee) => (
                                                <SelectItem
                                                    key={employee.userId}
                                                    value={employee.userId}
                                                >
                                                    {employee.user.fullName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select> */}
                                    <MultipleSelector
                                        commandProps={{
                                            label: 'Chọn người được phân công',
                                        }}
                                        // value={field.value}
                                        onChange={(value) => {
                                            setAssignedToIds(value.map((item) => item.value));
                                        }}
                                        defaultOptions={farmEmployees?.map((employee) => ({
                                            value: employee.userId,
                                            label: employee.user.fullName,
                                        }))}
                                        placeholder="Chọn người được phân công"
                                        hideClearAllButton
                                        hidePlaceholderWhenSelected
                                        emptyIndicator={
                                            <p className="text-center text-sm">Không tìm thấy</p>
                                        }
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
                                            locale={vi}
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
                    {/* <FormField
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
                    /> */}

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
                                        defaultValue={field.value?.toString()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mapEnumToValues(AssignmentStatus).map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {assignmentStatusLabels[status]}
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
                <Button type="submit" className="mx-auto mt-6 w-60" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Giao việc
                </Button>
            </form>
        </Form>
    );
}
