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
import { UserSchema, type User } from '@/utils/schemas/user.schema';
import dayjs from 'dayjs';
import { createUser, updateUser } from '@/services/user.service';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface EmployeeFormProps {
    defaultValues?: Partial<User>;
    closeDialog: () => void;
}

export default function EmployeeForm({ defaultValues, closeDialog }: EmployeeFormProps) {
    // Initialize form
    const form = useForm<User>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            userId: '',
            fullName: '',
            phoneNumber: '',
            mail: '',
            avatar: '',
            dateOfBirth: new Date().toISOString(),
            status: '1',
            address: '',
            cccd: '',
            systemRole: 0,
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateUser : createUser,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success(
                defaultValues ? 'Cập nhật người dùng thành công' : 'Tạo người dùng thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    async function onSubmit(values: User) {
        mutation.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Họ và Tên */}
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Họ và Tên</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập họ và tên" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="mail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Nhập email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Số điện thoại */}
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số điện thoại</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập số điện thoại"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Avatar */}
                    <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ảnh đại diện</FormLabel>
                                <FormControl>
                                    <Input
                                        type="url"
                                        placeholder="Nhập URL ảnh đại diện"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Địa chỉ */}
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Địa chỉ</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập địa chỉ" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* CCCD */}
                    <FormField
                        control={form.control}
                        name="cccd"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CCCD</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập CCCD" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Vai trò */}
                    <FormField
                        control={form.control}
                        name="systemRole"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vai trò</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập vai trò" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Ngày sinh */}
                    <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày sinh</FormLabel>
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

                    {/* Trạng thái */}
                    <FormField
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
                                            <SelectItem value="1">Đang hoạt động</SelectItem>
                                            <SelectItem value="0">Ngừng hoạt động</SelectItem>
                                        </SelectContent>
                                    </Select>
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
