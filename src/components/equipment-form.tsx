'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { EquipmentSchema } from '@/utils/schemas/equipment.schema';

export default function EquipmentForm() {
    const form = useForm<z.infer<typeof EquipmentSchema>>({
        resolver: zodResolver(EquipmentSchema),
        defaultValues: {
            equipmentId: '',
            equipmentCode: '',
            equipmentName: '',
            purchaseDate: new Date().toISOString(),
            warrantyPeriod: 12,
            status: 'AVAILABLE',
            cost: 0,
            quantity: 1,
            createdAt: new Date().toISOString(),
            updatedAt: null,
        },
    });

    function onSubmit(values: z.infer<typeof EquipmentSchema>) {
        console.log('Dữ liệu gửi:', values);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Mã thiết bị */}
                <FormField
                    control={form.control}
                    name="equipmentCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mã thiết bị</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Nhập mã thiết bị" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Tên thiết bị */}
                <FormField
                    control={form.control}
                    name="equipmentName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên thiết bị</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Nhập tên thiết bị" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Ngày mua */}
                <FormField
                    control={form.control}
                    name="purchaseDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ngày mua</FormLabel>
                            <FormControl>
                                <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Thời gian bảo hành */}
                <FormField
                    control={form.control}
                    name="warrantyPeriod"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Thời gian bảo hành (tháng)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Nhập số tháng" {...field} />
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
                                        <SelectItem value="IN_USE">Đang sử dụng</SelectItem>
                                        <SelectItem value="BROKEN">Hỏng</SelectItem>
                                        <SelectItem value="AVAILABLE">Sẵn sàng</SelectItem>
                                        <SelectItem value="UNDER_MAINTENANCE">Bảo trì</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Chi phí */}
                <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Chi phí</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Nhập chi phí" {...field} />
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

                <Button type="submit">Gửi</Button>
            </form>
        </Form>
    );
}
