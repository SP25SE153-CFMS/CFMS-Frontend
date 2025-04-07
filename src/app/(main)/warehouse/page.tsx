'use client';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getWareByFarmId, getWarehouses } from '@/services/warehouse.service';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { wareStatusLabels, wareStatusVariant } from '@/utils/enum/status.enum';
import { Package, Info, Scale, Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getCookie } from 'cookies-next';
import config from '@/configs';
import { WareStockResponse } from '@/utils/types/custom.type';
import { useRouter } from 'next/navigation';

export default function Ware() {
    const router = useRouter();
    const farmId = getCookie(config.cookies.farmId) ?? '';

    const { data: wares = [], isLoading } = useQuery<WareStockResponse[]>({
        queryKey: ['wares', farmId],
        queryFn: () => getWareByFarmId(farmId),
        enabled: !!farmId,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
            </div>
        );
    }

    if (!wares) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Card className="px-8 py-8 md:px-36">
                    <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                        <Image
                            src="/no-data.jpg"
                            width={300}
                            height={300}
                            alt="Not Found"
                            className="object-contain"
                        />
                        <h1 className="text-2xl font-bold">Danh sách không tồn tại</h1>
                        <Button variant="outline" onClick={() => window.history.back()}>
                            Quay lại
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const navigateResourceType = (
        resourceTypeName: string,
        wareId: string,
        resourceTypeId: string,
    ) => {
        let route = '';
        switch (resourceTypeName) {
            case 'Thực phẩm':
                route = '/warehouse/foods';
                break;
            case 'Thiết bị':
                route = '/warehouse/vaccines';
                break;
            case 'Dược phẩm':
                route = '/equipment';
                break;
        }
        const url = `${route}?w=${wareId}&r=${resourceTypeId}`;
        router.push(url);
    };

    return (
        <div className="flex flex-col gap-y-5">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">Danh sách kho</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wares.map((ware, index) => {
                    // Calculate percentages for visual indicators
                    const quantityPercentage = Math.min(
                        100,
                        (ware.currentQuantity / ware.maxQuantity) * 100,
                    );
                    const weightPercentage = Math.min(
                        100,
                        (ware.currentWeight / ware.maxWeight) * 100,
                    );

                    return (
                        <Card
                            key={index}
                            className="overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <CardHeader className="pb-2 bg-muted/30">
                                <CardTitle className="flex justify-between items-center">
                                    <span className="truncate">{ware.warehouseName}</span>
                                    <Badge variant={wareStatusVariant[ware.status]}>
                                        {wareStatusLabels[ware.status]}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <Info size={16} className="mt-1 shrink-0" />
                                        <p className="line-clamp-2">
                                            {ware.description || 'Không có mô tả'}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-1.5 text-sm font-medium">
                                                    <Package size={16} />
                                                    <span>Số lượng</span>
                                                </div>
                                                <span className="text-sm">
                                                    {ware.currentQuantity}/{ware.maxQuantity}
                                                </span>
                                            </div>
                                            <Progress value={quantityPercentage} className="h-2" />
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-1.5 text-sm font-medium">
                                                    <Scale size={16} />
                                                    <span>Khối lượng</span>
                                                </div>
                                                <span className="text-sm">
                                                    {ware.currentWeight}/{ware.maxWeight}
                                                </span>
                                            </div>
                                            <Progress value={weightPercentage} className="h-2" />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center gap-2 pt-2">
                                        <div className="text-sm font-medium">
                                            {ware.resourceTypeName}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                navigateResourceType(
                                                    ware.resourceTypeName,
                                                    ware.wareId,
                                                    ware.resourceTypeId,
                                                )
                                            }
                                        >
                                            Chi tiết
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
