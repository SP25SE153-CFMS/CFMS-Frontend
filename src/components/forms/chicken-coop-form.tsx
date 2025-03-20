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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ChickenCoop,
    ChickenCoopSchema,
    CreateChickenCoopSchema,
} from '@/utils/schemas/chicken-coop.schema';
import { breedingAreas } from '@/utils/data/table.data';
import { BreedingArea } from '@/utils/schemas/breeding-area.schema';
import { createChickenCoop, updateChickenCoop } from '@/services/chicken-coop.service';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ChickenCoopFormProps {
    defaultValues?: Partial<ChickenCoop>;
    closeDialog: () => void;
}

export default function ChickenCoopForm({ defaultValues, closeDialog }: ChickenCoopFormProps) {
    // Initialize form
    const form = useForm<ChickenCoop>({
        resolver: zodResolver(defaultValues ? ChickenCoopSchema : CreateChickenCoopSchema),
        defaultValues: {
            chickenCoopCode: '',
            chickenCoopName: '',
            capacity: 0,
            status: '0',
            breedingAreaId: '',
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateChickenCoop : createChickenCoop,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['chicken-coops'] });
            toast.success(
                defaultValues ? 'Cập nhật chuồng gà thành công' : 'Tạo chuồng gà thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    // Form submit handler
    async function onSubmit(values: ChickenCoop) {
        mutation.mutate(values);
    }

    // Form error handler
    function onError(errors: any) {
        console.log(errors);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-6 px-1">
                    {/* Mã chuồng */}
                    <FormField
                        control={form.control}
                        name="chickenCoopCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã chuồng gà</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập mã chuồng" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tên chuồng */}
                    <FormField
                        control={form.control}
                        name="chickenCoopName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên chuồng</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập tên chuồng" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Sức chứa */}
                    <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sức chứa</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Nhập sức chứa"
                                        min={0}
                                        {...field}
                                    />
                                </FormControl>
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
                                            <SelectItem value="AVAILABLE">Sẵn sàng</SelectItem>
                                            <SelectItem value="OCCUPIED">Đang sử dụng</SelectItem>
                                            <SelectItem value="UNDER_MAINTENANCE">
                                                Bảo trì
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Chọn khu vực chăn nuôi */}
                    <FormField
                        control={form.control}
                        name="breedingAreaId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Khu vực chăn nuôi</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn khu vực" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {breedingAreas.map((area: BreedingArea) => (
                                                <SelectItem
                                                    key={area.breedingAreaId}
                                                    value={area.breedingAreaId}
                                                >
                                                    {area.breedingAreaName}
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

                <Button type="submit" className="mx-auto w-60">
                    Gửi
                </Button>
            </form>
        </Form>
    );
}
