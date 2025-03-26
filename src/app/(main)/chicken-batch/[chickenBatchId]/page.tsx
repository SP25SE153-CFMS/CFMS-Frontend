'use client';

import { AlignRight, Database } from 'lucide-react';
import { useParams } from 'next/navigation';
import dayjs from 'dayjs';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { chickenBatchStatusLabels, chickenBatchStatusVariant } from '@/utils/enum/status.enum';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import CardVaccinationLog from './components/vaccine/card';
import { getChickenBatchById } from '@/services/chicken-batch.service';
import { useQuery } from '@tanstack/react-query';
import { chickenBatchIndicators } from '@/utils/data/table.data';
import CardFlockNutrition from './components/nutrition/card';
import CardHealthLog from './components/health/card';
import CardQuantityLog from './components/quantity/card';
import CardFeedLog from './components/feed/card';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import PopoverWithOverlay from '@/components/popover-with-overlay';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Stepper } from '@/components/ui/stepper';
import { Chart } from './chart';

export default function Page() {
    const { chickenBatchId }: { chickenBatchId: string } = useParams();

    const { data: chickenBatch, isLoading } = useQuery({
        queryKey: ['chickenBatch', chickenBatchId],
        queryFn: () => getChickenBatchById(chickenBatchId),
        enabled: !!chickenBatchId,
    });

    const [chickenId, setChickenId] = useState(chickenBatch?.chickens[0].chickenId);
    const currentChicken =
        chickenBatch?.chickens.find((chicken) => chicken.chickenId === chickenId) ||
        chickenBatch?.chickens[0];

    const [visitStep, setVisitStep] = useState(-1);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />;
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
                            <div className="flex gap-3 text-sm mb-4 justify-between">
                                Trạng thái:{' '}
                                {chickenBatch?.status ? (
                                    <Badge
                                        variant={chickenBatchStatusVariant[chickenBatch?.status]}
                                    >
                                        {chickenBatchStatusLabels[chickenBatch?.status]}
                                    </Badge>
                                ) : (
                                    '-'
                                )}
                            </div>
                            <div className="flex gap-3 text-sm mb-4">
                                Ngày bắt đầu:{' '}
                                <strong className="flex-1 text-right">
                                    {dayjs(chickenBatch?.startDate).format('DD/MM/YYYY')}
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-4">
                                Ngày kết thúc:{' '}
                                <strong className="flex-1 text-right">
                                    {chickenBatch?.endDate
                                        ? dayjs(chickenBatch?.endDate).format('DD/MM/YYYY')
                                        : 'Chưa kết thúc'}
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-4">
                                Ghi chú:{' '}
                                <strong className="flex-1 text-right">
                                    {chickenBatch?.note || 'Không có ghi chú'}
                                </strong>
                            </div>
                        </div>
                    </Card>

                    {/* Chicken Details */}
                    <Card>
                        <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                    Thông tin giống gà
                                </h3>
                                <PopoverWithOverlay>
                                    <PopoverTrigger>
                                        <AlignRight size={20} />
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Select
                                            defaultValue={chickenId}
                                            onValueChange={(id) => setChickenId(id)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Đổi giống gà..." />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-72">
                                                {chickenBatch.chickens.map((chicken) => (
                                                    <SelectItem
                                                        key={chicken.chickenId}
                                                        value={chicken.chickenId}
                                                    >
                                                        {chicken.chickenName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </PopoverContent>
                                </PopoverWithOverlay>
                            </div>

                            <div className="flex gap-3 text-sm mb-4 justify-between">
                                Mã gà:{' '}
                                <strong className="flex-1 text-right">
                                    {currentChicken?.chickenCode || 'Không có mã gà'}
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-4 justify-between">
                                Tên gà:{' '}
                                <strong className="flex-1 text-right">
                                    {currentChicken?.chickenName || 'Không có tên gà'}
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-4 justify-between">
                                Tổng số lượng:{' '}
                                <strong className="flex-1 text-right">
                                    {currentChicken?.totalQuantity !== undefined
                                        ? currentChicken?.totalQuantity
                                        : 'Không có số lượng'}
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-4 justify-between">
                                Mô tả:{' '}
                                <strong className="flex-1 text-right">
                                    {currentChicken?.description || 'Không có mô tả'}
                                </strong>
                            </div>
                            {/* <div className="flex gap-3 text-sm mb-4 justify-between">
                                ID mục đích:{' '}
                                <strong className="flex-1 text-right">
                                    {currentChicken?.purposeId || 'Không có ID mục đích'}
                                </strong>
                            </div> */}
                            <div className="flex gap-3 text-sm mb-4 justify-between">
                                Loại gà:{' '}
                                <strong className="flex-1 text-right">
                                    {/* {currentChicken?.chickenTypeId || 'Không có ID loại'} */}-
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-4 justify-between">
                                Trạng thái:{' '}
                                {currentChicken?.status ? (
                                    <Badge
                                        variant={chickenBatchStatusVariant[currentChicken?.status]}
                                    >
                                        {chickenBatchStatusLabels[currentChicken?.status]}
                                    </Badge>
                                ) : (
                                    '-'
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-span-2">
                    {/* Technical Indicators */}
                    <Card>
                        <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                    Chỉ số kỹ thuật
                                </h3>
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
                steps={[
                    'Giai đoạn 1',
                    'Giai đoạn 2',
                    'Giai đoạn 3',
                    'Giai đoạn 4',
                    'Giai đoạn 5',
                    'Giai đoạn 6',
                ]}
                activeStep={2}
                visitStep={visitStep}
                onStepClick={(step) => setVisitStep(step)}
                className="mb-4"
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 my-6">
                <Chart />
                <div className="col-span-2">
                    <CardFlockNutrition />
                </div>
            </div>
        </div>
    );
}
