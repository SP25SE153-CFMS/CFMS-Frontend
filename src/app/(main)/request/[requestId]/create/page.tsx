'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getRequestById } from '@/services/request.service';
import { formatDate } from '@/utils/functions';
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

export default function RequestDetail() {
    const router = useRouter();
    const { requestId }: { requestId: string } = useParams();

    const { data: requestDetail } = useQuery({
        queryKey: ['requestDetail', requestId],
        queryFn: () => getRequestById(requestId),
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
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Tạo phiếu</CardTitle>
                    <p className="text-muted-foreground text-sm">ID: {requestDetail.requestId}</p>
                </CardHeader>
                <CardContent>
                    {/* <div className="grid grid-cols-2 gap-4 mb-6"> */}
                    {/* <div>
                            <p className="text-sm text-muted-foreground">ID Yêu cầu kho:</p>
                            <p className="font-medium">{requestData.inventoryRequestId || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">ID Loại phiếu:</p>
                            <p className="font-medium">{requestData.receiptTypeId || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Kho xuất:</p>
                            <p className="font-medium">{requestData.wareFromId || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Kho nhập:</p>
                            <p className="font-medium">{requestData.wareToId || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Số lô:</p>
                            <p className="font-medium">{requestData.batchNumber ?? 'N/A'}</p>
                        </div> */}
                    {/* </div> */}
                    <div className="space-y-6">
                        {requestDetail.inventoryRequests[0]?.wareToId && (
                            <div className="bg-muted/30 p-4 rounded-lg border border-primary/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <ArrowDownToLine className="h-5 w-5 text-primary" />
                                    <h3 className="font-medium text-primary">Kho nhập</h3>
                                </div>
                                <h4 className="text-lg font-semibold mb-1">
                                    {requestDetail.inventoryRequests[0].wareTo?.warehouseName}
                                </h4>
                                {requestDetail.inventoryRequests[0].wareTo?.farm?.farmName && (
                                    <p className="text-muted-foreground">
                                        Trang trại:{' '}
                                        {requestDetail.inventoryRequests[0].wareTo.farm.farmName}
                                    </p>
                                )}
                            </div>
                        )}

                        {requestDetail.inventoryRequests[0]?.wareFromId && (
                            <div className="bg-muted/30 p-4 rounded-lg border border-red-500/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <ArrowUpFromLine className="h-5 w-5 text-red-500" />
                                    <h3 className="font-medium text-red-500">Kho xuất</h3>
                                </div>
                                <h4 className="text-lg font-semibold mb-1">
                                    {requestDetail.inventoryRequests[0].wareFrom?.warehouseName}
                                </h4>
                                {requestDetail.inventoryRequests[0].wareFrom?.farm?.farmName && (
                                    <p className="text-muted-foreground">
                                        Trang trại:{' '}
                                        {requestDetail.inventoryRequests[0].wareFrom.farm.farmName}
                                    </p>
                                )}
                            </div>
                        )}

                        {requestDetail.inventoryRequests[0]?.inventoryRequestDetails[0] && (
                            <div className="bg-muted/30 p-4 rounded-lg border border-muted">
                                <div className="flex items-center gap-2 mb-3">
                                    <Info className="h-5 w-5 text-primary" />
                                    <h3 className="font-medium text-primary">Thông tin chung</h3>
                                </div>
                                <div className="space-y-3">
                                    {requestDetail.inventoryRequests[0].inventoryRequestDetails[0]
                                        .reason && (
                                        <div className="flex items-start gap-2">
                                            <Clipboard className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div>
                                                <span className="text-sm font-medium">Lý do:</span>
                                                <p className="text-sm">
                                                    {
                                                        requestDetail.inventoryRequests[0]
                                                            .inventoryRequestDetails[0].reason
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {requestDetail.inventoryRequests[0].inventoryRequestDetails[0]
                                        .expectedDate && (
                                        <div className="flex items-start gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div>
                                                <span className="text-sm font-medium">
                                                    Ngày tạo:
                                                </span>
                                                <p className="text-sm">
                                                    {formatDate(
                                                        requestDetail.inventoryRequests[0]
                                                            .inventoryRequestDetails[0]
                                                            .expectedDate,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {requestDetail.inventoryRequests[0].inventoryRequestDetails[0]
                                        .note && (
                                        <div className="flex items-start gap-2">
                                            <NoteText className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div>
                                                <span className="text-sm font-medium">
                                                    Ghi chú:
                                                </span>
                                                <p className="text-sm">
                                                    {
                                                        requestDetail.inventoryRequests[0]
                                                            .inventoryRequestDetails[0].note
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Chi tiết phiếu</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID Tài nguyên</TableHead>
                                    <TableHead>Số lượng thực tế</TableHead>
                                    <TableHead>ID Đơn vị</TableHead>
                                    <TableHead>Ghi chú</TableHead>
                                </TableRow>
                            </TableHeader>
                            {/* <TableBody>
                                {requestData.receiptDetails &&
                                requestData.receiptDetails.length > 0 ? (
                                    requestData.receiptDetails.map((detail, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{detail.resourceId || 'N/A'}</TableCell>
                                            <TableCell>{detail.actualQuantity ?? 'N/A'}</TableCell>
                                            <TableCell>{detail.unitId || 'N/A'}</TableCell>
                                            <TableCell>{detail.note || 'N/A'}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            Không có dữ liệu chi tiết
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody> */}
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
