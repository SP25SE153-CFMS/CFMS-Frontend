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

    const fields = [
        { name: 'breedingAreaId', label: 'Mã khu vực chăn nuôi', type: 'text' },
        { name: 'breedingAreaCode', label: 'Mã số khu vực', type: 'text' },
        { name: 'breedingAreaName', label: 'Tên khu vực chăn nuôi', type: 'text' },
        { name: 'humidity', label: 'Độ ẩm (%)', type: 'text' },
        { name: 'temperature', label: 'Nhiệt độ (°C)', type: 'text' },
        { name: 'image', label: 'Đường dẫn hình ảnh', type: 'text' },
        { name: 'notes', label: 'Ghi chú', type: 'text' },
        { name: 'farmId', label: 'Mã trang trại', type: 'text' },
        { name: 'breedingPurpose', label: 'Mục đích chăn nuôi', type: 'text' },
        { name: 'mealsPerDay', label: 'Số bữa ăn mỗi ngày', type: 'number' },
        { name: 'width', label: 'Chiều rộng (m)', type: 'number' },
        { name: 'height', label: 'Chiều cao (m)', type: 'number' },
    ] as const;

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
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

                <FormField
                    control={form.control}
                    name="covered"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel>Khu vực có mái che</FormLabel>
                        </FormItem>
                    )}
                />

                <Button type="submit">Gửi</Button>
            </form>
        </Form>
    );
}
