'use client';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getWareByFarmId } from '@/services/warehouse.service';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { wareStatusLabels, wareStatusVariant } from '@/utils/enum/status.enum';
import { Info, ArrowRight } from 'lucide-react';
import { getCookie } from 'cookies-next';
import config from '@/configs';
import type { WareStockResponse } from '@/utils/types/custom.type';
import { useRouter } from 'next/navigation';

export default function Ware() {
    const router = useRouter();
    const farmId = getCookie(config.cookies.farmId) ?? '';

    const { data: wares = [], isLoading } = useQuery<WareStockResponse[]>({
        queryKey: ['wares', farmId],
        queryFn: () => getWareByFarmId(farmId),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
            </div>
        );
    }

    if (!wares || wares.length === 0) {
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
            case 'Dược phẩm':
                route = '/warehouse/medicines';
                break;
            case 'Thiết bị':
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wares.map((ware, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3 bg-muted/30">
                            <CardTitle className="flex justify-between items-center">
                                <span className="truncate text-xl">{ware.warehouseName}</span>
                                <Badge
                                    variant={wareStatusVariant[ware.status]}
                                    className="text-sm px-5 py-1 flex items-center"
                                >
                                    {wareStatusLabels[ware.status]}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-6">
                                <div className="flex items-start gap-3 text-muted-foreground">
                                    <Info size={20} className="mt-1 shrink-0" />
                                    <p className="line-clamp-2 text-base">
                                        {ware.description || 'Không có mô tả'}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center gap-2 pt-2">
                                    <div className="text-base font-medium">
                                        Loại: {ware.resourceTypeName}
                                    </div>
                                    <Button
                                        variant="default"
                                        size="default"
                                        className="gap-2 text-base font-medium hover:gap-3 transition-all"
                                        onClick={() =>
                                            navigateResourceType(
                                                ware.resourceTypeName,
                                                ware.wareId,
                                                ware.resourceTypeId,
                                            )
                                        }
                                    >
                                        Chi tiết
                                        <ArrowRight size={20} />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
