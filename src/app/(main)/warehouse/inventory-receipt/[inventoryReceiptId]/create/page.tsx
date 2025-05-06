'use client';

import InfoItem from '@/components/info-item';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { ArrowLeft, CheckCircle2, HomeIcon as House, Plus, Trash2, XCircle } from 'lucide-react';
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
import { getWareByFarmId } from '@/services/warehouse.service';
import SelectCate from '@/components/select/category-select';
import SelectResources from '@/components/select/resources-select';
import { useState } from 'react';
import type { Supplier } from '@/utils/schemas/supplier.schema';
import { Skeleton } from '@/components/ui/skeleton';
import { onError } from '@/utils/functions/form.function';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CreateStockReceipt() {
    const router = useRouter();
    const farmId = getCookie('farmId') ?? '';
    const [unitLabels, setUnitLabels] = useState<Record<number, string | null>>({});
    const [supplierOptionsMap, setSupplierOptionsMap] = useState<Record<number, Supplier[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: wares, isLoading: waresLoading } = useQuery({
        queryKey: ['wares', farmId],
        queryFn: () => getWareByFarmId(farmId),
        enabled: !!farmId,
    });

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

    const farmName = JSON.parse(sessionStorage.getItem('activeFarm') || '{}')?.farmName || '-';

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-5xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="hover:bg-slate-100 rounded-full"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                        <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                            Tạo đơn hàng nhập
                        </span>
                    </h1>
                </div>
                <div className="flex items-center">
                    <InfoItem
                        label="Trang trại"
                        value={farmName}
                        icon={<House size={16} className="text-emerald-600" />}
                        className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 shadow-sm"
                    />
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-medium text-slate-700">
                                Thông tin đơn hàng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 mb-6">
                                <FormLabel className="text-slate-700">Chọn loại: </FormLabel>
                                <SelectCate
                                    onSelect={(subCategoryId) => {
                                        form.setValue('receiptTypeId', subCategoryId);
                                    }}
                                />
                            </div>

                            <div className="space-y-8">
                                {fields.map((field, index) => (
                                    <Card
                                        key={field.id}
                                        className="border border-slate-200 shadow-sm overflow-hidden"
                                    >
                                        <CardHeader className="bg-slate-50 py-3 px-4 flex flex-row items-center justify-between">
                                            <CardTitle className="text-sm font-medium text-slate-700 flex items-center">
                                                <Badge variant="outline" className="mr-2 bg-white">
                                                    {index + 1}
                                                </Badge>
                                                Chi tiết sản phẩm
                                            </CardTitle>
                                            {fields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                    className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </CardHeader>
                                        <CardContent className="p-4 grid gap-4 md:grid-cols-2">
                                            {/* Kho */}
                                            <FormField
                                                control={form.control}
                                                name={`stockReceiptDetails.${index}.toWareId`}
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="text-slate-700">
                                                            Kho
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                        >
                                                            <SelectTrigger className="h-10 border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                                                                <SelectValue
                                                                    placeholder={
                                                                        waresLoading
                                                                            ? 'Đang tải...'
                                                                            : 'Chọn kho'
                                                                    }
                                                                />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {waresLoading ? (
                                                                    <div className="p-2">
                                                                        <Skeleton className="h-5 w-full" />
                                                                        <Skeleton className="h-5 w-full mt-2" />
                                                                    </div>
                                                                ) : wares?.length ? (
                                                                    wares.map((w) => (
                                                                        <SelectItem
                                                                            key={w.wareId}
                                                                            value={w.wareId}
                                                                        >
                                                                            {w.warehouseName}
                                                                        </SelectItem>
                                                                    ))
                                                                ) : (
                                                                    <div className="p-2 text-center text-sm text-slate-500">
                                                                        Không có kho nào
                                                                    </div>
                                                                )}
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
                                                    const receiptTypeId =
                                                        form.watch('receiptTypeId');

                                                    return (
                                                        <FormItem className="space-y-2">
                                                            <FormLabel className="text-slate-700">
                                                                Tài nguyên
                                                            </FormLabel>
                                                            <SelectResources
                                                                wareId={wareId}
                                                                resourceTypeId={receiptTypeId}
                                                                onSelect={(resourceId) => {
                                                                    resourceField.onChange(
                                                                        resourceId,
                                                                    );
                                                                    form.setValue(
                                                                        `stockReceiptDetails.${index}.supplierId`,
                                                                        '',
                                                                    );
                                                                }}
                                                                onUnitChange={(unit) => {
                                                                    setUnitLabels((prev) => ({
                                                                        ...prev,
                                                                        [index]: unit,
                                                                    }));
                                                                }}
                                                                onSupplierOptionsChange={(
                                                                    suppliers,
                                                                ) => {
                                                                    setSupplierOptionsMap(
                                                                        (prev) => ({
                                                                            ...prev,
                                                                            [index]: suppliers,
                                                                        }),
                                                                    );
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
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="text-slate-700">
                                                            Số lượng
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                placeholder="Nhập số lượng..."
                                                                className="h-10 border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                                                                {...field}
                                                                value={
                                                                    field.value === 0
                                                                        ? ''
                                                                        : field.value
                                                                }
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    field.onChange(
                                                                        value === ''
                                                                            ? 0
                                                                            : Number(value),
                                                                    );
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Unit */}
                                            <div className="space-y-2">
                                                <FormLabel className="text-slate-700">
                                                    Đơn vị
                                                </FormLabel>
                                                <div className="h-10 px-3 flex items-center border rounded-md border-slate-300 bg-slate-50 text-slate-600">
                                                    {unitLabels[index] ? (
                                                        unitLabels[index]
                                                    ) : (
                                                        <span className="text-slate-400 text-sm">
                                                            Chưa có đơn vị
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Nhà cung cấp */}
                                            <div className="md:col-span-2">
                                                <FormItem className="space-y-2">
                                                    <FormLabel className="text-slate-700">
                                                        Nhà cung cấp
                                                    </FormLabel>
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
                                                        <SelectTrigger className="h-10 border-slate-300 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                                                            <SelectValue placeholder="Chọn nhà cung cấp..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {supplierOptionsMap[index]?.length ? (
                                                                supplierOptionsMap[index]?.map(
                                                                    (s) => (
                                                                        <SelectItem
                                                                            key={s.supplierId}
                                                                            value={s.supplierId}
                                                                        >
                                                                            {s.supplierName}
                                                                        </SelectItem>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <div className="p-2 text-center text-sm text-slate-500">
                                                                    Không có nhà cung cấp nào
                                                                </div>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        append({
                                            quantity: 0,
                                            unitId: null,
                                            toWareId: '',
                                            resourceId: '',
                                            supplierId: '',
                                        })
                                    }
                                    className="w-full border-dashed border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Thêm sản phẩm
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="sticky bottom-0 bg-white p-4 border-t border-slate-200 rounded-b-lg shadow-lg flex justify-end gap-4 z-10">
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
                            className="bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white"
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
