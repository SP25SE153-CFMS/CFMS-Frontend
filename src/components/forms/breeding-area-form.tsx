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
import { Checkbox } from '@/components/ui/checkbox';
import { BreedingArea, BreedingAreaSchema } from '@/utils/schemas/breeding-area.schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '../ui/skeleton';
import { getFarms } from '@/services/farm.service';

export default function BreedingAreaForm() {
    const form = useForm<BreedingArea>({
        resolver: zodResolver(BreedingAreaSchema),
        defaultValues: {
            breedingAreaId: '',
            breedingAreaCode: '',
            breedingAreaName: '',
            mealsPerDay: 0,
            humidity: '',
            temperature: '',
            width: 0,
            image: '',
            notes: '',
            height: 0,
            covered: false,
            farmId: '',
            breedingPurpose: '',
        },
    });

    function onSubmit(values: BreedingArea) {
        console.log('Values :', values);
    }

    const { data: farms, isLoading } = useQuery({
        queryKey: ['farms'],
        queryFn: () => getFarms(),
    });

    const fields = [
        { name: 'breedingAreaCode', label: 'Mã khu nuôi', type: 'text' },
        { name: 'breedingAreaName', label: 'Tên khu nuôi', type: 'text' },
        { name: 'humidity', label: 'Độ ẩm (%)', type: 'text' },
        { name: 'temperature', label: 'Nhiệt độ (°C)', type: 'text' },
        { name: 'image', label: 'Đường dẫn hình ảnh', type: 'text' },
        { name: 'notes', label: 'Ghi chú', type: 'text' },
        { name: 'breedingPurpose', label: 'Mục đích chăn nuôi', type: 'text' },
        { name: 'mealsPerDay', label: 'Số bữa ăn mỗi ngày', type: 'number' },
        { name: 'width', label: 'Chiều rộng (m)', type: 'number' },
        { name: 'height', label: 'Chiều cao (m)', type: 'number' },
    ] as const;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="grid grid-cols-2 gap-6">
                    {fields.map(({ name, label, type }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type={type}
                                            placeholder={`Nhập ${label.toLowerCase()}`}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                    {/* FarmID */}
                    <FormField
                        control={form.control}
                        name="farmId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã trang trại</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trang trại" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {!farms || isLoading ? (
                                            <Skeleton />
                                        ) : (
                                            farms.map((farm) => (
                                                <SelectItem key={farm.farmId} value={farm.farmId}>
                                                    {farm.farmName}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Covered */}
                    <FormField
                        control={form.control}
                        name="covered"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel className="!mt-0">Khu vực có mái che</FormLabel>
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
