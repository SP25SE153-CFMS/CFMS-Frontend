'use client';

import SubCateDisplay, { ResourceDisplay } from '@/components/badge/BadgeReceipt';
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
import {
    createInvetoryReceiptFromRequest,
    getReceipts,
    getRequestById,
} from '@/services/request.service';
import {
    type CreateInventoryReceipt,
    CreateInventoryReceiptSchema,
} from '@/utils/schemas/inventory-receipt.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    AlertCircle,
    ArrowLeft,
    ArrowDownToLine,
    ArrowUpFromLine,
    Clipboard,
    Info,
    NotebookTextIcon as NoteText,
    CheckCircle2,
    XCircle,
    Layers,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { onError } from '@/utils/functions/form.function';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function RequestDetail() {
    const router = useRouter();
    const { requestId }: { requestId: string } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showBatchList, setShowBatchList] = useState(false);

    const { data: requestDetail, isLoading: isLoadingRequest } = useQuery({
        queryKey: ['requestDetail', requestId],
        queryFn: () => getRequestById(requestId),
    });

    const { data: receipts, isLoading: isLoadingReceipts } = useQuery({
        queryKey: ['receipts'],
        queryFn: () => getReceipts(),
    });
    console.log('Receipts:', receipts);

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
        if (requestDetail && subCate) {
            const request = requestDetail.inventoryRequests[0];
            form.reset({
                requestId: requestId,
                inventoryRequestId: request?.inventoryRequestId || '',
                wareFromId:
                    subCate.subCategoryName === 'EXPORT'
                        ? (request?.wareFromId ?? undefined)
                        : undefined,

                wareToId:
                    subCate.subCategoryName === 'IMPORT'
                        ? (request?.wareToId ?? undefined)
                        : undefined,

                receiptTypeId: requestDetail.requestTypeId,
                batchNumber: (request.inventoryReceipts.length || 0) + 1,
                receiptDetails:
                    request?.inventoryRequestDetails.map((d) => ({
                        resourceId: d.resourceId,
                        actualQuantity: 0,
                        unitId: d.unitId || '',
                        note: '',
                    })) || [],
            });
        }
    }, [requestDetail, subCate]);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createInvetoryReceiptFromRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requestDetail'] });
            queryClient.invalidateQueries({ queryKey: ['receipts'] });
            toast.success('Tạo phiếu thành công.');
        },
        onError: (error: any) => {
            console.log('Form errors:', error);
        },
    });

    // const handleBatchNumberList = () => {
    //     setShowBatchList(!showBatchList);
    //     const receiptId = receipts?.filter((r) => r.inventoryReceiptId) || [];
    //     console.log(receiptId);
    // }

    const onSubmit = async (data: CreateInventoryReceipt) => {
        const requestDetails = requestDetail?.inventoryRequests[0].inventoryRequestDetails;

        // Kiểm tra actualQuantity không vượt quá expectedQuantity
        const hasInvalidQuantity = data.receiptDetails.some((detail) => {
            const expected =
                requestDetails?.find((d) => d.resourceId === detail.resourceId)?.expectedQuantity ||
                0;
            return detail.actualQuantity > expected;
        });

        if (hasInvalidQuantity) {
            toast.error('Số lượng thực tế không được vượt quá số lượng yêu cầu');
            return;
        }

        setIsSubmitting(true);

        // Làm sạch payload
        const cleanPayload: CreateInventoryReceipt = {
            ...data,
            wareFromId: data.wareFromId || undefined,
            wareToId: data.wareToId || undefined,
            receiptDetails: data.receiptDetails.map((d) => ({
                ...d,
                note: d.note?.trim() || '',
            })),
        };

        await mutation.mutateAsync(cleanPayload);
        setIsSubmitting(false);
    };

    if (isLoadingReceipts) {
        return (
            <div className="flex flex-col items-center justify-center h-[75vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

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
        if (subCategoryName === 'IMPORT')
            return <ArrowDownToLine className="h-5 w-5 text-emerald-600" />;
        if (subCategoryName === 'EXPORT')
            return <ArrowUpFromLine className="h-5 w-5 text-amber-600" />;
        return <Clipboard className="h-5 w-5 text-sky-600" />;
    };

    return (
        <div className="container mx-auto p-6 space-y-6 max-w-5xl">
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
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
                        {getReceiptIcon()}
                        <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                            Tạo phiếu {subCate?.description?.toLowerCase()}
                        </span>
                    </h1>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
                    {requestDetail.inventoryRequests.map((request) => {
                        const matchedReceipt =
                            receipts?.filter(
                                (r) => r.inventoryRequestId === request.inventoryRequestId,
                            ) || [];

                        return (
                            <div key={request.requestId} className="space-y-6">
                                {(subCategoryName === 'IMPORT' || subCategoryName === 'EXPORT') && (
                                    <Card className="shadow-sm border-slate-200 overflow-hidden">
                                        <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-white border-b">
                                            <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                                                <Info className="h-5 w-5 text-sky-500" />
                                                {subCategoryName === 'IMPORT'
                                                    ? 'Thông tin phiếu nhập'
                                                    : 'Thông tin phiếu xuất'}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-5 p-5">
                                            {/* Request Type Section */}
                                            <div className="rounded-lg p-4 border border-slate-100">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-slate-700">
                                                        Loại phiếu:
                                                    </span>
                                                    <SubCateDisplay
                                                        id={requestDetail.requestTypeId}
                                                        mode="title"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-100">
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
                                                            <input
                                                                type="hidden"
                                                                {...field}
                                                                value={field.value ?? ''}
                                                            />
                                                            {/* Hiển thị tên kho */}
                                                            <FormLabel className="text-sm font-medium text-slate-700 m-0">
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
                                                                className="w-64 rounded-md border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 focus:border-slate-300 focus:ring-0"
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

                                {/* Danh sách số lô */}
                                <div className="space-y-4">
                                    <div
                                        className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-lg px-4 py-3 cursor-pointer hover:text-sky-600 transition-colors shadow-sm"
                                        onClick={() => setShowBatchList(!showBatchList)}
                                    >
                                        <Layers className="h-5 w-5 text-slate-600" />
                                        <h3 className="font-medium">
                                            Danh sách số lô ({request.inventoryReceipts.length})
                                        </h3>
                                        {showBatchList ? (
                                            <ChevronUp className="h-4 w-4 ml-auto" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 ml-auto" />
                                        )}
                                    </div>

                                    {showBatchList && (
                                        <div className="space-y-4 border rounded-lg p-5 bg-white shadow-sm">
                                            {request.inventoryReceipts.length > 0 ? (
                                                <div className="space-y-4">
                                                    {matchedReceipt.map((receipt) => {
                                                        const matchedId =
                                                            request.inventoryReceipts.find(
                                                                (r) =>
                                                                    r.inventoryReceiptId ===
                                                                    receipt.inventoryReceiptId,
                                                            );
                                                        const matchedCode =
                                                            matchedId?.receiptCodeNumber;
                                                        console.log('Code: ', matchedCode);
                                                        return (
                                                            <div
                                                                key={receipt.inventoryReceiptId}
                                                                className="border-b pb-4 last:border-b-0 last:pb-0"
                                                            >
                                                                <p className="font-medium text-sky-600 flex items-center gap-2">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="bg-sky-50 text-sky-600 border-sky-200 px-3 py-1"
                                                                    >
                                                                        Số lô: {receipt.batchNumber}
                                                                    </Badge>
                                                                    <p>{matchedCode}</p>
                                                                </p>

                                                                <div className="pl-4 mt-3 space-y-2">
                                                                    {receipt.inventoryReceiptDetails.map(
                                                                        (receiptD) => {
                                                                            return (
                                                                                <div
                                                                                    key={
                                                                                        receiptD.inventoryReceiptDetailId
                                                                                    }
                                                                                    className="text-sm bg-slate-50 rounded-lg p-3 border border-slate-100"
                                                                                >
                                                                                    <ResourceDisplay
                                                                                        id={
                                                                                            receiptD.resourceId
                                                                                        }
                                                                                    />

                                                                                    <p className="flex justify-between mb-1">
                                                                                        <span className="text-slate-600">
                                                                                            Số
                                                                                            lượng:
                                                                                        </span>
                                                                                        <span className="font-medium text-slate-800">
                                                                                            {
                                                                                                receiptD.actualQuantity
                                                                                            }
                                                                                        </span>
                                                                                    </p>
                                                                                    <p className="flex justify-between mb-1">
                                                                                        <span className="text-slate-600">
                                                                                            Ngày
                                                                                            nhập:
                                                                                        </span>
                                                                                        <span className="font-medium text-slate-800">
                                                                                            {dayjs(
                                                                                                receiptD.actualDate,
                                                                                            ).format(
                                                                                                'DD/MM/YYYY',
                                                                                            )}
                                                                                        </span>
                                                                                    </p>
                                                                                    <p className="flex justify-between">
                                                                                        <span className="text-slate-600">
                                                                                            Ghi chú:
                                                                                        </span>
                                                                                        <span className="font-medium text-slate-800">
                                                                                            {receiptD.note ||
                                                                                                'Không có ghi chú'}
                                                                                        </span>
                                                                                    </p>
                                                                                </div>
                                                                            );
                                                                        },
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-slate-500 italic text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                                    <p>Chưa có lô hàng nào.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Chi tiết phiếu */}

                                {request.inventoryRequestDetails.map((detail, index) => {
                                    const totalActualQuantity = matchedReceipt
                                        .flatMap((receipt) => receipt.inventoryReceiptDetails)
                                        .filter((d) => d.resourceId === detail.resourceId)
                                        .reduce((sum, d) => sum + d.actualQuantity, 0);

                                    const isDisabled =
                                        totalActualQuantity >= detail.expectedQuantity;
                                    return (
                                        <div
                                            className="space-y-4"
                                            key={detail.inventoryRequestDetailId}
                                        >
                                            <h2 className="text-xl font-semibold flex items-center gap-2 px-1 py-2 border-b border-slate-200">
                                                <Clipboard className="h-5 w-5 text-sky-600" />
                                                Chi tiết phiếu
                                            </h2>

                                            <Card className="overflow-hidden shadow-sm border-slate-200 hover:shadow-md transition-shadow duration-300">
                                                <CardHeader className="bg-gradient-to-r from-slate-50 to-white pb-2 border-b">
                                                    <div className="flex justify-between items-center">
                                                        <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                                                            <span>Sản phẩm {index + 1}</span>
                                                        </CardTitle>
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-sky-50 text-sky-700 border-sky-200 px-3 py-1"
                                                        >
                                                            Số lượng yêu cầu:{' '}
                                                            {detail.expectedQuantity}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>

                                                <CardContent className="pt-5">
                                                    <div className="grid grid-cols-2 gap-6">
                                                        {/* Left Column - Product Info */}
                                                        <div className="space-y-4 ">
                                                            <ResourceCard
                                                                resourceId={detail.resourceId}
                                                            />
                                                        </div>
                                                        {/* Right Column - Inputs */}
                                                        <div className="space-y-4 ">
                                                            <div className="rounded-xl border bg-card text-card-foreground shadow p-6 h-full">
                                                                <div className="grid grid-cols-2 gap-4 pb-2">
                                                                    <FormField
                                                                        control={form.control}
                                                                        name={`receiptDetails.${index}.actualQuantity`}
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel className="text-slate-700">
                                                                                    Số lượng thực tế
                                                                                </FormLabel>
                                                                                <FormControl>
                                                                                    <Input
                                                                                        type="number"
                                                                                        min={0}
                                                                                        {...field}
                                                                                        placeholder="Nhập số lượng"
                                                                                        className="focus:ring-2 focus:ring-sky-500 border-slate-300"
                                                                                        value={
                                                                                            field.value
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) => {
                                                                                            const value =
                                                                                                e
                                                                                                    .target
                                                                                                    .value;
                                                                                            field.onChange(
                                                                                                value ===
                                                                                                    ''
                                                                                                    ? undefined
                                                                                                    : Number(
                                                                                                          value,
                                                                                                      ),
                                                                                            );
                                                                                        }}
                                                                                        disabled={
                                                                                            isDisabled
                                                                                        }
                                                                                    />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />

                                                                    <FormItem>
                                                                        <FormLabel className="text-slate-700">
                                                                            Đơn vị
                                                                        </FormLabel>
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
                                                                            <FormLabel className="flex items-center gap-1 text-slate-700">
                                                                                <NoteText className="h-4 w-4 text-slate-600" />
                                                                                Ghi chú
                                                                            </FormLabel>
                                                                            <FormControl>
                                                                                <Input
                                                                                    {...field}
                                                                                    placeholder="Nhập ghi chú nếu có"
                                                                                    className="border-slate-300"
                                                                                    disabled={
                                                                                        isDisabled
                                                                                    }
                                                                                />
                                                                            </FormControl>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}

                    <Separator className="my-8" />

                    <div className="flex justify-end gap-4 sticky bottom-0 bg-white p-4 border-t rounded-b-lg shadow-lg">
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
