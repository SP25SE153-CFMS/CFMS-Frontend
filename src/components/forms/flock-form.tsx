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
import { Flock, FlockSchema } from '@/utils/schemas/flock.schema';

export default function FlockForm() {
    const form = useForm<Flock>({
        resolver: zodResolver(FlockSchema),
        defaultValues: {
            flockId: '',
            quantity: 0,
            name: '',
            startDate: new Date().toISOString(),
            status: 'in_farm',
            description: '',
            endDate: null,
            avgWeight: 0,
            mortalityRate: 0,
            lastHealthCheck: null,
            gender: 'mixed',
            purposeId: 1,
            breedId: 1,
            housingId: 1,
        },
    });

    function onSubmit(values: Flock) {
        console.log('Dữ liệu gửi:', values);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Tên đàn */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên đàn</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Nhập tên đàn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Số lượng */}
                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Số lượng</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Nhập số lượng" {...field} />
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
                                        <SelectItem value="in_farm">Trong trang trại</SelectItem>
                                        <SelectItem value="sold">Đã bán</SelectItem>
                                        <SelectItem value="removed">Đã loại bỏ</SelectItem>
                                        <SelectItem value="dead">Đã chết</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Trọng lượng trung bình */}
                <FormField
                    control={form.control}
                    name="avgWeight"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Trọng lượng trung bình (kg)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Nhập trọng lượng trung bình"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Tỷ lệ tử vong */}
                <FormField
                    control={form.control}
                    name="mortalityRate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tỷ lệ tử vong (%)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Nhập tỷ lệ tử vong" {...field} />
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
