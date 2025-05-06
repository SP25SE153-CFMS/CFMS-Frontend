'use client';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import dayjs from 'dayjs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
    CalendarIcon,
    TagIcon,
    ClipboardListIcon,
    InfoIcon,
    Stethoscope,
    Wrench,
    AlertCircle,
    FileText,
    CheckCircle2,
    Wheat,
    BriefcaseMedical,
    ArrowLeft,
    Plus,
    Egg,
} from 'lucide-react';
import { getResourceSuppliersById } from '@/services/supplier.service';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResourceResponse } from '@/utils/types/custom.type';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import config from '@/configs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AddResourceSupplier from '@/components/forms/add-resource-supplier.form';

// Function để kiểm tra loại resource
const isFood = (resource: any) => resource.foodCode && resource.foodName;

// Function để lấy màu badge dựa vào loại resource
const getResourceBadgeColor = (type: string) => {
    switch (type) {
        case 'Thực phẩm':
            return 'bg-green-100 text-green-800 hover:bg-green-200';
        case 'Dược phẩm':
            return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
        case 'Thiết bị':
            return 'bg-amber-100 text-gray-800 hover:bg-amber-200';
        case 'Giống gà':
            return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
        default:
            return 'bg-gray-100 text-teal-800 hover:bg-gray-200';
    }
};

