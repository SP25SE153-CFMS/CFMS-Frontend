'use client';

import { WarehouseProduct, WarehouseProductSchema } from '@/utils/schemas/warehouse-product.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue } from '../ui/select';

export default function WarehouseProductForm() {
    const form = useForm<WarehouseProduct>({
        resolver: zodResolver(WarehouseProductSchema),
        defaultValues: {
            productId: '',
            productCode: '',
            productName: '',
            area: '',
            quantity: 0,
            unit: '',
            expiry: '',
            supplier: '',
        },
    });

    const fields = [
        { name: 'productCode', label: 'Mã hàng', type: 'text' },
        { name: 'productName', label: 'Tên hàng', type: 'text' },
        { name: 'area', label: 'Khu vực', type: 'text' },
        { name: 'quantity', label: 'Số lượng', type: 'number' },
        { name: 'unit', label: 'Đơn vị', type: 'select', options: ['Kg', 'Bao'] },
        { name: 'expiry', label: 'Hạn sử dụng', type: 'date' },
        { name: 'supplier', label: 'Nhà cung cấp', type: 'text' },
    ] as const;

    return (
        <Form {...form}>
            <form>
                <div>
                    {fields.map(({ name, label, type }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name}
                            render={(field) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        {type === 'select' ? (
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn đơn vị" />
                                                </SelectTrigger>
                                            </Select>
                                        ) : (
                                            <Input
                                                type={type}
                                                placeholder={`Nhập ${label}`}
                                                {...field}
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                </div>
            </form>
        </Form>
    );
}
