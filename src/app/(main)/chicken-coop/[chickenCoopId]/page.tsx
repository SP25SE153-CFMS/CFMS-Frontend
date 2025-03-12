'use client';

import { Button } from '@/components/ui/button';
import { Plus, Database } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { Chart } from './chart';
import CardEquipment from './components/equipments/card';
import ChickenCoopDetails from './components/chicken-coop-details';
import ChickenBatchDetails from './components/chicken-batch-details';
import { techinicalIndicators } from '@/utils/data/table.data';
import { ChickenCoop } from '@/utils/schemas/chicken-coop.schema';
import { getBreedingAreas } from '@/services/breeding-area.service';
import { useQuery } from '@tanstack/react-query';
import CardFlock from './components/flock/card';
import CardEmployee from './components/employee/card';
import CardHarvest from './components/harvest/card';

export default function Page() {
    const { chickenCoopId } = useParams();

    const chickenCoops: ChickenCoop[] = JSON.parse(sessionStorage.getItem('chickenCoops') || '[]');
    const currentCoop = chickenCoops.find((coop) => coop.chickenCoopId === chickenCoopId);

    const { data: breedingAreas } = useQuery({
        queryKey: ['breedingAreas'],
        queryFn: () => getBreedingAreas(),
    });

    if (!currentCoop) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Card className="px-36 py-8">
                    <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                        <Image src="/no-data.jpg" width={300} height={300} alt="Not Found" />
                        <h1 className="text-2xl font-bold">Chuồng nuôi không tồn tại</h1>
                        <Button variant="outline" onClick={() => window.history.back()}>
                            Quay lại
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    Thông tin chuồng nuôi
                    <span className="text-primary ml-2">{currentCoop?.chickenCoopName}</span>
                </h1>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Đổi khu nuôi..." />
                    </SelectTrigger>
                    <SelectContent>
                        {breedingAreas?.map((area) => (
                            <SelectItem key={area.breedingAreaId} value={area.breedingAreaId}>
                                {area.breedingAreaName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-6">
                <div className="flex flex-col gap-4">
                    <ChickenCoopDetails currentCoop={currentCoop} />
                    <ChickenBatchDetails chickenCoopId={chickenCoopId as string} />
                    <Chart />
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

                    <Tabs defaultValue="flock" className="w-auto">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="flock">Đàn gà</TabsTrigger>
                            <TabsTrigger value="employees">Nhân công</TabsTrigger>
                            <TabsTrigger value="equipment">Trang thiết bị</TabsTrigger>
                            <TabsTrigger value="harvest">Thu hoạch</TabsTrigger>
                        </TabsList>
                        <TabsContent value="flock">
                            {/* Danh sách đàn gà */}
                            <CardFlock />
                            {/* Thông tin đàn gà */}
                            <CardFlock />
                        </TabsContent>
                        <TabsContent value="employees">
                            <CardEmployee />
                        </TabsContent>
                        <TabsContent value="equipment">
                            <CardEquipment />
                        </TabsContent>
                        <TabsContent value="harvest">
                            <CardHarvest />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

// TODO: Split to a new file
