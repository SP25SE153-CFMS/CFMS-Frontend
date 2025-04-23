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
    CreateFarmEmployeeSchema,
    FarmEmployeeSchema,
    type FarmEmployee,
} from '@/utils/schemas/farm-employee.schema';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addEmployeeToFarm, getFarms, updateEmployeeInFarm } from '@/services/farm.service';
import { getUsers } from '@/services/user.service';
import { Input } from '@/components/ui/input';
import { getCookie } from 'cookies-next';
import config from '@/configs';
import { formatDate } from '@/utils/functions';
import { vi } from 'date-fns/locale';
import { useState } from 'react';
import { FarmRole } from '@/utils/enum';
import { UserStatus, userStatusLabels, userStatusVariant } from '@/utils/enum/status.enum';
import { mapEnumToValues } from '@/utils/functions/enum.function';
import { Badge } from '../ui/badge';

interface AddEmployeeFormProps {
    defaultValues?: Partial<FarmEmployee>;
    closeDialog: () => void;
}

export default function FarmEmployeeForm({ defaultValues, closeDialog }: AddEmployeeFormProps) {
    const { data: farms } = useQuery({
        queryKey: ['farms'],
        queryFn: () => getFarms(),
    });

    const currentFarm = farms?.find((farm) => farm.farmId === getCookie(config.cookies.farmId));

    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: () => getUsers(),
    });

    const [searchQuery, setSearchQuery] = useState('');

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredUsers = users?.filter((user) => {
        const normalizedMail = user.mail.trim().toLowerCase();
        const normalizedPhone = user.phoneNumber?.replace(/\s/g, '').trim();
        const normalizedCccd = user.cccd?.trim().toLowerCase();
        return (
            normalizedMail === normalizedQuery ||
            (normalizedPhone && normalizedPhone === normalizedQuery) ||
            normalizedCccd === normalizedQuery
        );
    });

    // Initialize form
    const form = useForm<FarmEmployee>({
        resolver: zodResolver(defaultValues ? FarmEmployeeSchema : CreateFarmEmployeeSchema),
        defaultValues: {
            farmId: currentFarm?.farmId ?? '',
            userId: '',
            startDate: new Date().toISOString(),
            endDate: null,
            status: 1,
            farmRole: FarmRole.STAFF,
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateEmployeeInFarm : addEmployeeToFarm,
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
        values.status = Number(values.status);
        mutation.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="grid grid-cols-1 gap-6 px-1">
                    {/* Chọn trang trại */}
                    <FormField
                        control={form.control}
                        name="farmId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trang trại</FormLabel>
                                <FormControl>
                                    {/* <Select
                                        onValueChange={field.onChange}
                                        defaultValue={String(field.value)}
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
                                    </Select> */}
                                    <Input
                                        type="text"
                                        disabled
                                        {...field}
                                        value={currentFarm?.farmName ?? ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Chọn nhân viên */}
                    <FormField
                        control={form.control}
                        name="userId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nhân viên</FormLabel>
                                <FormControl>
                                    {defaultValues ? (
                                        <Input
                                            type="text"
                                            disabled
                                            {...field}
                                            value={
                                                users?.find((user) => user.userId === field.value)
                                                    ?.fullName ?? ''
                                            }
                                        />
                                    ) : (
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={String(field.value)}
                                            disabled={!!defaultValues}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn nhân viên" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <div className="p-2">
                                                    <Input
                                                        placeholder="Tìm kiếm theo email, SĐT, CCCD"
                                                        value={searchQuery}
                                                        onChange={(e) =>
                                                            setSearchQuery(e.target.value)
                                                        }
                                                        className="mb-2"
                                                    />
                                                </div>
                                                {filteredUsers?.length === 0 && (
                                                    <SelectItem value="not-found" disabled>
                                                        Không tìm thấy kết quả
                                                    </SelectItem>
                                                )}
                                                {filteredUsers?.map((user) => (
                                                    <SelectItem
                                                        key={user.userId}
                                                        value={user.userId}
                                                    >
                                                        {user.fullName} (
                                                        {user.mail.toLowerCase() ===
                                                        searchQuery.toLowerCase()
                                                            ? user.mail
                                                            : user.phoneNumber &&
                                                                user.phoneNumber
                                                                    .split(' ')
                                                                    .splice(1)
                                                                    .join('') ===
                                                                    searchQuery.replace(/\s/g, '')
                                                              ? user.phoneNumber
                                                              : user.cccd?.toLowerCase() ===
                                                                  searchQuery.toLowerCase()
                                                                ? user.cccd
                                                                : ''}
                                                        )
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Ngày bắt đầu */}
                    {defaultValues && (
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
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                    )}
                                                >
                                                    {formatDate(field.value)}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={new Date(field.value)}
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
                    )}

                    {/* Ngày kết thúc */}
                    {defaultValues && (
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ngày kết thúc</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={'outline'}
                                                    className={cn(
                                                        'w-full pl-3 text-left font-normal',
                                                    )}
                                                >
                                                    {field.value
                                                        ? dayjs(new Date(field.value)).format(
                                                              'DD/MM/YYYY',
                                                          )
                                                        : '-'}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    field.value ? new Date(field.value) : new Date()
                                                }
                                                onSelect={(date) =>
                                                    field.onChange(date?.toISOString())
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {/* Farm role */}
                    {/* <FormField
                        control={form.control}
                        name="farmRole"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vai trò trong trang trại</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value?.toString()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn vai trò" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mapEnumToValues(FarmRole).map((role) => (
                                                <SelectItem value={role} key={role}>
                                                    {farmRoleLabels[role]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Trạng thái  */}
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tình trạng nhân viên</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={String(field.value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mapEnumToValues(UserStatus).map((status) => (
                                                <SelectItem value={status} key={Number(status)}>
                                                    <Badge variant={userStatusVariant[status]}>
                                                        {userStatusLabels[status]}
                                                    </Badge>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
