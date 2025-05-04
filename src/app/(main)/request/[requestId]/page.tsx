'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from '@/components/fallback-image';
import {
    ArrowLeft,
    FileText,
    Package,
    Info,
    Calendar,
    Warehouse,
    AlertCircle,
    ArrowDownToLine,
    ArrowUpFromLine,
    NotebookTextIcon as NoteText,
    Images,
    Loader2,
    PackageCheck,
    Tag,
    Clipboard,
    CheckCheck,
    X,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { approveRequest, getRequestById } from '@/services/request.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getWareStockByResourceId } from '@/services/warehouse.service';
import { RequestResponse, ResourceResponse } from '@/utils/types/custom.type';
import { convertToThumbnailUrl, formatDate } from '@/utils/functions';
import { DATE_TIME_FORMAT } from '@/utils/constants/date.constant';
import toast from 'react-hot-toast';
import {
    RequestStatus,
    requestStatusColor,
    requestStatusIcon,
    requestStatusLabels,
} from '@/utils/enum/status.enum';
import config from '@/configs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { getRequestTitle } from '@/lib/helper';

export default function RequestDetailPage() {
    const router = useRouter();
    const { requestId }: { requestId: string } = useParams();

    const [notes, setNotes] = useState<string>('');
    const [resourceSpecs, setResourceSpecs] = useState<{ [key: string]: ResourceResponse }>({});

    const { data: requestDetail, isLoading } = useQuery({
        queryKey: ['requestDetail', requestId],
        queryFn: () => getRequestById(requestId),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (status: RequestStatus) => approveRequest(requestId, status, notes),
        onSuccess: (response) => {
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: ['requestDetail', requestId] });
        },
        onError: (error: any) => {
            console.error(error);
            toast(error?.response?.data?.message, { icon: '⚠️' });
        },
    });

    const handleApproveRequest = async (status: RequestStatus) => {
        await mutation.mutateAsync(status);
    };

    useEffect(() => {
        if (requestDetail?.inventoryRequests) {
            const details = requestDetail.inventoryRequests[0]?.inventoryRequestDetails || [];
            details.forEach((detail) => {
                fetchResourceSpec(detail.resourceId);
            });
        }
    }, [requestDetail]);

    const fetchResourceSpec = async (resourceId: string) => {
        try {
            const response = await getWareStockByResourceId(resourceId);
            if (response) {
                setResourceSpecs((prev) => ({
                    ...prev,
                    [resourceId]: response,
                }));
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin quy cách:', error);
        }
    };

    const getStatusIcon = (status: number) => {
        const Icon = requestStatusIcon[status];
        return <Icon className="h-3.5 w-3.5 mr-1.5" />;
    };

    const getPriorityText = (priority: number) => {
        switch (priority) {
            case 3:
                return { text: 'Cao', color: 'red' };
            case 2:
                return { text: 'Trung bình', color: 'yellow' };
            case 1:
                return { text: 'Thấp', color: 'green' };
            default:
                return { text: 'Không xác định', color: 'gray' };
        }
    };

    const getRequestType = (requestDetail: RequestResponse) => {
        return requestDetail.taskRequests?.length > 0 ? 'Báo cáo, đánh giá' : 'Nhập xuất kho';
    };

    const getResourceName = (resource: ResourceResponse | null) => {
        if (!resource) return 'Chưa có tên sản phẩm';

        if (resource.harvestProduct?.harvestProductName) {
            return resource.harvestProduct.harvestProductName;
        }
        if (resource.food?.foodName) {
            return resource.food.foodName;
        }
        if (resource.breeding?.chickenName) {
            return resource.breeding.chickenName;
        }
        if (resource.equipment?.equipmentName) {
            return resource.equipment.equipmentName;
        }
        if (resource.medicine?.medicineName) {
            return resource.medicine.medicineName;
        }

        return 'Chưa có tên sản phẩm';
    };

    const getProductCode = (spec: ResourceResponse | undefined) => {
        if (!spec) return '';
        return (
            spec.medicineCode ||
            spec.equipmentCode ||
            spec.foodCode ||
            spec.chickenCode ||
            spec.harvestProductCode ||
            ''
        );
    };

    const getUnitFromSpecification = (specification: string | undefined) => {
        if (!specification) return '';
        // Mẫu: "30 kg/bao" -> lấy "kg"
        const match = specification.match(/\d+\s+(\w+)\/\w+/);
        return match ? match[1] : '';
    };

    const getQuantityDisplay = (
        quantity: number,
        spec: ResourceResponse | undefined,
        unitName: string,
    ) => {
        if (!spec?.unitSpecification) return `${quantity} ${unitName}`;

        // Lấy số lượng và đơn vị từ quy cách (vd: "30 kg/bao")
        const match = spec.unitSpecification.match(/(\d+)\s+(\w+)\/(\w+)/);
        if (!match) return `${quantity} ${unitName}`;

        // eslint-disable-next-line no-unused-vars
        const [_, amountPerUnit, unit, packageUnit] = match;
        const totalAmount = quantity * Number(amountPerUnit);

        return `${quantity} ${packageUnit} (${totalAmount} ${unit})`;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-muted-foreground">Đang tải thông tin phiếu...</p>
                </div>
            </div>
        );
    }

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

    // Process images for task requests
    let images: string[] = [];
    if (requestDetail.taskRequests?.length > 0) {
        const taskRequest = requestDetail.taskRequests[0];
        if (taskRequest.imageUrl && taskRequest.imageUrl.length > 0) {
            const firstItem = taskRequest.imageUrl[0];
            if (typeof firstItem === 'string') {
                images = taskRequest.imageUrl;
            } else if (Array.isArray(firstItem)) {
                images = firstItem;
            }
        }
    }

    const handleCreateInventoryReceipt = () => {
        // TODO: Handle creating inventory receipt logic here
        // This could involve navigating to another page or opening a modal
        // toast('Chức năng này đang được triển khai');
        router.push(`${config.routes.request}/${requestId}/create`);
    };

    return (
        <div className="container max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-300">
            {/* Header with back button and status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full h-10 w-10"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Chi tiết phiếu</h1>
                        <p className="text-muted-foreground text-sm">
                            ID: {requestDetail.requestId}
                        </p>
                    </div>
                </div>

                <Badge
                    variant="outline"
                    className={cn('px-3 py-1.5 text-sm font-medium', {
                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20':
                            requestStatusColor[requestDetail.status] === 'yellow',
                        'bg-green-500/10 text-green-500 border-green-500/20':
                            requestStatusColor[requestDetail.status] === 'green',
                        'bg-red-500/10 text-red-500 border-red-500/20':
                            requestStatusColor[requestDetail.status] === 'red',
                        'bg-gray-500/10 text-gray-500 border-gray-500/20':
                            requestStatusColor[requestDetail.status] === 'gray',
                    })}
                >
                    {getStatusIcon(requestDetail.status)}
                    {requestStatusLabels[requestDetail.status]}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content - 2/3 width on desktop */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information Card */}
                    <Card className="overflow-hidden border-none shadow-md">
                        <CardHeader className="bg-primary/5 pb-4">
                            <div className="flex items-center gap-2">
                                {requestDetail.taskRequests?.length > 0 ? (
                                    <FileText className="h-5 w-5 text-primary" />
                                ) : (
                                    <Package className="h-5 w-5 text-primary" />
                                )}
                                <CardTitle className="text-lg font-semibold">
                                    {getRequestTitle(requestDetail)}
                                </CardTitle>
                            </div>
                            <CardDescription>
                                {getRequestType(requestDetail)} • Tạo lúc{' '}
                                {formatDate(requestDetail.createdWhen ?? '', DATE_TIME_FORMAT)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 bg-muted/40 p-3 rounded-md">
                                    <Tag className="h-4 w-4 text-primary shrink-0" />
                                    <span className="text-sm text-primary font-medium whitespace-nowrap">
                                        Loại phiếu:
                                    </span>
                                    <span className="text-sm ml-1">
                                        {getRequestType(requestDetail)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 bg-muted/40 p-3 rounded-md">
                                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                                    <span className="text-sm text-primary font-medium whitespace-nowrap">
                                        Ngày tạo:
                                    </span>
                                    <span className="text-sm ml-1">
                                        {formatDate(requestDetail.createdWhen)}
                                    </span>
                                </div>

                                {requestDetail.taskRequests?.length > 0 && (
                                    <div className="flex items-center gap-2 bg-muted/40 p-3 rounded-md">
                                        {/* <AlertCircle
                                            className="h-4 w-4 shrink-0"
                                            className={cn({
                                                'text-red-500':
                                                    getPriorityText(
                                                        requestDetail.taskRequests[0].priority,
                                                    ).color === 'red',
                                                'text-yellow-500':
                                                    getPriorityText(
                                                        requestDetail.taskRequests[0].priority,
                                                    ).color === 'yellow',
                                                'text-green-500':
                                                    getPriorityText(
                                                        requestDetail.taskRequests[0].priority,
                                                    ).color === 'green',
                                                'text-gray-500':
                                                    getPriorityText(
                                                        requestDetail.taskRequests[0].priority,
                                                    ).color === 'gray',
                                            })}
                                        />
                                        <span
                                            className="text-sm font-medium whitespace-nowrap"
                                            className={cn({
                                                'text-red-500':
                                                    getPriorityText(
                                                        requestDetail.taskRequests[0].priority,
                                                    ).color === 'red',
                                                'text-yellow-500':
                                                    getPriorityText(
                                                        requestDetail.taskRequests[0].priority,
                                                    ).color === 'yellow',
                                                'text-green-500':
                                                    getPriorityText(
                                                        requestDetail.taskRequests[0].priority,
                                                    ).color === 'green',
                                                'text-gray-500':
                                                    getPriorityText(
                                                        requestDetail.taskRequests[0].priority,
                                                    ).color === 'gray',
                                            })}
                                        >
                                            Mức độ ưu tiên:
                                        </span> */}
                                        <span className="text-sm ml-1">
                                            {
                                                getPriorityText(
                                                    requestDetail.taskRequests[0].priority,
                                                ).text
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content based on request type */}
                    {requestDetail.taskRequests?.length > 0 ? (
                        <Tabs defaultValue="description" className="w-full">
                            <TabsList className="grid grid-cols-2 mb-4">
                                <TabsTrigger value="description">Mô tả</TabsTrigger>
                                <TabsTrigger value="images" disabled={images.length === 0}>
                                    Hình ảnh {images.length > 0 && `(${images.length})`}
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="description" className="mt-0">
                                <Card className="border-none shadow-md">
                                    <CardHeader className="bg-primary/5 pb-4">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-lg font-semibold">
                                                Chi tiết báo cáo
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="bg-muted/30 p-4 rounded-lg border border-muted">
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                {requestDetail.taskRequests[0].description ||
                                                    'Không có nội dung'}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="images" className="mt-0">
                                <Card className="border-none shadow-md">
                                    <CardHeader className="bg-primary/5 pb-4">
                                        <div className="flex items-center gap-2">
                                            <Images className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-lg font-semibold">
                                                Hình ảnh đính kèm ({images.length})
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {images.map((url, index) => (
                                                <Image
                                                    key={index}
                                                    src={convertToThumbnailUrl(url)}
                                                    alt={`Hình ảnh ${index + 1}`}
                                                    width={200}
                                                    height={200}
                                                    preview
                                                    className="object-cover mx-auto"
                                                />
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    ) : (
                        <Tabs defaultValue="warehouse" className="w-full">
                            <TabsList className="grid grid-cols-2 mb-4">
                                <TabsTrigger value="warehouse">Thông tin kho</TabsTrigger>
                                <TabsTrigger value="products">Danh sách sản phẩm</TabsTrigger>
                            </TabsList>

                            <TabsContent value="warehouse" className="mt-0">
                                <Card className="border-none shadow-md">
                                    <CardHeader className="bg-primary/5 pb-4">
                                        <div className="flex items-center gap-2">
                                            <Warehouse className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-lg font-semibold">
                                                Thông tin kho
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="space-y-6">
                                            {requestDetail.inventoryRequests[0]?.wareToId && (
                                                <div className="bg-muted/30 p-4 rounded-lg border border-primary/20">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <ArrowDownToLine className="h-5 w-5 text-primary" />
                                                        <h3 className="font-medium text-primary">
                                                            Kho nhập
                                                        </h3>
                                                    </div>
                                                    <h4 className="text-lg font-semibold mb-1">
                                                        {
                                                            requestDetail.inventoryRequests[0]
                                                                .wareTo?.warehouseName
                                                        }
                                                    </h4>
                                                    {requestDetail.inventoryRequests[0].wareTo?.farm
                                                        ?.farmName && (
                                                        <p className="text-muted-foreground">
                                                            Trang trại:{' '}
                                                            {
                                                                requestDetail.inventoryRequests[0]
                                                                    .wareTo.farm.farmName
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {requestDetail.inventoryRequests[0]?.wareFromId && (
                                                <div className="bg-muted/30 p-4 rounded-lg border border-red-500/20">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <ArrowUpFromLine className="h-5 w-5 text-red-500" />
                                                        <h3 className="font-medium text-red-500">
                                                            Kho xuất
                                                        </h3>
                                                    </div>
                                                    <h4 className="text-lg font-semibold mb-1">
                                                        {
                                                            requestDetail.inventoryRequests[0]
                                                                .wareFrom?.warehouseName
                                                        }
                                                    </h4>
                                                    {requestDetail.inventoryRequests[0].wareFrom
                                                        ?.farm?.farmName && (
                                                        <p className="text-muted-foreground">
                                                            Trang trại:{' '}
                                                            {
                                                                requestDetail.inventoryRequests[0]
                                                                    .wareFrom.farm.farmName
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {requestDetail.inventoryRequests[0]
                                                ?.inventoryRequestDetails[0] && (
                                                <div className="bg-muted/30 p-4 rounded-lg border border-muted">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Info className="h-5 w-5 text-primary" />
                                                        <h3 className="font-medium text-primary">
                                                            Thông tin chung
                                                        </h3>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {requestDetail.inventoryRequests[0]
                                                            .inventoryRequestDetails[0].reason && (
                                                            <div className="flex items-start gap-2">
                                                                <Clipboard className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                                <div>
                                                                    <span className="text-sm font-medium">
                                                                        Lý do:
                                                                    </span>
                                                                    <p className="text-sm">
                                                                        {
                                                                            requestDetail
                                                                                .inventoryRequests[0]
                                                                                .inventoryRequestDetails[0]
                                                                                .reason
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {requestDetail.inventoryRequests[0]
                                                            .inventoryRequestDetails[0]
                                                            .expectedDate && (
                                                            <div className="flex items-start gap-2">
                                                                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                                <div>
                                                                    <span className="text-sm font-medium">
                                                                        Ngày dự kiến:
                                                                    </span>
                                                                    <p className="text-sm">
                                                                        {formatDate(
                                                                            requestDetail
                                                                                .inventoryRequests[0]
                                                                                .inventoryRequestDetails[0]
                                                                                .expectedDate,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {requestDetail.inventoryRequests[0]
                                                            .inventoryRequestDetails[0].note && (
                                                            <div className="flex items-start gap-2">
                                                                <NoteText className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                                <div>
                                                                    <span className="text-sm font-medium">
                                                                        Ghi chú:
                                                                    </span>
                                                                    <p className="text-sm">
                                                                        {
                                                                            requestDetail
                                                                                .inventoryRequests[0]
                                                                                .inventoryRequestDetails[0]
                                                                                .note
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="products" className="mt-0">
                                <Card className="border-none shadow-md">
                                    <CardHeader className="bg-primary/5 pb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-5 w-5 text-primary" />
                                                <CardTitle className="text-lg font-semibold">
                                                    Danh sách sản phẩm
                                                </CardTitle>
                                            </div>
                                            {requestDetail.inventoryRequests[0]
                                                ?.inventoryRequestDetails.length > 0 && (
                                                <Badge
                                                    variant="outline"
                                                    className="bg-primary/10 text-primary border-primary/20"
                                                >
                                                    {
                                                        requestDetail.inventoryRequests[0]
                                                            .inventoryRequestDetails.length
                                                    }{' '}
                                                    sản phẩm
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            {requestDetail.inventoryRequests[0]?.inventoryRequestDetails.map(
                                                (item, index) => {
                                                    const spec = resourceSpecs[item.resourceId];
                                                    const productCode = getProductCode(spec);
                                                    const unit =
                                                        getUnitFromSpecification(
                                                            spec?.unitSpecification,
                                                        ) ||
                                                        item.unit?.name ||
                                                        '';

                                                    return (
                                                        <Card
                                                            key={index}
                                                            className="overflow-hidden border border-muted/50 hover:border-primary/20 transition-all"
                                                        >
                                                            <CardHeader className="bg-muted/30 dark:bg-muted/10 py-3 px-4">
                                                                <div className="flex items-center gap-2">
                                                                    <Package className="h-4 w-4 text-primary" />
                                                                    <CardTitle className="text-base font-medium">
                                                                        {getResourceName(
                                                                            item.resource,
                                                                        )}
                                                                    </CardTitle>
                                                                </div>
                                                                {productCode && (
                                                                    <CardDescription>
                                                                        Mã: {productCode}
                                                                    </CardDescription>
                                                                )}
                                                            </CardHeader>
                                                            <CardContent className="py-3 px-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    {spec?.unitSpecification && (
                                                                        <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-md">
                                                                            <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                                                                            <span className="text-xs text-muted-foreground font-medium">
                                                                                Quy cách:
                                                                            </span>
                                                                            <span className="text-xs">
                                                                                {
                                                                                    spec.unitSpecification
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    <div className="flex items-center gap-2 bg-primary/10 p-2 rounded-md">
                                                                        <Package className="h-4 w-4 text-primary shrink-0" />
                                                                        <span className="text-xs text-primary font-medium">
                                                                            Số lượng:
                                                                        </span>
                                                                        <span className="text-xs font-semibold">
                                                                            {getQuantityDisplay(
                                                                                item.expectedQuantity,
                                                                                spec,
                                                                                unit,
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    )}
                </div>

                {/* Sidebar - 1/3 width on desktop */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader
                            className={cn('pb-4', {
                                'bg-yellow-500/10':
                                    requestStatusColor[requestDetail.status] === 'yellow',
                                'bg-green-500/10':
                                    requestStatusColor[requestDetail.status] === 'green',
                                'bg-red-500/10': requestStatusColor[requestDetail.status] === 'red',
                                'bg-gray-500/10':
                                    requestStatusColor[requestDetail.status] === 'gray',
                            })}
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className={cn('h-3 w-3 rounded-full', {
                                        'bg-yellow-500':
                                            requestStatusColor[requestDetail.status] === 'yellow',
                                        'bg-green-500':
                                            requestStatusColor[requestDetail.status] === 'green',
                                        'bg-red-500':
                                            requestStatusColor[requestDetail.status] === 'red',
                                        'bg-gray-500':
                                            requestStatusColor[requestDetail.status] === 'gray',
                                    })}
                                />
                                <CardTitle className="text-lg font-semibold">
                                    Trạng thái phiếu
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Hiện tại:</span>
                                <Badge
                                    variant="outline"
                                    className={cn('px-3 py-1 text-sm', {
                                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20':
                                            requestStatusColor[requestDetail.status] === 'yellow',
                                        'bg-green-500/10 text-green-500 border-green-500/20':
                                            requestStatusColor[requestDetail.status] === 'green',
                                        'bg-red-500/10 text-red-500 border-red-500/20':
                                            requestStatusColor[requestDetail.status] === 'red',
                                        'bg-gray-500/10 text-gray-500 border-gray-500/20':
                                            requestStatusColor[requestDetail.status] === 'gray',
                                    })}
                                >
                                    {getStatusIcon(requestDetail.status)}
                                    {requestStatusLabels[requestDetail.status]}
                                </Badge>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                        Loại phiếu
                                    </span>
                                    <span className="text-sm font-medium">
                                        {getRequestType(requestDetail)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Ngày tạo</span>
                                    <span className="text-sm font-medium">
                                        {formatDate(requestDetail.createdWhen)}
                                    </span>
                                </div>

                                {requestDetail.taskRequests?.length > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">
                                            Mức độ ưu tiên
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={cn('px-2 py-0.5 text-xs', {
                                                'bg-red-500/10 text-red-500 border-red-500/20':
                                                    getPriorityText(
                                                        requestDetail.taskRequests[0].priority,
                                                    ).color === 'red',
                                                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20':
                                                    getPriorityText(
                                                        requestDetail.taskRequests[0].priority,
                                                    ).color === 'yellow',
                                                'bg-green-500/10 text-green-500 border-green-500/20':
                                                    getPriorityText(
                                                        requestDetail.taskRequests[0].priority,
                                                    ).color === 'green',
                                                'bg-gray-500/10 text-gray-500 border-gray-500/20':
                                                    getPriorityText(
                                                        requestDetail.taskRequests[0].priority,
                                                    ).color === 'gray',
                                            })}
                                        >
                                            {
                                                getPriorityText(
                                                    requestDetail.taskRequests[0].priority,
                                                ).text
                                            }
                                        </Badge>
                                    </div>
                                )}

                                {requestDetail.inventoryRequests?.length > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">
                                            Số sản phẩm
                                        </span>
                                        <span className="text-sm font-medium">
                                            {
                                                requestDetail.inventoryRequests[0]
                                                    .inventoryRequestDetails.length
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end pt-2 pb-4">
                            <Button variant="outline" onClick={() => router.back()}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Quay lại
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Quick Actions Card */}
                    {requestDetail.status !== RequestStatus.REJECTED && (
                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-primary/5 pb-4">
                                <div className="flex items-center gap-2">
                                    <Info className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg font-semibold">
                                        Thao tác nhanh
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    {/* <Button className="w-full justify-start" variant="outline">
                                    <Package className="h-4 w-4 mr-2" />
                                    Xem lịch sử phiếu
                                </Button> */}

                                    {requestDetail.status === RequestStatus.APPROVED && (
                                        <Button
                                            className="w-full justify-start"
                                            variant="outline"
                                            onClick={handleCreateInventoryReceipt}
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            Tạo phiếu nhập/xuất
                                        </Button>
                                    )}

                                    {requestDetail.status === RequestStatus.PENDING && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className="w-full justify-start"
                                                    variant="outline"
                                                    disabled={mutation.isPending}
                                                >
                                                    {mutation.isPending ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <PackageCheck className="h-4 w-4 mr-2" />
                                                    )}
                                                    Duyệt/Từ chối phiếu
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Lý do</DialogTitle>
                                                    <DialogDescription>
                                                        Hãy nhập lý do tại sao bạn muốn duyệt hay từ
                                                        chối
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <Textarea
                                                    id="notes"
                                                    onChange={(e) => setNotes(e.target.value)}
                                                />
                                                <DialogFooter>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleApproveRequest(
                                                                RequestStatus.APPROVED,
                                                            )
                                                        }
                                                        className="text-green-500 hover:bg-green-500 hover:text-white"
                                                    >
                                                        <CheckCheck className="w-4 h-4" />
                                                        Duyệt
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleApproveRequest(
                                                                RequestStatus.REJECTED,
                                                            )
                                                        }
                                                        className="text-red-500 hover:bg-red-500 hover:text-white"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Từ chối
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

// Mock data for demonstration
// const mockRequestDetail: RequestDetail = {
//     requestId: 'REQ-2023-001',
//     status: 0,
//     createdWhen: '2023-06-15T08:00:00',
//     taskRequests: [
//         {
//             taskRequestId: 'TASK-001',
//             title: 'Báo cáo tình trạng sức khỏe đàn gà',
//             priority: 2,
//             description:
//                 'Đàn gà tại khu vực A có dấu hiệu bất thường. Một số con có biểu hiện kém ăn, giảm cân và có dấu hiệu của bệnh hô hấp. Cần kiểm tra và đánh giá tình trạng sức khỏe của toàn đàn.\n\nCác triệu chứng cụ thể:\n- Giảm lượng thức ăn tiêu thụ\n- Thở khó khăn\n- Giảm cân\n- Giảm sản lượng trứng',
//             imageUrl: [
//                 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=500&auto=format&fit=crop',
//                 'https://images.unsplash.com/photo-1569428034239-f9565e32e224?q=80&w=500&auto=format&fit=crop',
//                 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?q=80&w=500&auto=format&fit=crop',
//                 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?q=80&w=500&auto=format&fit=crop',
//             ],
//         },
//     ],
//     inventoryRequests: [],
// };
