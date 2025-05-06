'use client';

import InfoItem from '@/components/info-item';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { ArrowLeft, CheckCircle2, House, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    CreateStockReceiptSchema,
    type CreateStockReceipt,
} from '@/utils/schemas/stock-receipt.schema';
import { Button } from '@/components/ui/button';
import { getWareByFarmId, getWarestockResourceByFarm } from '@/services/warehouse.service';
import SelectCate from '@/components/select/category-select';
import SelectResources from '@/components/select/resources-select';
import { useState } from 'react';
import { Supplier } from '@/utils/schemas/supplier.schema';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { onError } from '@/utils/functions/form.function';

export default function CreateStockReceipt() {
    const router = useRouter();
    const farmId = getCookie('farmId') ?? '';
    const [unitLabels, setUnitLabels] = useState<Record<number, string | null>>({});
    const [supplierOptionsMap, setSupplierOptionsMap] = useState<Record<number, Supplier[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: wares } = useQuery({
        queryKey: ['wares', farmId],
        queryFn: () => getWareByFarmId(farmId),
        enabled: !!farmId,
    });
    // console.log('Ware by farm: ', wares);

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
        setIsSubmitting(false);
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
                <form onSubmit={form.handleSubmit(onSubmit, onError)}>
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
                                                        // Reset lại supplier khi chọn lại resource mới
                                                        form.setValue(
                                                            `stockReceiptDetails.${index}.supplierId`,
                                                            '',
                                                        );
                                                    }}
                                                    onUnitChange={(unit) => {
                                                        setUnitLabels((prev) => ({
                                                            ...prev,
                                                            [index]: unit,
                                                        })); // chỉ hiển thị đơn vị
                                                    }}
                                                    onSupplierOptionsChange={(suppliers) => {
                                                        setSupplierOptionsMap((prev) => ({
                                                            ...prev,
                                                            [index]: suppliers,
                                                        }));
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
                                <div>
                                    <FormLabel>Đơn vị: </FormLabel>
                                    {unitLabels[index] ? unitLabels[index] : ''}
                                </div>
                                {/* Nhà cung cấp */}
                                <FormItem>
                                    <FormLabel>Nhà cung cấp:</FormLabel>
                                    <Select
                                        onValueChange={(val) => {
                                            form.setValue(
                                                `stockReceiptDetails.${index}.supplierId`,
                                                val,
                                            );
                                        }}
                                        value={form.watch(
                                            `stockReceiptDetails.${index}.supplierId`,
                                        )}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn nhà cung cấp..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {supplierOptionsMap[index]?.map((s) => (
                                                <SelectItem key={s.supplierId} value={s.supplierId}>
                                                    {s.supplierName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            </div>
                        ))}
                    </div>

                    <Separator className="my-8" />

                    <div className="flex justify-end gap-4  bottom-0 bg-white p-4 rounded-b-lg shadow-lg">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                            className="border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                        >
                            <XCircle className="mr-2 h-4 w-4 text-slate-600" />
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800"
                        >
                            {isSubmitting ? (
                                <>
                                    <Skeleton className="h-4 w-4 rounded-full mr-2" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Tạo đơn
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
