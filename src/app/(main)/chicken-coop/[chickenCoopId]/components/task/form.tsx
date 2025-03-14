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
import { FarmEmployeeSchema, type FarmEmployee } from '@/utils/schemas/farm-employee.schema';
import dayjs from 'dayjs';
import { createFarmEmployee, updateFarmEmployee } from '@/services/farm-employee.service';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFarms } from '@/services/farm.service';
import { getUsers } from '@/services/user.service';

interface AddEmployeeFormProps {
    defaultValues?: Partial<FarmEmployee>;
    closeDialog: () => void;
}

export default function AddEmployeeForm({ defaultValues, closeDialog }: AddEmployeeFormProps) {
    // Initialize form
    const form = useForm<FarmEmployee>({
        resolver: zodResolver(FarmEmployeeSchema),
        defaultValues: {
            farmId: '',
            employeeId: '',
            startDate: new Date().toISOString(),
            endDate: null,
            status: '1',
            roleName: '',
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateFarmEmployee : createFarmEmployee,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['farmEmployees'] });
            toast.success(
                defaultValues ? 'Cập nhật nhân viên thành công' : 'Thêm nhân viên thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    async function onSubmit(values: FarmEmployee) {
        mutation.mutate(values);
    }

    const { data: farms } = useQuery({
        queryKey: ['farms'],
        queryFn: () => getFarms(),
    });

    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: () => getUsers(),
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Chọn trang trại */}
                    <FormField
                        control={form.control}
                        name="farmId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trang trại</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trang trại" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {farms?.map((farm) => (
                                                <SelectItem key={farm.farmId} value={farm.farmId}>
                                                    {farm.farmName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Chọn nhân viên */}
                    <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nhân viên</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn nhân viên" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users?.map((user) => (
                                                <SelectItem key={user.userId} value={user.userId}>
                                                    {user.fullName}
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
                    <FormField
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
                    />
                </div>

                <Button type="submit" className="mx-auto mt-6 w-60">
                    Gửi
                </Button>
            </form>
        </Form>
    );
}
