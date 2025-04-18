'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from '@/components/fallback-image';
import { getCookie } from 'cookies-next';
import { Info, ArrowRight, Wheat, BriefcaseMedical, Wrench, Warehouse, Plus } from 'lucide-react';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { wareStatusLabels, wareStatusVariant } from '@/utils/enum/status.enum';
import { getWareByFarmId } from '@/services/warehouse.service';
import type { WareStockResponse } from '@/utils/types/custom.type';
import config from '@/configs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import WarehouseForm from '@/components/forms/warehouse-form';
import { useState } from 'react';

export default function Ware() {
    const [open, setOpen] = useState(false);
    const openModal = () => setOpen(true);
    const onOpenChange = (val: boolean) => setOpen(val);

    const router = useRouter();
    const farmId = getCookie(config.cookies.farmId) ?? '';

    const { data: wares = [], isLoading } = useQuery<WareStockResponse[]>({
        queryKey: ['wares', farmId],
        queryFn: async () => {
            const wares = await getWareByFarmId(farmId as string);
            sessionStorage.setItem('wares', JSON.stringify(wares));
            return wares;
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <LoadingSpinner className="w-10 h-10" />
            </div>
        );
    }

    if (!wares || wares.length === 0) {
        return (
            <div className="w-full h-[70vh] flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-md">
                    <CardContent className="flex flex-col items-center justify-center pt-6 pb-8 space-y-6">
                        <div className="relative w-48 h-48">
                            <Image
                                src="/no-data.jpg"
                                fill
                                alt="Không tìm thấy dữ liệu"
                                className="object-contain"
                            />
                        </div>
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold">Danh sách không tồn tại</h1>
                            <p className="text-muted-foreground">
                                Không tìm thấy dữ liệu kho trong trang trại này
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="px-6"
                            >
                                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                                Quay lại
                            </Button>
                            <Button className="space-x-1" onClick={openModal}>
                                <span>Tạo kho</span> <Plus size={18} />
                            </Button>
                            <Dialog open={open} onOpenChange={onOpenChange}>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Tạo kho mới</DialogTitle>
                                        <DialogDescription>
                                            Hãy nhập các thông tin dưới đây.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <ScrollArea className="max-h-[600px]">
                                        <WarehouseForm closeDialog={() => setOpen(false)} />
                                    </ScrollArea>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const navigateResourceType = (
        resourceTypeName: string,
        wareId: string,
        resourceTypeId: string,
    ) => {
        // Lưu vào sessionStorage
        sessionStorage.setItem('wareId', wareId);
        sessionStorage.setItem('resourceTypeId', resourceTypeId);

        // Chuyển route như cũ
        let route = '';
        switch (resourceTypeName) {
            case 'Thực phẩm':
                route = config.routes.food;
                break;
            case 'Dược phẩm':
                route = config.routes.medicine;
                break;
            case 'Thiết bị':
                route = config.routes.equipment;
                break;
            case 'Con giống':
                route = config.routes.breeding;
                break;
            case 'Sản phẩm thu hoạch':
                route = config.routes.harvest;
                break;
            default:
                route = config.routes.commonWarehouse;
        }
        const url = `${route}?w=${wareId}&r=${resourceTypeId}`;
        router.push(url);
    };

    const getResourceIcon = (resourceTypeName: string) => {
        switch (resourceTypeName) {
            case 'Thực phẩm':
                return <Wheat className="w-5 h-5 text-green-600" />;
            case 'Dược phẩm':
                return <BriefcaseMedical className="w-5 h-5 text-blue-600" />;
            case 'Thiết bị':
                return <Wrench className="w-5 h-5 text-amber-600" />;
            default:
                return <Warehouse className="w-5 h-5 text-slate-600" />;
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 mb-2">
                    <Warehouse className="h-6 w-6 text-muted-foreground" />
                    <h1 className="text-2xl font-bold tracking-tight">Danh sách kho</h1>
                </div>

                <Button className="space-x-1" onClick={openModal}>
                    <span>Tạo kho</span> <Plus size={18} />
                </Button>
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Tạo kho mới</DialogTitle>
                            <DialogDescription>Hãy nhập các thông tin dưới đây.</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-[600px]">
                            <WarehouseForm closeDialog={() => setOpen(false)} />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>
            <Separator className="mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wares.map((ware, index) => (
                    <Card
                        key={index}
                        className="overflow-hidden border border-muted hover:shadow-md transition-all duration-300 flex flex-col"
                    >
                        <CardHeader className="pb-2 space-y-0 bg-muted/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getResourceIcon(ware.resourceTypeName)}
                                    <CardTitle className="text-lg font-semibold line-clamp-1">
                                        {ware.warehouseName}
                                    </CardTitle>
                                </div>
                                <Badge
                                    variant={wareStatusVariant[ware.status]}
                                    className="text-xs px-3 py-1 ml-2 whitespace-nowrap"
                                >
                                    {wareStatusLabels[ware.status]}
                                </Badge>
                            </div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-4 flex-grow">
                            <div className="flex items-start gap-3 text-muted-foreground mb-4">
                                <Info
                                    size={18}
                                    className="mt-0.5 shrink-0 text-muted-foreground/70"
                                />
                                <p className="line-clamp-3 text-sm">
                                    {ware.description || 'Không có mô tả'}
                                </p>
                            </div>
                            <div className="text-sm font-medium text-muted-foreground mt-2">
                                Loại:{' '}
                                <span className="text-foreground">{ware.resourceTypeName}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2 pb-4 bg-muted/10">
                            <Button
                                variant="default"
                                size="sm"
                                className="w-full gap-1 group"
                                onClick={() =>
                                    navigateResourceType(
                                        ware.resourceTypeName,
                                        ware.wareId,
                                        ware.resourceTypeId,
                                    )
                                }
                            >
                                Chi tiết
                                <ArrowRight
                                    size={16}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
