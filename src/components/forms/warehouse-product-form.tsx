'use client';

import {
    CreateProductSchema,
    WarehouseProduct,
    WarehouseProductSchema,
} from '@/utils/schemas/warehouse-product.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { createProduct, updateProduct } from '@/services/warehouse-product.service';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';

interface WarehouseProductFormProps {
    defaultValues?: Partial<WarehouseProduct>;
    closeModal: () => void;
}
export default function WarehouseProductForm({
    defaultValues,
    closeModal,
}: WarehouseProductFormProps) {
    const form = useForm<WarehouseProduct>({
        resolver: zodResolver(defaultValues ? WarehouseProductSchema : CreateProductSchema),
        defaultValues: {
            productCode: '',
            productName: '',
            area: '',
            quantity: 0,
            unit: '',
            expiry: '',
            supplier: '',
            dateToImport: new Date().toISOString(),
            ...defaultValues,
        },
        mode: 'onChange',
    });

    // Error
    const onError = (error: any) => {
        console.log('Lỗi form:', error);
    };

    // Submit
    const onSubmit = async (values: WarehouseProduct) => {
        try {
            const dataToSubmit = {
                ...values,
                dateToImport: new Date().toISOString(),
            };
            if (defaultValues) {
                await updateProduct(dataToSubmit);
                toast.success("Cập nhật sản phẩm thành công")
            } else {
                await createProduct(dataToSubmit);
                toast.success('Tạo sản phẩm thành công');
            }
            closeModal();
        } catch (error) {
            console.log(error);
        }
    };

    const fields = [
        { name: 'productCode', label: 'Mã hàng', type: 'text' },
        { name: 'productName', label: 'Tên hàng', type: 'text' },
        { name: 'area', label: 'Khu vực', type: 'text' },
        { name: 'quantity', label: 'Số lượng', type: 'number' },
        { name: 'unit', label: 'Đơn vị', type: 'text' },
        { name: 'expiry', label: 'Hạn sử dụng', type: 'date' },
        { name: 'supplier', label: 'Nhà cung cấp', type: 'text' },
    ] as const;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {fields.map(({ name, label, type }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        {type === 'number' ? (
                                            <Input
                                                type="number"
                                                min={1} // Không được nhập số âm ở UI
                                                placeholder={`Nhập ${label.toLowerCase()}`}
                                                {...field}
                                            />
                                        ) : (
                                            <Input
                                                type={type}
                                                placeholder={`Nhập ${label.toLowerCase()}`}
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

                <Button type="submit" className="ml-auto mt-6 w-40 flex">
                    Tạo
                </Button>
            </form>
        </Form>
    );
}
