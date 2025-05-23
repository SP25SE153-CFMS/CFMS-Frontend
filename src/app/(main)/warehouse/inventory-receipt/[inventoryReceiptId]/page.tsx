'use client';

import SubCateDisplay from '@/components/badge/BadgeReceipt';
import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getReceiptById } from '@/services/request.service';
import { getResources } from '@/services/resource.service';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import {
    Calendar,
    ClipboardList,
    UserIcon,
    FileText,
    ShoppingBag,
    Stethoscope,
    Wrench,
    AlertCircle,
    ArrowLeft,
} from 'lucide-react';
import { getSubBySubId } from '@/services/category.service';
import { getWareById } from '@/services/warehouse.service';
import { Button } from '@/components/ui/button';
import { getUsers } from '@/services/user.service';

export default function InventoryDetail() {
    const router = useRouter();
    const { inventoryReceiptId }: { inventoryReceiptId: string } = useParams();

    const { data: receipt, isLoading: isLoadingReceipts } = useQuery({
        queryKey: ['receipt'],
        queryFn: () => getReceiptById(inventoryReceiptId),
    });

    const { data: resources, isLoading: isLoadingResources } = useQuery({
        queryKey: ['resources'],
        queryFn: () => getResources(),
    });
    // console.log("Resource: ",resources);

    const { data: subCate } = useQuery({
        queryKey: ['subCate', receipt?.receiptTypeId],
        queryFn: () => getSubBySubId(receipt?.receiptTypeId as string),
        enabled: !!receipt?.receiptTypeId,
    });

    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: () => getUsers(),
    });

    const subCateName = subCate?.subCategoryName;

    const warehouseId = subCateName === 'IMPORT' ? receipt?.wareToId : receipt?.wareFromId;

    const { data: ware } = useQuery({
        queryKey: ['ware', warehouseId],
        queryFn: () => getWareById(warehouseId as string),
        enabled: !!warehouseId,
    });

    const createdByName = useMemo(() => {
        if (!receipt) return '';

        const createdBy = users?.find((user) => user.userId === receipt.userId);

        return createdBy?.fullName || '';
    }, [receipt, users]);

    if (isLoadingReceipts || isLoadingResources) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-600"></div>
                    <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!receipt) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400" />
                    <h3 className="text-lg font-medium">Không tìm thấy phiếu</h3>
                    <p className="text-sm text-gray-500">
                        Phiếu với ID {inventoryReceiptId} không tồn tại hoặc đã bị xóa
                    </p>
                </div>
            </div>
        );
    }

    const getWareType = () => {
        if (subCateName === 'IMPORT') return <p className="text-sm text-gray-500">Kho nhập</p>;
        if (subCateName === 'EXPORT') return <p className="text-sm text-gray-500">Kho xuất</p>;
    };

    return (
        <div className="container mx-auto max-w-5xl py-6">
            <div className="mb-8 space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="hover:bg-slate-100"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Chi tiết phiếu: {''}
                            {receipt.receiptCodeNumber}
                        </h1>
                    </div>
                    <Badge
                        variant="outline"
                        className="w-fit border-2 px-3 py-1.5 text-sm font-medium"
                    >
                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
                        {dayjs(receipt.createdWhen).format('DD/MM/YYYY')}
                    </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <UserIcon className="h-4 w-4" />
                    <span>Người tạo:</span>
                    <span className="font-medium text-gray-700">
                        {createdByName || 'Không xác định'}
                    </span>
                </div>

                <Separator />
            </div>
            <div className="mb-6">
                <h2 className="mb-4 text-lg font-semibold">Danh sách chi tiết phiếu</h2>

                <div className="grid gap-6">
                    {receipt.inventoryReceiptDetails.map((detail) => {
                        const resource = resources?.find((r) => r.resourceId === detail.resourceId);

                        return (
                            <Card key={detail.inventoryReceiptDetailId} className="overflow-hidden">
                                <CardHeader className="bg-gray-50 pb-3">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <CardTitle className="text-base">
                                            Chi tiết phiếu:{' '}
                                            <SubCateDisplay
                                                id={receipt.receiptTypeId}
                                                mode="description"
                                            />
                                        </CardTitle>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="secondary" className="font-normal">
                                                <ClipboardList className="mr-1 h-3.5 w-3.5" />
                                                SL: {detail.actualQuantity}
                                            </Badge>
                                            <Badge variant="outline" className="font-normal">
                                                <Calendar className="mr-1 h-3.5 w-3.5" />
                                                {dayjs(detail.actualDate).format('DD/MM/YYYY')}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-0">
                                    {detail.note && (
                                        <div className="border-b bg-amber-50 px-6 py-3 text-sm">
                                            <div className="flex items-start gap-2">
                                                <FileText className="mt-0.5 h-4 w-4 text-amber-600" />
                                                <div>
                                                    <p className="font-medium text-amber-800">
                                                        Ghi chú:
                                                    </p>
                                                    <p className="text-amber-700">{detail.note}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        {resource?.food && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <ShoppingBag className="h-5 w-5 text-emerald-600" />
                                                    <h3 className="text-base font-semibold text-emerald-700">
                                                        Thực phẩm
                                                    </h3>
                                                </div>

                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div className="space-y-3 rounded-lg border bg-white p-4">
                                                        <div className="flex justify-between">
                                                            <h4 className="font-medium">
                                                                Thông tin cơ bản
                                                            </h4>
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-emerald-50 text-emerald-700"
                                                            >
                                                                {resource.food.foodCode}
                                                            </Badge>
                                                        </div>
                                                        <Separator />
                                                        <div className="space-y-2">
                                                            {/* Tên */}
                                                            <div className="grid grid-cols-[120px_1fr] items-center">
                                                                <span className="text-sm text-gray-500">
                                                                    Tên:
                                                                </span>
                                                                <span className="text-sm font-medium">
                                                                    {resource.food.foodName}
                                                                </span>
                                                            </div>

                                                            {/* Số lượng */}
                                                            <div className="grid grid-cols-[120px_1fr] items-center">
                                                                <span className="text-sm text-gray-500">
                                                                    Số lượng:
                                                                </span>
                                                                <span className="text-sm">
                                                                    {detail.actualQuantity}
                                                                </span>
                                                            </div>

                                                            {/* Loại phiếu */}
                                                            <div className="grid grid-cols-[120px_1fr] items-center">
                                                                <span className="text-sm text-gray-500">
                                                                    Loại phiếu:
                                                                </span>
                                                                <div>
                                                                    <SubCateDisplay
                                                                        id={resource.resourceTypeId}
                                                                        mode="title"
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Kho */}
                                                            <div className="grid grid-cols-[120px_1fr] items-center">
                                                                {getWareType()}
                                                                <p className="text-sm font-medium">
                                                                    {ware?.warehouseName}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3 rounded-lg border bg-white p-4">
                                                        <h4 className="font-medium">
                                                            Thông tin chi tiết
                                                        </h4>
                                                        <Separator />
                                                        <div className="space-y-2">
                                                            <div className="grid grid-cols-[120px_1fr] items-center">
                                                                <span className="text-sm text-gray-500">
                                                                    Quy cách tính:
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm">
                                                                        {resource.packageSize}
                                                                    </span>
                                                                    <SubCateDisplay
                                                                        id={resource.unitId}
                                                                        mode="input"
                                                                    />
                                                                    <span className="text-sm text-gray-400">
                                                                        /
                                                                    </span>
                                                                    <SubCateDisplay
                                                                        id={resource.packageId}
                                                                        mode="input"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-[120px_1fr] items-center">
                                                                <span className="text-sm text-gray-500">
                                                                    Ngày SX:
                                                                </span>
                                                                <span className="text-sm">
                                                                    {dayjs(
                                                                        resource.food
                                                                            .productionDate,
                                                                    ).format('DD/MM/YYYY')}
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-[120px_1fr] items-center">
                                                                <span className="text-sm text-gray-500">
                                                                    Hạn SD:
                                                                </span>
                                                                <span className="text-sm">
                                                                    {dayjs(
                                                                        resource.food.expiryDate,
                                                                    ).format('DD/MM/YYYY')}
                                                                </span>
                                                            </div>
                                                            {resource.food.note && (
                                                                <div className="grid grid-cols-[120px_1fr] items-center">
                                                                    <span className="text-sm text-gray-500 ">
                                                                        Ghi chú:
                                                                    </span>
                                                                    <span className="text-sm">
                                                                        {resource.food.note}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {resource?.equipment && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <Wrench className="h-5 w-5 text-blue-600" />
                                                    <h3 className="text-base font-semibold text-blue-700">
                                                        Thiết bị
                                                    </h3>
                                                </div>

                                                <div className="rounded-lg border bg-white p-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium">
                                                            Thông tin cơ bản
                                                        </h4>
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-blue-50 text-blue-700"
                                                        >
                                                            {resource.equipment.equipmentCode}
                                                        </Badge>
                                                    </div>
                                                    <Separator className="my-3" />
                                                    <div className="space-y-2">
                                                        {/* Tên */}
                                                        <div className="grid grid-cols-[120px_1fr] items-center">
                                                            <span className="text-sm text-gray-500">
                                                                Tên:
                                                            </span>
                                                            <span className="text-sm font-medium">
                                                                {resource.equipment.equipmentName}
                                                            </span>
                                                        </div>

                                                        {/* Số lượng */}
                                                        <div className="grid grid-cols-[120px_1fr] items-center">
                                                            <span className="text-sm text-gray-500">
                                                                Số lượng:
                                                            </span>
                                                            <span className="text-sm">
                                                                {detail.actualQuantity}
                                                            </span>
                                                        </div>

                                                        {/* Loại phiếu */}
                                                        <div className="grid grid-cols-[120px_1fr] items-center">
                                                            <span className="text-sm text-gray-500">
                                                                Loại phiếu:
                                                            </span>
                                                            <div>
                                                                <SubCateDisplay
                                                                    id={resource.resourceTypeId}
                                                                    mode="badge"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Kho */}
                                                        <div className="grid grid-cols-[120px_1fr] items-center">
                                                            {getWareType()}
                                                            <p className="text-sm font-medium">
                                                                {ware?.warehouseName}
                                                            </p>
                                                        </div>

                                                        <div className="space-y-3 rounded-lg border bg-white p-4">
                                                            <h4 className="font-medium">
                                                                Thông tin chi tiết
                                                            </h4>
                                                            <Separator className="my-3" />
                                                            <div className="space-y-2">
                                                                <div className="grid grid-cols-[120px_1fr] items-center">
                                                                    <span className="text-sm text-gray-500">
                                                                        Quy cách tính:
                                                                    </span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm">
                                                                            {resource.packageSize}
                                                                        </span>

                                                                        <SubCateDisplay
                                                                            id={resource.unitId}
                                                                            mode="input"
                                                                        />
                                                                        <span className="text-sm text-gray-400">
                                                                            /
                                                                        </span>
                                                                        <SubCateDisplay
                                                                            id={resource.packageId}
                                                                            mode="input"
                                                                        />
                                                                    </div>

                                                                    <div className="grid grid-cols-[120px_1fr] items-center">
                                                                        <span className="text-sm text-gray-500">
                                                                            Ngày mua:
                                                                        </span>
                                                                        <span className="text-sm">
                                                                            {dayjs(
                                                                                resource.equipment
                                                                                    .purchaseDate,
                                                                            ).format('DD/MM/YYYY')}
                                                                        </span>
                                                                    </div>

                                                                    <div className="grid grid-cols-[120px_1fr] items-center">
                                                                        <span className="text-sm text-gray-500 ">
                                                                            Chất liệu:
                                                                        </span>
                                                                        <SubCateDisplay
                                                                            id={
                                                                                resource.equipment
                                                                                    .materialId
                                                                            }
                                                                            mode="material"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {resource?.medicine && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <Stethoscope className="h-5 w-5 text-purple-600" />
                                                    <h3 className="text-base font-semibold text-purple-700">
                                                        Thuốc
                                                    </h3>
                                                </div>

                                                <div className="rounded-lg border bg-white p-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium">
                                                            Thông tin cơ bản
                                                        </h4>
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-purple-50 text-purple-700"
                                                        >
                                                            {resource.medicine.medicineCode}
                                                        </Badge>
                                                    </div>
                                                    <Separator className="my-3" />
                                                    <div className="space-y-2">
                                                        {/* Tên */}
                                                        <div className="grid grid-cols-[120px_1fr] items-center">
                                                            <span className="text-sm text-gray-500">
                                                                Tên:
                                                            </span>
                                                            <span className="text-sm font-medium">
                                                                {resource.medicine.medicineName}
                                                            </span>
                                                        </div>

                                                        {/* Số lượng */}
                                                        <div className="grid grid-cols-[120px_1fr] items-center">
                                                            <span className="text-sm text-gray-500">
                                                                Số lượng:
                                                            </span>
                                                            <span className="text-sm">
                                                                {detail.actualQuantity}
                                                            </span>
                                                        </div>

                                                        {/* Loại phiếu */}
                                                        <div className="grid grid-cols-[120px_1fr] items-center">
                                                            <span className="text-sm text-gray-500">
                                                                Loại phiếu:
                                                            </span>
                                                            <div>
                                                                <SubCateDisplay
                                                                    id={resource.resourceTypeId}
                                                                    mode="badge"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Kho */}
                                                        <div className="grid grid-cols-[120px_1fr] items-center">
                                                            {getWareType()}
                                                            <p className="text-sm font-medium">
                                                                {ware?.warehouseName}
                                                            </p>
                                                        </div>

                                                        <div className="space-y-3 rounded-lg border bg-white p-4">
                                                            <h4 className="font-medium">
                                                                Thông tin chi tiết
                                                            </h4>
                                                            <Separator className="my-3" />
                                                            <div className="space-y-2">
                                                                <div className="grid grid-cols-[120px_1fr] items-center">
                                                                    <span className="text-sm text-gray-500">
                                                                        Quy cách tính:
                                                                    </span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm">
                                                                            {resource.packageSize}
                                                                        </span>
                                                                        <SubCateDisplay
                                                                            id={resource.unitId}
                                                                            mode="input"
                                                                        />
                                                                        <span className="text-sm text-gray-400">
                                                                            /
                                                                        </span>
                                                                        <SubCateDisplay
                                                                            id={resource.packageId}
                                                                            mode="input"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-[120px_1fr] items-center">
                                                                    <span className="text-sm text-gray-500">
                                                                        Ngày SX:
                                                                    </span>
                                                                    <span className="text-sm">
                                                                        {dayjs(
                                                                            resource.medicine
                                                                                .productionDate,
                                                                        ).format('DD/MM/YYYY')}
                                                                    </span>
                                                                </div>

                                                                <div className="grid grid-cols-[120px_1fr] items-center">
                                                                    <span className="text-sm text-gray-500">
                                                                        Hạn SD:
                                                                    </span>
                                                                    <span className="text-sm">
                                                                        {dayjs(
                                                                            resource.medicine
                                                                                .expiryDate,
                                                                        ).format('DD/MM/YYYY')}
                                                                    </span>
                                                                </div>

                                                                <div className="grid grid-cols-[120px_1fr] items-center">
                                                                    <span className="text-sm text-gray-500 ">
                                                                        Cách sử dụng:
                                                                    </span>
                                                                    <span className="text-sm">
                                                                        {resource.medicine.usage}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
           
        </div>
    );
}
