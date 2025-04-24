'use client';

import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { inviteOrEnrollToFarm } from '@/services/farm.service';
import { InviteEnrollRequest } from '@/utils/types/custom.type';
import { FarmRole, farmRoleLabels } from '@/utils/enum';
import { getUsers } from '@/services/user.service';
import { LoadingSpinner } from '../ui/loading-spinner';
import { useState } from 'react';
import { Badge } from '../ui/badge';

interface InvitationFormProps {
    defaultValues?: Partial<InviteEnrollRequest>;
    closeDialog: () => void;
    isCurrentRoleFarmOwner?: boolean;
}

export default function InvitationForm({
    defaultValues,
    closeDialog,
    isCurrentRoleFarmOwner,
}: InvitationFormProps) {
    const form = useForm({
        defaultValues: {
            farmCode: '',
            methodAccess: '',
            farmRole: 0,
            employessInvitation: [{ userId: '' }],
            ...defaultValues,
        },
    });

    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: () => getUsers(),
    });

    const [employeesInvitation, setEmployeesInvitation] = useState<string[]>([]);
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

    // const { fields, append, remove } = useFieldArray({
    //     control: form.control,
    //     name: 'employessInvitation',
    // });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: inviteOrEnrollToFarm,
        onSuccess: (response) => {
            // Show success message
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success(response.message);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    async function onSubmit(values: any) {
        values.farmCode = JSON.parse(sessionStorage.getItem('activeFarm') || '{}').farmCode;
        values.methodAccess = 'invite';
        values.employessInvitation = employeesInvitation.map((item) => ({
            userId: item,
        }));
        mutation.mutate(values);
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[75vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="grid grid-cols-1 gap-6 px-1">
                    {/* Farm Code */}
                    {/* <FormField
                        control={form.control}
                        name="farmCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã trang trại</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập mã trang trại" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Method Access */}
                    {/* <FormField
                        control={form.control}
                        name="methodAccess"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phương thức truy cập</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn phương thức truy cập" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="phone">Số điện thoại</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Farm Role */}
                    <FormField
                        control={form.control}
                        name="farmRole"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vai trò trong trang trại</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        // defaultValue={String(field.value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn vai trò" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isCurrentRoleFarmOwner && (
                                                <SelectItem
                                                    key={FarmRole.MANAGER}
                                                    value={FarmRole.MANAGER.toString()}
                                                >
                                                    {farmRoleLabels[FarmRole.MANAGER]}
                                                </SelectItem>
                                            )}
                                            <SelectItem
                                                key={FarmRole.STAFF}
                                                value={FarmRole.STAFF.toString()}
                                            >
                                                {farmRoleLabels[FarmRole.STAFF]}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Employees Invitation */}
                    {/* <FormField
                        control={form.control}
                        name="employeesInvitation"
                        render={() => {
                            return (
                                <FormItem>
                                    <FormLabel>Chọn người dùng</FormLabel>
                                    <FormControl>
                                        <MultipleSelector
                                            commandProps={{
                                                label: 'Chọn người dùng',
                                                onKeyDown: (e: any) => {
                                                    console.log(filteredUsers);
                                                    setSearchQuery(e.target.value);
                                                },
                                            }}
                                            onChange={(value) => {
                                                console.log(value);

                                                setEmployeesInvitation(
                                                    value.map((value) => value.value),
                                                );
                                            }}
                                            options={filteredUsers?.map((user) => ({
                                                value: user.userId,
                                                label: `${user.fullName}`,
                                            }))}
                                            placeholder="Tìm kiếm theo email, SĐT, CCCD"
                                            hideClearAllButton
                                            hidePlaceholderWhenSelected
                                            // onSearchSync={(query) => {
                                            //     const normalizedQuery = query.trim().toLowerCase();
                                            //     return (
                                            //         users
                                            //             ?.filter((user) => {
                                            //                 const normalizedMail = user.mail
                                            //                     .trim()
                                            //                     .toLowerCase();
                                            //                 const normalizedPhone = user.phoneNumber
                                            //                     ?.replace(/\s/g, '')
                                            //                     .trim();
                                            //                 const normalizedCccd = user.cccd
                                            //                     ?.trim()
                                            //                     .toLowerCase();
                                            //                 return (
                                            //                     normalizedMail.includes(
                                            //                         normalizedQuery,
                                            //                     ) ||
                                            //                     (normalizedPhone &&
                                            //                         normalizedPhone.includes(
                                            //                             normalizedQuery,
                                            //                         )) ||
                                            //                     normalizedCccd?.includes(
                                            //                         normalizedQuery,
                                            //                     )
                                            //                 );
                                            //             })
                                            //             .map((user) => ({
                                            //                 value: user.userId,
                                            //                 label: `${user.fullName} (${user.mail || user.phoneNumber || user.cccd})`,
                                            //             })) || []
                                            //     );
                                            // }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    /> */}
                    <FormItem>
                        <FormLabel>Người được phân công</FormLabel>
                        <FormControl>
                            <Select
                                onValueChange={(value) => {
                                    setEmployeesInvitation((prev) => {
                                        const updated = [...prev, value];
                                        return updated.filter(
                                            (item, index) => updated.indexOf(item) === index,
                                        );
                                    });
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue className="truncate">
                                        {employeesInvitation.length > 0
                                            ? employeesInvitation.map((emp) => (
                                                  <Badge
                                                      key={emp}
                                                      className="mr-1"
                                                      variant="outline"
                                                  >
                                                      {
                                                          users?.find((user) => user.userId === emp)
                                                              ?.fullName
                                                      }
                                                  </Badge>
                                              ))
                                            : 'Chọn người được phân công'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <div className="p-2">
                                        <Input
                                            placeholder="Tìm kiếm theo email, SĐT, CCCD"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="mb-2"
                                        />
                                    </div>
                                    {filteredUsers?.length === 0 && (
                                        <SelectItem value="not-found" disabled>
                                            Không tìm thấy kết quả
                                        </SelectItem>
                                    )}
                                    {filteredUsers?.map((user) => (
                                        <SelectItem key={user.userId} value={user.userId}>
                                            {user.fullName} (
                                            {user.mail.toLowerCase() === searchQuery.toLowerCase()
                                                ? user.mail
                                                : user.phoneNumber &&
                                                    user.phoneNumber
                                                        .split(' ')
                                                        .splice(1)
                                                        .join('') === searchQuery.replace(/\s/g, '')
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
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    {/* <div>
                        <FormLabel>Danh sách nhân viên</FormLabel>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-4 mb-4">
                                <FormField
                                    control={form.control}
                                    name={`employessInvitation.${index}.email`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`employessInvitation.${index}.phoneNumber`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder="Số điện thoại" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ email: '', phoneNumber: '' })}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm nhân viên
                        </Button>
                    </div> */}
                </div>

                <Button type="submit" className="mx-auto mt-6 w-60" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Gửi
                </Button>
            </form>
        </Form>
    );
}
