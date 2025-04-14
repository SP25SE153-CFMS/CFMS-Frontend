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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ConfigSchema, SystemConfig } from '@/schemas/config.schema';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createConfig } from '@/services/config.service';
import { updateConfig } from '@/services/config.service';
import { formatDate } from '@/utils/functions';
import { vi } from 'date-fns/locale';

interface ConfigFormProps {
    defaultValues?: Partial<SystemConfig>;
    closeDialog: () => void;
}

export function ConfigForm({ defaultValues, closeDialog }: ConfigFormProps) {
    // Initialize form
    const form = useForm<SystemConfig>({
        resolver: zodResolver(ConfigSchema),
        defaultValues: {
            settingName: '',
            settingValue: 0,
            description: '',
            effectedDateFrom: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
            effectedDateTo: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
            status: 1,
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateConfig : createConfig,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['configs'] });
            toast.success(
                defaultValues ? 'Cập nhật cấu hình thành công' : 'Tạo cấu hình thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    async function onSubmit(values: SystemConfig) {
        mutation.mutate(values);
    }

    // Form error handler
    const onError = (error: any) => {
        console.error(error);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="px-1 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="settingName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên cấu hình</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập tên cấu hình" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="settingValue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Giá trị</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        placeholder="Nhập giá trị"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Nhập mô tả cấu hình"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="effectedDateFrom"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Ngày bắt đầu hiệu lực</FormLabel>
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
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(field.value)}
                                            onSelect={(date) =>
                                                field.onChange(
                                                    format(date!, "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                                                )
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
                        name="effectedDateTo"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Ngày kết thúc hiệu lực</FormLabel>
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
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={new Date(field.value)}
                                            onSelect={(date) =>
                                                field.onChange(
                                                    format(date!, "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                                                )
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
                </div>

                <Button type="submit" className="float-right">
                    Lưu cấu hình
                </Button>
            </form>
        </Form>
    );
}
