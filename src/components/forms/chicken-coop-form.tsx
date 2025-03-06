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
import { ChickenCoop, ChickenCoopSchema } from '@/utils/schemas/chicken-coop.schema';
import { breedingAreas } from '@/utils/data/table.data';
import { BreedingArea } from '@/utils/schemas/breeding-area.schema';

export default function ChickenCoopForm() {
    const form = useForm<ChickenCoop>({
        resolver: zodResolver(ChickenCoopSchema),
        defaultValues: {
            chickenCoopCode: '',
            chickenCoopName: '',
            capacity: 0,
            location: '',
            status: 'AVAILABLE',
            breedingAreaId: '',
            createdAt: new Date().toISOString(),
            updatedAt: null,
        },
    });

    function onSubmit(values: ChickenCoop) {
        console.log('Dữ liệu gửi:', values);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
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
                                <Input type="number" placeholder="Nhập sức chứa" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Vị trí */}
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vị trí</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Nhập vị trí" {...field} />
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AVAILABLE">Sẵn sàng</SelectItem>
                                        <SelectItem value="OCCUPIED">Đang sử dụng</SelectItem>
                                        <SelectItem value="UNDER_MAINTENANCE">Bảo trì</SelectItem>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                <Button type="submit">Gửi</Button>
            </form>
        </Form>
    );
}
