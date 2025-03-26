'use client';

import { flocks, chickenCoopIndicators } from '@/utils/data/table.data';
import { AlignRight, Database } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import PopoverWithOverlay from '@/components/popover-with-overlay';
import { Flock } from '@/utils/schemas/flock.schema';
import config from '@/configs';
import { flockStatusLabels, flockStatusVariant } from '@/utils/enum/status.enum';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import CardFlockNutrition from './components/nutrition/card';
import CardVaccinationLog from './components/vaccine/card';

// TODO: Optimize and shorten the code
export default function Page() {
    const { flockId }: { flockId: string } = useParams();
    const router = useRouter();

    const [currentFlock, setCurrentFlock] = useState<Flock>();

    // Fetch flock data from session storage
    useEffect(() => {
        const flocks: Flock[] = JSON.parse(sessionStorage.getItem('flocks') || '[]');
        const foundFlock = flocks.find((flock) => flock.flockId === flockId);

        if (foundFlock) {
            setCurrentFlock(foundFlock);
        }
    }, [flockId, setCurrentFlock]);

    const handleFlockChange = (flockId: string) => {
        const selectedFlock = flocks.find((flock) => flock.flockId === flockId);
        if (selectedFlock) {
            setCurrentFlock(selectedFlock);
            router.push(`${config.routes.flock}/${flockId}`);
        }
    };

    if (!currentFlock) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />;
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    Thông tin đàn gà
                    <span className="text-primary ml-2">{currentFlock?.name}</span>
                </h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 my-6">
                <div className="flex flex-col gap-4">
                    {/* Flock Details */}
                    <Card>
                        <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                    Thông tin chi tiết
                                </h3>
                                <PopoverWithOverlay>
                                    <PopoverTrigger>
                                        <AlignRight size={20} />
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Select
                                            defaultOpen
                                            onValueChange={(flockId) => handleFlockChange(flockId)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Đổi đàn gà..." />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-72">
                                                {flocks.map((flock) => (
                                                    <SelectItem
                                                        key={flock.flockId}
                                                        value={flock.flockId.toString()}
                                                    >
                                                        {flock.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </PopoverContent>
                                </PopoverWithOverlay>
                            </div>

                            <div className="flex gap-3 text-sm mb-4">
                                Số lượng:{' '}
                                <strong className="flex-1 text-right">
                                    {currentFlock?.quantity} con
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-4 justify-between">
                                Trạng thái:{' '}
                                {currentFlock?.status ? (
                                    <Badge variant={flockStatusVariant[currentFlock?.status]}>
                                        {flockStatusLabels[currentFlock?.status]}
                                    </Badge>
                                ) : (
                                    '-'
                                )}
                            </div>
                            <div className="flex gap-3 text-sm mb-4">
                                Ngày bắt đầu:{' '}
                                <strong className="flex-1 text-right">
                                    {dayjs(currentFlock?.startDate).format('DD/MM/YYYY')}
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-4">
                                Ngày kết thúc:{' '}
                                <strong className="flex-1 text-right">
                                    {currentFlock?.endDate
                                        ? dayjs(currentFlock?.endDate).format('DD/MM/YYYY')
                                        : 'Chưa kết thúc'}
                                </strong>
                            </div>

                            {/* Uncomment this code when you want to update */}
                            {/* <div className="flex flex-row gap-x-3 gap-y-3 sm:flex-col mt-8">
                            <Button
                                component={Link}
                                to={`/dashboard/center/${centerId}/court/${courtId}/update`}
                                className="py-[10px] flex-1"
                                leftSection={<GrUpdate />}
                            >
                                Cập nhật
                            </Button> 
                        </div> */}
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
                                {chickenCoopIndicators.map((indicator) => (
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
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="vaccine">Tiêm phòng</TabsTrigger>
                            <TabsTrigger value="health">Sức khỏe</TabsTrigger>
                            <TabsTrigger value="quantity">Số lượng</TabsTrigger>
                        </TabsList>
                        <TabsContent value="vaccine">
                            <CardVaccinationLog flockId={flockId} />
                        </TabsContent>
                        <TabsContent value="health">
                            <CardFlockNutrition flockId={flockId} />
                        </TabsContent>
                        <TabsContent value="quantity">
                            <CardFlockNutrition flockId={flockId} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <CardFlockNutrition flockId={flockId} />
        </div>
    );
}
