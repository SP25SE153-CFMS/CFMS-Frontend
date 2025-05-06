'use client';

import SubCateDisplay, { ResourceDisplay } from '@/components/badge/BadgeReceipt';
import InfoItem from '@/components/info-item';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getReceiptById } from '@/services/request.service';
import { getResources } from '@/services/resource.service';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { ArrowLeft, House, Info } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { getSuppliersByFarmId } from '@/services/supplier.service';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
    CreateStockReceiptSchema,
    type CreateStockReceipt,
} from '@/utils/schemas/stock-receipt.schema';
import { Button } from '@/components/ui/button';
import { getWareByFarmId, getWarestockResourceByFarm } from '@/services/warehouse.service';
import SelectCate from '@/components/select/category-select';
import SelectResources from '@/components/select/resources-select';

export default function CreateStockReceipt() {
    const router = useRouter();
    const farmId = getCookie('farmId') ?? '';
    const { inventoryReceiptId }: { inventoryReceiptId: string } = useParams();

    const { data: wares } = useQuery({
        queryKey: ['wares', farmId],
        queryFn: () => getWareByFarmId(farmId),
        enabled: !!farmId,
    });
    // console.log('Ware by farm: ', wares);

    const { data: resources } = useQuery({
        queryKey: ['resources'],
        queryFn: () => getWarestockResourceByFarm('all'),
    });

    // const { data: suppliers } = useQuery({
    //     queryKey: ['suppliers', farmId],
    //     queryFn: () => getSuppliersByFarmId(farmId),
    // });

    const form = useForm<CreateStockReceipt>({
        resolver: zodResolver(CreateStockReceiptSchema),
        defaultValues: {
            receiptTypeId: '',
            farmId: farmId,
            stockReceiptDetails: [
                {
                    quantity: 0,
                    unitId: null,
                    toWareId: '',
                    resourceId: '',
                    supplierId: '',
                },
            ],
        },
        mode: 'onChange',
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'stockReceiptDetails',
    });

    const onSubmit = (values: CreateStockReceipt) => {
        console.log('Form Submitted:', values);
        // TODO: Gọi API tạo phiếu nhập tại đây
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <div className="flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="hover:bg-slate-100"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                            Tạo đơn hàng nhập
                        </span>
                    </h1>
                </div>
            </div>
            <div className="flex items-center justify-end">
                <InfoItem
                    label="Trang trại"
                    value={
                        JSON.parse(sessionStorage.getItem('activeFarm') || '{}')?.farmName || '-'
                    }
                    icon={<House size={16} />}
                />
            </div>

            <Form {...form}>
                <form>
                    <div>
                        <div className="space-y-2">
                            <FormLabel>Chọn loại: </FormLabel>
                            <SelectCate
                                onSelect={(subCategoryId) => {
                                    // console.log('Selected subCategoryId:', subCategoryId);
                                    form.setValue('receiptTypeId', subCategoryId);
                                }}
                            />
                        </div>

                        {fields.map((field, index) => (
                            <div key={field.id}>
                                {/* Kho */}
                                <FormField
                                    control={form.control}
                                    name={`stockReceiptDetails.${index}.toWareId`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kho</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn kho" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {wares?.map((w) => (
                                                        <SelectItem key={w.wareId} value={w.wareId}>
                                                            {w.warehouseName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                {/* Resource */}
                                <FormField
                                    control={form.control}
                                    name={`stockReceiptDetails.${index}.resourceId`}
                                    render={({ field: resourceField }) => {
                                        const wareId = form.watch(
                                            `stockReceiptDetails.${index}.toWareId`,
                                        );
                                        const receiptTypeId = form.watch('receiptTypeId'); // từ SelectCate
                                        // console.log('Ware id truyền vào: ', wareId);
                                        // console.log('Receipt id truyền vào: ', receiptTypeId);
                                        return (
                                            <FormItem>
                                                <FormLabel>Tài nguyên</FormLabel>
                                                <SelectResources
                                                    wareId={wareId}
                                                    resourceTypeId={receiptTypeId}
                                                    onSelect={(resourceId) => {
                                                        // console.log('Resource Id: ', resourceId);
                                                        resourceField.onChange(resourceId);
                                                    }}
                                                />
                                            </FormItem>
                                        );
                                    }}
                                />
                                {/* Số lượng */}
                                <FormField
                                    control={form.control}
                                    name={`stockReceiptDetails.${index}.quantity`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Số lượng: </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    placeholder="Nhập số lượng..."
                                                    {...field}
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        field.onChange(
                                                            value === ''
                                                                ? undefined
                                                                : Number(value),
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {/* Unit */}

                                {/* Nhà cung cấp */}
                            </div>
                        ))}
                    </div>
                </form>
            </Form>
        </div>
    );
}