export default function ResourceSuppliers() {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);
    const onOpenChange = (val: boolean) => setOpen(val);

    const { supplierId }: { supplierId: string } = useParams();
    const { data: resources = [], isLoading } = useQuery<ResourceResponse[]>({
        queryKey: ['resources', supplierId],
        queryFn: () => getResourceSuppliersById(supplierId),
        enabled: !!supplierId,
    });

    // console.log('supplierId: ', supplierId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-120px)] w-full">
                <LoadingSpinner />
            </div>
        );
    }

    if (!resources || resources.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] w-full text-muted-foreground">
                <ClipboardListIcon className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-lg font-medium mb-4">Không có dữ liệu</p>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="mt-4">
                            <Plus className="w-4 h-4" />
                            Thêm mặt hàng
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">
                                Tạo hàng hóa
                            </DialogTitle>
                            <DialogDescription>Nhập đầy đủ các thông tin dưới.</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-[70vh]">
                            <div className="p-1">
                                <AddResourceSupplier
                                    closeModal={closeModal}
                                    supplierId={supplierId}
                                />
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    // Nhóm resources theo loại
    const foodResources = resources.filter((r) => r.resourceType === 'Thực phẩm');
    const medicineResources = resources.filter((r) => r.resourceType === 'Dược phẩm');
    const equipmentResources = resources.filter((r) => r.resourceType === 'Thiết bị');
    const breedingResources = resources.filter((r) => r.resourceType === 'Giống gà');
    const otherResources = resources.filter(
        (r) =>
            r.resourceType !== 'Thực phẩm' &&
            r.resourceType !== 'Dược phẩm' &&
            r.resourceType !== 'Thiết bị' &&
            r.resourceType !== 'Giống gà',
    );

    return (
        <div className="max-w-screen-lg mx-auto w-full h-full flex flex-col">
            <div className="flex items-center sm:flex-row sm:items-center sm:justify-between gap-4 my-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(config.routes.supplier)}
                    className="rounded-full h-10 w-10"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>

                <h3 className="justify-center items-center px-1 font-bold pl-3 text-2xl relative inline-block">
                    Thông tin các mặt hàng
                </h3>

                <Button onClick={openModal} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo mới
                </Button>
            </div>

            <Tabs defaultValue="all" className="w-full flex-1 flex flex-col">
                <TabsList
                    className={`mb-4 mx-auto w-fit grid ${
                        // Calculate grid columns based on visible tabs
                        `grid-cols-${
                            1 + // All tab
                            (foodResources.length > 0 ? 1 : 0) +
                            (medicineResources.length > 0 ? 1 : 0) +
                            (equipmentResources.length > 0 ? 1 : 0) +
                            (breedingResources.length > 0 ? 1 : 0) +
                            (otherResources.length > 0 ? 1 : 0)
                        }`
                    } h-auto p-1`}
                >
                    <TabsTrigger value="all" className="text-sm py-2 px-12">
                        Tất cả ({resources.length})
                    </TabsTrigger>
                    {foodResources.length > 0 && (
                        <TabsTrigger value="food" className="text-sm py-2 px-12">
                            Thực phẩm ({foodResources.length})
                        </TabsTrigger>
                    )}
                    {medicineResources.length > 0 && (
                        <TabsTrigger value="medicine" className="text-sm py-2 px-12">
                            Dược phẩm ({medicineResources.length})
                        </TabsTrigger>
                    )}
                    {equipmentResources.length > 0 && (
                        <TabsTrigger value="equipment" className="text-sm py-2 px-12">
                            Thiết bị ({equipmentResources.length})
                        </TabsTrigger>
                    )}
                    {breedingResources.length > 0 && (
                        <TabsTrigger value="breeding" className="text-sm py-2 px-12">
                            Giống gà ({breedingResources.length})
                        </TabsTrigger>
                    )}
                    {otherResources.length > 0 && (
                        <TabsTrigger value="other" className="text-sm py-2 px-12">
                            Khác ({otherResources.length})
                        </TabsTrigger>
                    )}
                </TabsList>

                <div className="flex-1 flex flex-col">
                    <TabsContent value="all" className="mt-0 flex-1 h-full">
                        <ResourceList resources={resources} />
                    </TabsContent>

                    {foodResources.length > 0 && (
                        <TabsContent value="food" className="mt-0 flex-1 h-full">
                            <ResourceList resources={foodResources} />
                        </TabsContent>
                    )}

                    {medicineResources.length > 0 && (
                        <TabsContent value="medicine" className="mt-0 flex-1 h-full">
                            <ResourceList resources={medicineResources} />
                        </TabsContent>
                    )}

                    {equipmentResources.length > 0 && (
                        <TabsContent value="equipment" className="mt-0 flex-1 h-full">
                            <ResourceList resources={equipmentResources} />
                        </TabsContent>
                    )}

                    {breedingResources.length > 0 && (
                        <TabsContent value="breeding" className="mt-0 flex-1 h-full">
                            <ResourceList resources={breedingResources} />
                        </TabsContent>
                    )}

                    {otherResources.length > 0 && (
                        <TabsContent value="other" className="mt-0 flex-1 h-full">
                            <ResourceList resources={otherResources} />
                        </TabsContent>
                    )}
                </div>
            </Tabs>

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Tạo hàng hóa</DialogTitle>
                        <DialogDescription>Nhập đầy đủ các thông tin dưới.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[70vh]">
                        <div className="p-1">
                            <AddResourceSupplier closeModal={closeModal} supplierId={supplierId} />
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function ResourceList({ resources }: { resources: ResourceResponse[] }) {
    return (
        <ScrollArea className="h-[calc(100vh-200px)] w-full pr-2">
            <div className="space-y-6 pb-6">
                {resources.map((resource, index) => (
                    <Card
                        key={index}
                        className="border border-border/40 transition-all duration-200 hover:border-primary/30 hover:shadow-md overflow-hidden w-full"
                    >
                        <CardContent className="p-0">
                            <div className="bg-muted/30 px-6 py-3 border-b border-border/60">
                                {/* Bên trái: Icon và tên hàng theo loại */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {resource.resourceType === 'Thực phẩm' && (
                                            <Wheat className="w-5 h-5 text-green-600" />
                                        )}
                                        {resource.resourceType === 'Dược phẩm' && (
                                            <BriefcaseMedical className="w-5 h-5 text-blue-600" />
                                        )}
                                        {resource.resourceType === 'Thiết bị' && (
                                            <Wrench className="w-5 h-5 text-gray-600" />
                                        )}
                                        {resource.resourceType === 'Giống gà' && (
                                            <Egg className="w-5 h-5 text-amber-600" />
                                        )}
                                        <span className="font-medium text-base">
                                            {resource.resourceType === 'Thực phẩm' &&
                                                resource.foodName}
                                            {resource.resourceType === 'Dược phẩm' &&
                                                resource.medicineName}
                                            {resource.resourceType === 'Thiết bị' &&
                                                resource.equipmentName}
                                            {resource.resourceType === 'Giống gà' &&
                                                resource.chickenName}
                                            {![
                                                'Thực phẩm',
                                                'Dược phẩm',
                                                'Thiết bị',
                                                'Giống gà',
                                            ].includes(resource.resourceType) && 'Tài nguyên khác'}
                                        </span>
                                    </div>

                                    {/* Bên phải: Hiển thị màu badge theo loại */}
                                    <Badge
                                        className={`font-normal ${getResourceBadgeColor(resource.resourceType)}`}
                                    >
                                        {resource.resourceType}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Cột 1 - Thông tin chung + thông tin đặc trưng */}
                                    <div className="space-y-4">
                                        <div className="bg-muted/20 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                                <TagIcon className="w-4 h-4" />
                                                Thông tin cơ bản
                                            </h4>
                                            <div className="space-y-3">
                                                {/* Code */}
                                                {resource.resourceType === 'Thực phẩm' && (
                                                    <>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium min-w-28">
                                                                Mã thức ăn:
                                                            </span>
                                                            <span className="text-sm">
                                                                {resource.foodCode}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}

                                                {resource.resourceType === 'Dược phẩm' && (
                                                    <>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium min-w-28">
                                                                Mã thuốc:
                                                            </span>
                                                            <span className="text-sm">
                                                                {resource.medicineCode}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}

                                                {resource.resourceType === 'Thiết bị' && (
                                                    <>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium min-w-28">
                                                                Mã thiết bị:
                                                            </span>
                                                            <span className="text-sm">
                                                                {resource.equipmentCode}
                                                            </span>
                                                        </div>
                                                    </>
                                                )}

                                                {/* Đơn vị */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium min-w-28">
                                                        Đơn vị:
                                                    </span>
                                                    <span className="text-sm">
                                                        {resource.unitSpecification || 'Không có'}
                                                    </span>
                                                </div>

                                                {/* Giá */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium min-w-28">
                                                        Giá:
                                                    </span>
                                                    <span className="text-sm font-medium text-primary">
                                                        {resource.price} VNĐ
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Thông tin đặc trưng */}
                                        {resource.resourceType === 'Dược phẩm' && (
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-blue-700">
                                                    <Stethoscope className="w-4 h-4" />
                                                    Thông tin thuốc
                                                </h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium min-w-28">
                                                            Cách dùng:
                                                        </span>
                                                        <span className="text-sm">
                                                            {resource.usage || 'Không có'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium min-w-28">
                                                            Liều lượng:
                                                        </span>
                                                        <span className="text-sm">
                                                            {resource.dosageForm || 'Không có'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {resource.resourceType === 'Thiết bị' && (
                                            <div className="bg-amber-50 rounded-lg p-4">
                                                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-amber-700">
                                                    <Wrench className="w-4 h-4" />
                                                    Thông tin thiết bị
                                                </h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium min-w-28">
                                                            Chất liệu:
                                                        </span>
                                                        <span className="text-sm">
                                                            {resource.material || 'Không có'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium min-w-28">
                                                            Bảo hành:
                                                        </span>
                                                        <span className="text-sm">
                                                            {resource.warranty
                                                                ? `${resource.warranty} tháng`
                                                                : 'Không có'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {resource.resourceType === 'Giống gà' && (
                                            <div className="bg-orange-50 rounded-lg p-4">
                                                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-orange-700">
                                                    <Egg className="w-4 h-4" />
                                                    Thông tin giống gà
                                                </h4>
                                                <div className="space-y-3">
                                                    {/* Mã giống */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium min-w-28">
                                                            Mã giống:
                                                        </span>
                                                        <span className="text-sm">
                                                            {resource.chickenCode || 'Không có'}
                                                        </span>
                                                    </div>

                                                    {/* Tên giống */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium min-w-28">
                                                            Tên giống:
                                                        </span>
                                                        <span className="text-sm">
                                                            {resource.chickenName || 'Không có'}
                                                        </span>
                                                    </div>

                                                    {/* Loại gà */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium min-w-28">
                                                            Loại gà:
                                                        </span>
                                                        <span className="text-sm">
                                                            {resource.breeding?.chickenName ||
                                                                'Không có'}
                                                        </span>
                                                    </div>

                                                    {/* Quy cách */}
                                                    {/* <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium min-w-28">
                                                            Quy cách:
                                                        </span>
                                                        <span className="text-sm">
                                                            {resource. || 'Không có'}
                                                        </span>
                                                    </div> */}

                                                    {/* Đơn vị */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium min-w-28">
                                                            Đơn vị:
                                                        </span>
                                                        <span className="text-sm">
                                                            {resource.unitSpecification ||
                                                                'Không có'}
                                                        </span>
                                                    </div>

                                                    {/* Mô tả */}
                                                    {resource.description && (
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-sm font-medium min-w-28">
                                                                Mô tả:
                                                            </span>
                                                            <span className="text-sm">
                                                                {resource.description}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cột 2 - Thông tin về thời gian + mô tả */}
                                    <div className="space-y-4">
                                        {/* Thời gian */}
                                        <div className="bg-muted/20 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                                <CalendarIcon className="w-4 h-4" />
                                                Thông tin thời gian
                                            </h4>
                                            <div className="space-y-3">
                                                {resource.productionDate && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium min-w-28">
                                                            Ngày sản xuất:
                                                        </span>
                                                        <span className="text-sm">
                                                            {dayjs(
                                                                new Date(resource.productionDate),
                                                            ).format('DD/MM/YYYY')}
                                                        </span>
                                                    </div>
                                                )}

                                                {resource.expiryDate && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium min-w-28">
                                                            Hạn sử dụng:
                                                        </span>
                                                        <span className="text-sm">
                                                            {dayjs(
                                                                new Date(resource.expiryDate),
                                                            ).format('DD/MM/YYYY')}
                                                        </span>
                                                    </div>
                                                )}

                                                {resource.purchaseDate && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium min-w-28">
                                                            Ngày mua:
                                                        </span>
                                                        <span className="text-sm">
                                                            {dayjs(
                                                                new Date(resource.purchaseDate),
                                                            ).format('DD/MM/YYYY')}
                                                        </span>
                                                    </div>
                                                )}

                                                {!resource.productionDate &&
                                                    !resource.expiryDate &&
                                                    !resource.purchaseDate && (
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <AlertCircle className="w-4 h-4" />
                                                            <span className="text-sm">
                                                                Không có thông tin thời gian
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        {/* Mô tả */}
                                        <div className="bg-muted/20 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                Mô tả chi tiết
                                            </h4>
                                            <div className="space-y-3">
                                                {resource.description ? (
                                                    <p className="text-sm whitespace-pre-line">
                                                        {resource.description}
                                                    </p>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <InfoIcon className="w-4 h-4" />
                                                        <span className="text-sm">
                                                            Không có mô tả
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Ghi chú (chỉ cho thực phẩm) */}
                                        {isFood(resource) && resource.note && (
                                            <div className="bg-green-50 rounded-lg p-4">
                                                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-green-700">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Ghi chú
                                                </h4>
                                                <p className="text-sm whitespace-pre-line">
                                                    {resource.note}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    );
}
