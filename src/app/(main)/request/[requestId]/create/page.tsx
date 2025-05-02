'use client';

import SubCateDisplay from '@/components/badge/BadgeReceipt';
import ResourceCard from '@/components/card/resource-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getSubBySubId } from '@/services/category.service';
import { getRequestById } from '@/services/request.service';
import { formatDate } from '@/utils/functions';
import {
    type CreateInventoryReceipt,
    CreateInventoryReceiptSchema,
} from '@/utils/schemas/inventory-receipt.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {
    AlertCircle,
    ArrowLeft,
    ArrowDownToLine,
    ArrowUpFromLine,
    Calendar,
    Clipboard,
    Info,
    NotebookTextIcon as NoteText,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';

export default function RequestDetail() {
    const router = useRouter();
    const { requestId }: { requestId: string } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: requestDetail, isLoading: isLoadingRequest } = useQuery({
        queryKey: ['requestDetail', requestId],
        queryFn: () => getRequestById(requestId),
    });

    const { data: subCate, isLoading: isLoadingSubCate } = useQuery({
        queryKey: ['subCate', requestDetail?.requestTypeId],
        queryFn: () => getSubBySubId(requestDetail?.requestTypeId as string),
        enabled: !!requestDetail?.requestTypeId,
    });

    const subCategoryName = subCate?.subCategoryName;
    const receiptType = requestDetail?.requestTypeId;

    const form = useForm<CreateInventoryReceipt>({
        resolver: zodResolver(CreateInventoryReceiptSchema),
        defaultValues: {
            requestId: requestId,
            inventoryRequestId: '',
            wareFromId: '',
            wareToId: '',
            receiptTypeId: receiptType,
            batchNumber: 0,
            receiptDetails:
                requestDetail?.inventoryRequests[0]?.inventoryRequestDetails.map((d) => ({
                    resourceId: d.resourceId,
                    actualQuantity: 0,
                    unitId: d.unitId || '',
                    note: '',
                })) || [],
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if (requestDetail && requestDetail.inventoryRequests.length > 0) {
            const request = requestDetail.inventoryRequests[0];
            if (subCategoryName === 'IMPORT' && request.wareToId) {
                form.setValue('wareToId', request.wareToId);
            } else if (subCategoryName === 'EXPORT' && request.wareFromId) {
                form.setValue('wareFromId', request.wareFromId);
            }
        }
    }, [requestDetail, subCategoryName, form]);

    const onSubmit = (data: CreateInventoryReceipt) => {
        setIsSubmitting(true);
        console.log('Form data:', data);
        // Here you would submit the data to your API
        setTimeout(() => {
            setIsSubmitting(false);
            // Show success message or redirect
        }, 1500);
    };

    if (isLoadingRequest || isLoadingSubCate) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-64" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-32 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!requestDetail) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-4">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                        <h3 className="text-lg font-medium">Không tìm thấy thông tin phiếu</h3>
                        <p className="text-muted-foreground">
                            Phiếu yêu cầu không tồn tại hoặc đã bị xóa
                        </p>
                        <Button variant="outline" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const getReceiptIcon = () => {
        if (subCategoryName === 'IMPORT') return <Clipboard className="h-5 w-5 text-green-600" />;
        if (subCategoryName === 'EXPORT') return <Clipboard className="h-5 w-5 text-amber-600" />;
        return <Clipboard className="h-5 w-5 text-blue-600" />;
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        {getReceiptIcon()}
                        Tạo phiếu <span>{subCate?.description?.toLowerCase()}</span>
                    </h1>
                </div>
                {/* <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(requestDetail.createdDate)}</span>
                </Badge> */}
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {requestDetail.inventoryRequests.map((request) => (
                        <div key={request.requestId} className="space-y-6">
                            {(subCategoryName === 'IMPORT' || subCategoryName === 'EXPORT') && (
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Info className="h-5 w-5 text-blue-500" />
                                            {subCategoryName === 'IMPORT'
                                                ? 'Thông tin phiếu nhập'
                                                : 'Thông tin phiếu xuất'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-5 p-5">
                                        {/* Request Type Section */}
                                        <div className="rounded-lg bg-white p-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">
                                                    Loại phiếu:
                                                </span>
                                                <SubCateDisplay
                                                    id={requestDetail.requestTypeId}
                                                    mode="badge"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-3">
                                            <FormField
                                                control={form.control}
                                                name={
                                                    subCategoryName === 'IMPORT'
                                                        ? 'wareToId'
                                                        : 'wareFromId'
                                                }
                                                render={({ field }) => (
                                                    <>
                                                        {/* Ẩn input id để submit */}
                                                        <input type="hidden" {...field} />
                                                        {/* Hiển thị tên kho */}
                                                        <FormLabel className="text-sm font-medium text-gray-700 m-0">
                                                            {subCategoryName === 'IMPORT'
                                                                ? 'Kho nhập:'
                                                                : 'Kho xuất:'}
                                                        </FormLabel>
                                                        <Input
                                                            value={
                                                                subCategoryName === 'IMPORT'
                                                                    ? request.wareTo
                                                                          ?.warehouseName || ''
                                                                    : request.wareFrom
                                                                          ?.warehouseName || ''
                                                            }
                                                            readOnly
                                                            className="w-64 rounded-md border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 focus:border-gray-300 focus:ring-0"
                                                            tabIndex={-1}
                                                        />
                                                    </>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="inventoryRequestId"
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="hidden"
                                                    value={request.inventoryRequestId}
                                                />
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            )}

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Clipboard className="h-5 w-5 text-blue-600" />
                                    Chi tiết phiếu
                                </h2>

                                {request.inventoryRequestDetails.map((detail, index) => (
                                    <Card
                                        key={detail.inventoryRequestDetailId}
                                        className="overflow-hidden"
                                    >
                                        <CardHeader className="bg-muted/50 pb-2">
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <span>Sản phẩm {index + 1}</span>
                                                </CardTitle>
                                                <Badge
                                                    variant="outline"
                                                    className="bg-blue-50 text-blue-700"
                                                >
                                                    Số lượng yêu cầu: {detail.expectedQuantity}
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-4">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <ResourceCard resourceId={detail.resourceId} />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name={`receiptDetails.${index}.actualQuantity`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Số lượng thực tế
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            min={0}
                                                                            {...field}
                                                                            placeholder="Nhập số lượng"
                                                                            className="focus:ring-2 focus:ring-blue-500"
                                                                            value={field.value}
                                                                            onChange={(e) => {
                                                                                const value =
                                                                                    e.target.value;
                                                                                field.onChange(
                                                                                    value === ''
                                                                                        ? undefined
                                                                                        : Number(
                                                                                              value,
                                                                                          ),
                                                                                );
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormItem>
                                                            <FormLabel>Đơn vị</FormLabel>
                                                            <SubCateDisplay
                                                                id={detail.unitId}
                                                                mode="input"
                                                            />
                                                        </FormItem>
                                                    </div>

                                                    <FormField
                                                        control={form.control}
                                                        name={`receiptDetails.${index}.note`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="flex items-center gap-1">
                                                                    <NoteText className="h-4 w-4" />
                                                                    Ghi chú
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Nhập ghi chú nếu có"
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}

                    <Separator />

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Skeleton className="h-4 w-4 rounded-full mr-2" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Lưu phiếu
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
