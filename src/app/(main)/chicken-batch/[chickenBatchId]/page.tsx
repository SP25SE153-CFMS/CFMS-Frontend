'use client';

import {
    AlertCircle,
    BarChart3,
    Calendar,
    ChevronLeft,
    ClipboardList,
    Database,
    Egg,
    ExternalLink,
    FileText,
    Info,
    InfoIcon,
    SplitSquareVertical,
    Sprout,
    Tag,
    TrendingUp,
    Type,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { chickenBatchStatusLabels, chickenBatchStatusVariant } from '@/utils/enum/status.enum';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import CardVaccineLog from './components/vaccine/card';
import { getChickenBatchById } from '@/services/chicken-batch.service';
import { useQuery } from '@tanstack/react-query';
import CardNutritionPlan from './components/nutrition/card';
import CardHealthLog from './components/health/card';
import CardQuantityLog from './components/quantity/card';
import CardFeedLog from './components/feed/card';
import { useEffect, useMemo, useState } from 'react';
import { Stepper } from '@/components/ui/stepper';
import { Chart } from './chart';
import { getChickenType } from '@/utils/functions/category.function';
import InfoItem from '@/components/info-item';
import { Button } from '@/components/ui/button';
import ChickenDetailsDialog from '@/components/chicken-details-dialog';
import {
    Dialog,
    DialogDescription,
    DialogTitle,
    DialogHeader,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog';
import SplitChickenBatchForm from '@/components/forms/split-chicken-batch-form';
import { GrowthStageResponse } from '@/utils/types/custom.type';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { calculateDuration } from '@/utils/functions';
import ExportChickenForm from '@/components/forms/export-chicken-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getTasksByFarmId } from '@/services/task.service';
import { getCookie } from 'cookies-next';
import config from '@/configs';

export default function Page() {
    const router = useRouter();
    const { chickenBatchId }: { chickenBatchId: string } = useParams();

    const [openSplit, setOpenSplit] = useState(false);
    const [openExport, setOpenExport] = useState(false);

    const { data: chickenBatch, isLoading } = useQuery({
        queryKey: ['chickenBatch', chickenBatchId],
        queryFn: async () => {
            const data = await getChickenBatchById(chickenBatchId);
            sessionStorage.setItem('chickenDetails', JSON.stringify(data.chickenDetails));
            return data;
        },
        enabled: !!chickenBatchId,
    });

    const farmId = getCookie(config.cookies.farmId) as string;

    useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const tasks = await getTasksByFarmId(farmId);
            sessionStorage.setItem('tasks', JSON.stringify(tasks));
            return tasks;
        },
    });

    const chicken = chickenBatch?.chicken;

    const [currentGrowthStage, setCurrentGrowthStage] = useState<GrowthStageResponse | null>(
        chickenBatch?.growthBatches[0]?.growthStage || null,
    );

    useEffect(() => {
        setCurrentGrowthStage(chickenBatch?.growthBatches[0]?.growthStage || null);
    }, [chickenBatch]);

    const isReadyToExport = useMemo(() => {
        if (!chickenBatch) return false;
        const duration = calculateDuration(chickenBatch.startDate, null);
        return duration >= chickenBatch?.minGrowDays;
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

    const sortedGrowthBatches = chickenBatch?.growthBatches.sort(
        (a, b) => a.growthStage.minAgeWeek - b.growthStage.minAgeWeek,
    );

    const chickenBatchIndicators = [
        { id: 1, name: 'GÀ CHẾT', value: `${chickenBatch.deadthChicken ?? 0} con` },
        { id: 2, name: 'GÀ SỐNG', value: `${chickenBatch.aliveChicken ?? 0} con` },
        { id: 3, name: 'TỔNG ĐÀN', value: `${chickenBatch.totalChicken ?? 0} con` },
        {
            id: 4,
            name: 'BIẾN ĐỘNG',
            value: `${chickenBatch.quantityLogs?.reduce((acc, curr) => acc + curr.quantity, 0) ?? 0} con`,
        },
    ];

    const remainingQuantity = chickenBatch?.chickenDetails.reduce(
        (acc, curr) => acc + curr.quantity,
        0,
    );

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    Thông tin lứa nuôi
                    <span className="text-primary ml-2">{chickenBatch.chickenBatchName}</span>
                </h1>

                <Button variant="outline" onClick={() => router.push(config.routes.task)}>
                    <ChevronLeft className="h-4 w-4" />
                    Quay lại
                </Button>
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
                                    chickenBatch?.status || chickenBatch?.status === 0 ? (
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
                                label="Số ngày nuôi tối thiểu"
                                value={`${chickenBatch?.minGrowDays} ngày`}
                                icon={<Sprout size={16} />}
                            />

                            <InfoItem
                                label="Số ngày nuôi tối đa"
                                value={`${chickenBatch?.maxGrowDays} ngày`}
                                icon={<Sprout size={16} />}
                            />

                            <InfoItem
                                label="Ghi chú"
                                value={chickenBatch?.note || 'Không có ghi chú'}
                                icon={<FileText size={16} />}
                            />
                        </div>

                        <CardFooter className="flex flex-col gap-2">
                            {isReadyToExport && (
                                <Dialog open={openExport} onOpenChange={setOpenExport}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full gap-2"
                                            disabled={remainingQuantity === 0}
                                        >
                                            <ExternalLink size={16} />
                                            Xuất chuồng
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                        <DialogHeader>
                                            <DialogTitle>Xuất chuồng</DialogTitle>
                                            <DialogDescription>
                                                Hãy nhập các thông tin dưới đây để xuất chuồng
                                            </DialogDescription>
                                        </DialogHeader>
                                        <ExportChickenForm
                                            closeDialog={() => setOpenExport(false)}
                                        />
                                    </DialogContent>
                                </Dialog>
                            )}
                            <Dialog open={openSplit} onOpenChange={setOpenSplit}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="default"
                                        className="w-full gap-2"
                                        disabled={remainingQuantity === 0}
                                    >
                                        <SplitSquareVertical size={16} />
                                        Tách lứa nuôi
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                        <DialogTitle className="flex">
                                            <SplitSquareVertical className="w-5 h-5 mr-2 text-primary" />
                                            Tách lứa nuôi
                                        </DialogTitle>
                                        <DialogDescription>
                                            Hãy nhập các thông tin dưới đây để tách lứa nuôi
                                        </DialogDescription>
                                    </DialogHeader>
                                    <ScrollArea className="max-h-[600px]">
                                        <SplitChickenBatchForm
                                            closeDialog={() => setOpenSplit(false)}
                                        />
                                    </ScrollArea>
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
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
                                    label="Mã giống gà"
                                    value={chicken?.chickenCode || 'Không có mã giống gà'}
                                />

                                <InfoItem
                                    icon={<ClipboardList className="h-4 w-4" />}
                                    label="Tên gà"
                                    value={chicken?.chickenName || 'Không có tên gà'}
                                />

                                <InfoItem
                                    icon={<Egg className="h-4 w-4" />}
                                    label="Tổng số lượng"
                                    value={chickenBatch?.initChickenQuantity + ' con'}
                                />

                                <InfoItem
                                    icon={<Egg className="h-4 w-4" />}
                                    label="Số lượng còn lại"
                                    value={remainingQuantity + ' con'}
                                />

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
                                        chicken?.status || chicken?.status === 0 ? (
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
                    {/* Alert for export chicken */}
                    {isReadyToExport && remainingQuantity !== 0 && (
                        <Alert variant="default" className="border-blue-500/50 text-blue-600 mb-4">
                            <AlertCircle className="h-4 w-4 text-blue-600" color="blue" />
                            <AlertTitle className="font-bold">Thông báo xuất chuồng</AlertTitle>
                            <AlertDescription>
                                Ngày nuôi đã đạt đến số ngày nuôi tối thiếu. Bạn có thể xuất chuồng
                                nếu muốn.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Alert for remaining quantity = 0 */}
                    {remainingQuantity === 0 && (
                        <Alert variant="default" className="border-blue-500/50 text-blue-600 mb-4">
                            <AlertCircle className="h-4 w-4 text-blue-600" color="blue" />
                            <AlertTitle className="font-bold">
                                Không thể xuất chuồng/tách lứa nuôi
                            </AlertTitle>
                            <AlertDescription>
                                Số lượng gà còn lại là 0. Bạn không thể xuất chuồng hoặc tách lứa
                                nuôi.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Technical Indicators */}
                    <Card>
                        <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                            <div className="mb-3">
                                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                    <BarChart3 size={20} className="text-primary" />
                                    Chỉ số kỹ thuật
                                </h2>
                                <p className="text-muted-foreground text-sm">
                                    Theo dõi các chỉ số kỹ thuật quan trọng của lứa nuôi
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
                            <CardVaccineLog vaccineLogs={chickenBatch?.vaccineLogs} />
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
                steps={sortedGrowthBatches.map((batch) => batch.growthStage.stageName)}
                activeStep={sortedGrowthBatches.findIndex(
                    (batch) => batch.growthStageId === chickenBatch.currentStageId,
                )}
                visitStep={sortedGrowthBatches.findIndex(
                    (batch) => batch.growthStageId === currentGrowthStage?.growthStageId,
                )}
                onStepClick={(step) => setCurrentGrowthStage(sortedGrowthBatches[step].growthStage)}
                className="mb-4 max-w-3xl mx-auto"
            />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 my-6">
                <div className="lg:col-span-2">
                    <CardNutritionPlan
                        nutritionPlanId={currentGrowthStage?.nutritionPlanId ?? ''}
                    />
                </div>
                <div className="lg:col-span-3">
                    <Chart chickenBatchId={chickenBatchId} />
                </div>
            </div>
        </div>
    );
}
