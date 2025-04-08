'use client';

import {
    BarChart3,
    Calendar,
    ClipboardList,
    Database,
    FileText,
    Info,
    InfoIcon,
    Tag,
    TrendingUp,
    Type,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import dayjs from 'dayjs';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { chickenBatchStatusLabels, chickenBatchStatusVariant } from '@/utils/enum/status.enum';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import CardVaccinationLog from './components/vaccine/card';
import { getChickenBatchById } from '@/services/chicken-batch.service';
import { useQuery } from '@tanstack/react-query';
import { chickenBatchIndicators } from '@/utils/data/table.data';
import CardNutritionPlan from './components/nutrition/card';
import CardHealthLog from './components/health/card';
import CardQuantityLog from './components/quantity/card';
import CardFeedLog from './components/feed/card';
import { useEffect, useState } from 'react';
import { Stepper } from '@/components/ui/stepper';
import { Chart } from './chart';
import { getChickenType } from '@/utils/functions/category.function';
import InfoItem from '@/components/info-item';
import { Button } from '@/components/ui/button';
import ChickenDetailsDialog from '@/components/chicken-details-dialog';
import { GrowthStage } from '@/utils/schemas/growth-stage.schema';
export default function Page() {
    const { chickenBatchId }: { chickenBatchId: string } = useParams();

    const { data: chickenBatch, isLoading } = useQuery({
        queryKey: ['chickenBatch', chickenBatchId],
        queryFn: () => getChickenBatchById(chickenBatchId),
        enabled: !!chickenBatchId,
    });

    const chicken = chickenBatch?.chicken;

    const [currentGrowthStage, setCurrentGrowthStage] = useState<GrowthStage | null>(
        chickenBatch?.growthBatches[0]?.growthStage || null,
    );

    useEffect(() => {
        setCurrentGrowthStage(chickenBatch?.growthBatches[0]?.growthStage || null);
    }, [chickenBatch]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
            </div>
        );
    }

    if (!chickenBatch) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Không tìm thấy lứa nuôi</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    Thông tin lứa nuôi
                    <span className="text-primary ml-2">{chickenBatch.chickenBatchName}</span>
                </h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 my-6">
                <div className="flex flex-col gap-4">
                    {/* Chicken Batch Details */}
                    <Card>
                        <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                    Thông tin chi tiết
                                </h3>
                            </div>
                            <InfoItem
                                label="Trạng thái"
                                value={
                                    chickenBatch?.status ? (
                                        <Badge
                                            variant={
                                                chickenBatchStatusVariant[chickenBatch?.status]
                                            }
                                        >
                                            {chickenBatchStatusLabels[chickenBatch?.status]}
                                        </Badge>
                                    ) : (
                                        '-'
                                    )
                                }
                                icon={<TrendingUp size={16} />}
                            />

                            <InfoItem
                                label="Ngày bắt đầu"
                                value={dayjs(chickenBatch?.startDate).format('DD/MM/YYYY')}
                                icon={<Calendar size={16} />}
                            />

                            <InfoItem
                                label="Ngày kết thúc"
                                value={
                                    chickenBatch?.endDate
                                        ? dayjs(chickenBatch?.endDate).format('DD/MM/YYYY')
                                        : 'Chưa kết thúc'
                                }
                                icon={<Calendar size={16} />}
                            />

                            <InfoItem
                                label="Ghi chú"
                                value={chickenBatch?.note || 'Không có ghi chú'}
                                icon={<FileText size={16} />}
                            />
                        </div>
                    </Card>

                    {/* Chicken Details */}
                    <Card>
                        {chicken ? (
                            <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                        Thông tin giống gà
                                    </h3>
                                </div>

                                <InfoItem
                                    icon={<Tag className="h-4 w-4" />}
                                    label="Mã gà"
                                    value={chicken?.chickenCode || 'Không có mã gà'}
                                />

                                <InfoItem
                                    icon={<ClipboardList className="h-4 w-4" />}
                                    label="Tên gà"
                                    value={chicken?.chickenName || 'Không có tên gà'}
                                />

                                {/* <InfoItem
                                    icon={<Egg className="h-4 w-4" />}
                                    label="Tổng số lượng"
                                    value={
                                        chicken?.totalQuantity !== undefined
                                            ? chicken?.totalQuantity.toString()
                                            : 'Không có số lượng'
                                    }
                                /> */}

                                <InfoItem
                                    icon={<FileText className="h-4 w-4" />}
                                    label="Mô tả"
                                    value={chicken?.description || 'Không có mô tả'}
                                />

                                <InfoItem
                                    icon={<Type className="h-4 w-4" />}
                                    label="Loại gà"
                                    value={getChickenType(chicken?.chickenTypeId)}
                                />

                                <InfoItem
                                    icon={<InfoIcon className="h-4 w-4" />}
                                    label="Trạng thái"
                                    value={
                                        chicken?.status ? (
                                            <Badge
                                                variant={chickenBatchStatusVariant[chicken?.status]}
                                            >
                                                {chickenBatchStatusLabels[chicken?.status]}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )
                                    }
                                />

                                <ChickenDetailsDialog
                                    trigger={
                                        <Button variant="outline" className="w-full group">
                                            <Info
                                                size={16}
                                                className="mr-2 group-hover:text-primary transition-colors"
                                            />
                                            <span>Xem chi tiết</span>
                                        </Button>
                                    }
                                    chickenDetails={chickenBatch?.chickenDetails}
                                />
                            </div>
                        ) : (
                            <Card className="w-full">
                                <CardContent className="flex items-center justify-center p-6">
                                    <div className="text-center">
                                        <Info className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                                        <h3 className="text-lg font-medium">
                                            Không có thông tin giống gà
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </Card>
                </div>
                <div className="col-span-2">
                    {/* Technical Indicators */}
                    <Card>
                        <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                            <div className="mb-3">
                                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                    <BarChart3 size={20} className="text-primary" />
                                    Chỉ số kỹ thuật
                                </h2>
                                <p className="text-muted-foreground text-sm">
                                    Theo dõi các chỉ số kỹ thuật quan trọng của chuồng nuôi
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-between">
                                {chickenBatchIndicators.map((indicator) => (
                                    <div
                                        key={indicator.id}
                                        className="flex flex-auto p-2 border gap-2 items-center"
                                    >
                                        <Database size={24} className="text-primary" />
                                        <div>
                                            <h4 className="text-xs uppercase font-semibold">
                                                {indicator.name}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                {indicator.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Tabs defaultValue="vaccine" className="w-auto mt-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="vaccine">Tiêm phòng</TabsTrigger>
                            <TabsTrigger value="health">Sức khỏe</TabsTrigger>
                            <TabsTrigger value="quantity">Số lượng</TabsTrigger>
                            <TabsTrigger value="feed">Lịch sử cho ăn</TabsTrigger>
                        </TabsList>
                        <TabsContent value="vaccine">
                            <CardVaccinationLog vaccineLogs={chickenBatch?.vaccineLogs} />
                        </TabsContent>
                        <TabsContent value="health">
                            <CardHealthLog healthLogs={chickenBatch?.healthLogs} />
                        </TabsContent>
                        <TabsContent value="quantity">
                            <CardQuantityLog quantityLogs={chickenBatch?.quantityLogs} />
                        </TabsContent>
                        <TabsContent value="feed">
                            <CardFeedLog feedLogs={chickenBatch?.feedLogs} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <Stepper
                steps={chickenBatch?.growthBatches
                    .map((batch) => batch.growthStage.stageName)
                    .reverse()}
                activeStep={
                    chickenBatch?.growthBatches.findIndex((batch) => batch.status === 1) || 0
                }
                visitStep={chickenBatch?.growthBatches.findIndex(
                    (batch) => batch.growthStageId === currentGrowthStage?.growthStageId,
                )}
                onStepClick={(step) =>
                    setCurrentGrowthStage(chickenBatch?.growthBatches[step].growthStage)
                }
                className="mb-4 max-w-3xl mx-auto"
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 my-6">
                <div>
                    {currentGrowthStage?.nutritionPlanId && (
                        <CardNutritionPlan nutritionPlanId={currentGrowthStage?.nutritionPlanId} />
                    )}
                </div>
                <div className="col-span-2">
                    <Chart />
                </div>
            </div>
        </div>
    );
}
