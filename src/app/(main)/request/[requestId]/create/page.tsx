'use client';
import SubCateDisplay from '@/components/badge/BadgeReceipt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getSubBySubId } from '@/services/category.service';
import { getRequestById } from '@/services/request.service';
import { formatDate } from '@/utils/functions';
import {
    CreateInventoryReceipt,
    CreateInventoryReceiptSchema,
} from '@/utils/schemas/inventory-receipt.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {
    AlertCircle,
    ArrowDownToLine,
    ArrowLeft,
    ArrowUpFromLine,
    Calendar,
    Clipboard,
    Info,
    NotebookTextIcon as NoteText,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function RequestDetail() {
    const router = useRouter();
    const { requestId }: { requestId: string } = useParams();
    // console.log('Request ID:', requestId);

    const { data: requestDetail } = useQuery({
        queryKey: ['requestDetail', requestId],
        queryFn: () => getRequestById(requestId),
    });

    const { data: subCate } = useQuery({
        queryKey: ['subCate', requestDetail?.requestTypeId],
        queryFn: () => getSubBySubId(requestDetail?.requestTypeId as string),
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
            resourceId: '',
            actualQuantity: 0,
            unitId: '',
            note: '',
        },
        mode: 'onChange',
    });

    if (!requestDetail) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <AlertCircle className="h-12 w-12 text-muted-foreground" />
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
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1>
                Tạo phiếu <SubCateDisplay id={requestDetail.requestTypeId} mode="description" />
            </h1>
            {requestDetail.inventoryRequests.map((request) => {
                return (
                    <div key={request.requestId}>
                        <Form {...form}>
                            <form>
                                <div>
                                    {/* inventoryRequestId */}

                                    {(subCategoryName === 'IMPORT' ||
                                        subCategoryName === 'EXPORT') && (
                                        <FormField
                                            control={form.control}
                                            name={
                                                subCategoryName === 'IMPORT'
                                                    ? 'wareToId'
                                                    : 'wareFromId'
                                            }
                                            render={({ field }) => (
                                                <div className="space-y-2">
                                                    <FormLabel className="block text-sm font-medium text-gray-700">
                                                        {subCategoryName === 'IMPORT'
                                                            ? 'Kho nhập'
                                                            : 'Kho xuất'}
                                                    </FormLabel>
                                                    <Input
                                                        {...field}
                                                        value={
                                                            subCategoryName === 'IMPORT'
                                                                ? requestDetail.inventoryRequests[0]
                                                                      ?.wareTo?.warehouseName || ''
                                                                : requestDetail.inventoryRequests[0]
                                                                      ?.wareFrom?.warehouseName ||
                                                                  ''
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            )}
                                        />
                                    )}

                                    {/* note */}
                                    <FormField
                                        control={form.control}
                                        name="note"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ghi chú</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ghi chú" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
{/* 
                                    {request.inventoryRequestDetails.map((d) => {
                                        return (
                                            <div>
                                                {/* batchNumber */}
                                                <p>Số lượng cần nhập: {d.expectedQuantity}</p>

                                                {/* resourceId */}
                                                <p>Resource ID: {d.resourceId}</p>
                                            </div>
                                        );
                                    })} */}

                                    {/* actualQuantity */}
                                    {/* unitId */}
                                </div>
                            </form>
                        </Form>
                    </div>
                );
            })}
        </div>
    );
}
