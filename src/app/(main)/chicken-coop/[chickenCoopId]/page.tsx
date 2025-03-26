/* eslint-disable no-unused-vars */
'use client';

import { Button } from '@/components/ui/button';
import { Plus, Database } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CardEquipment from './components/equipment/card';
import ChickenCoopDetails from './components/chicken-coop-details';
import ChickenBatchSummary from './components/chicken-batch-summary';
import { techinicalIndicators } from '@/utils/data/table.data';
import CardTask from './components/task/card';
import CardHarvest from './components/harvest/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useQuery } from '@tanstack/react-query';
import { getChickenCoopById } from '@/services/chicken-coop.service';
import { useEffect } from 'react';
import { useChickenCoopStore } from '@/store/use-chicken-coop';

export default function Page() {
    const { chickenCoopId }: { chickenCoopId: string } = useParams();
    const { data: chickenCoop } = useQuery({
        queryKey: ['chickenCoop'],
        queryFn: () => getChickenCoopById(chickenCoopId),
    });

    const { setChickenCoop } = useChickenCoopStore();

    useEffect(() => {
        if (chickenCoop) {
            setChickenCoop(chickenCoop);
        }
    }, [chickenCoop, setChickenCoop]);

    if (!chickenCoop) {
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
                    Thông tin chuồng nuôi
                    <span className="text-primary ml-2">{chickenCoop?.chickenCoopName}</span>
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-6">
                <div className="flex flex-col gap-4">
                    <ChickenCoopDetails />
                    <ChickenBatchSummary chickenBatches={chickenCoop.chickenBatches} />
                </div>
                <div className="col-span-2">
                    <Card className="p-6 mb-6">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight">
                                    Chỉ số kỹ thuật
                                </h2>
                                <p className="text-muted-foreground">
                                    Danh sách tất cả chỉ số kỹ thuật của chuồng nuôi
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="space-x-1">
                                    <span>Mục tiêu</span> <Plus size={18} />
                                </Button>
                            </div>
                        </div>
                        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                            <div className="flex justify-between">
                                {techinicalIndicators.map((indicator) => (
                                    <div
                                        key={indicator.id}
                                        className="flex-1 flex p-2 border gap-2 items-center"
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

                    <Tabs defaultValue="task" className="w-auto">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="task">Nhật ký công việc</TabsTrigger>
                            <TabsTrigger value="equipment">Trang thiết bị</TabsTrigger>
                            <TabsTrigger value="harvest">Thu hoạch</TabsTrigger>
                        </TabsList>
                        <TabsContent value="task">
                            <CardTask taskLogs={chickenCoop.taskLogs} />
                        </TabsContent>
                        <TabsContent value="equipment">
                            <CardEquipment coopEquipments={chickenCoop.coopEquipments} />
                        </TabsContent>
                        <TabsContent value="harvest">
                            {/* TODO: Change to harvest props */}
                            <CardHarvest chickenCoopId={chickenCoopId} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
