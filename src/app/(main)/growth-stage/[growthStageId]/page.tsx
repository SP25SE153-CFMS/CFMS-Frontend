'use client';

import InfoItem from '@/components/info-item';
import { Card } from '@/components/ui/card';
import { getGrowthStageById } from '@/services/growth-stage.service';
import { getChickenType } from '@/utils/functions/category.function';
import { useQuery } from '@tanstack/react-query';
import { ChartArea, Clock, House, Leaf, Tag } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function GrowthStagePage() {
    const { growthStageId }: { growthStageId: string } = useParams();

    const { data: stage } = useQuery({
        queryKey: ['growthStage'],
        queryFn: () => getGrowthStageById(growthStageId),
    });

    return (
        <div className="max-w-screen-lg mx-auto flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Nutrition Information */}
                <div>
                    <Card>
                        <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                    Giai đoạn phát triển
                                </h3>
                            </div>

                            <InfoItem
                                label="Mã giai đoạn"
                                value={stage?.stageCode || '-'}
                                icon={<Tag size={16} />}
                            />

                            <InfoItem
                                label="Tên giai đoạn"
                                value={stage?.stageName || '-'}
                                icon={<Tag size={16} />}
                            />

                            <InfoItem
                                label="Loại gà"
                                value={getChickenType(stage?.chickenType ?? '') || '-'}
                                icon={<Leaf size={16} />}
                            />

                            <InfoItem
                                label="Tuổi bắt đầu (tuần)"
                                value={stage?.minAgeWeek !== undefined ? stage.minAgeWeek : '-'}
                                icon={<Clock size={16} />}
                            />

                            <InfoItem
                                label="Tuổi kết thúc (tuần)"
                                value={stage?.maxAgeWeek !== undefined ? stage.maxAgeWeek : '-'}
                                icon={<Clock size={16} />}
                            />

                            <InfoItem
                                label="Mô tả"
                                value={stage?.description || '-'}
                                icon={<ChartArea size={16} />}
                            />

                            <InfoItem
                                label="Trang trại"
                                value={
                                    JSON.parse(sessionStorage.getItem('activeFarm') || '{}')
                                        ?.farmName || '-'
                                }
                                icon={<House size={16} />}
                            />

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

                {/* Growth Stage */}
                <div>
                    <Card>
                        <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                    Chế độ dinh dưỡng
                                </h3>
                            </div>

                            <InfoItem
                                label="Tên chế độ"
                                value={stage?.nutritionPlan?.name || '-'}
                                icon={<Tag size={16} />}
                            />

                            <InfoItem
                                label="Mô tả"
                                value={stage?.nutritionPlan?.description || '-'}
                                icon={<ChartArea size={16} />}
                            />

                            <InfoItem
                                label="Trang trại"
                                value={
                                    JSON.parse(sessionStorage.getItem('activeFarm') || '{}')
                                        ?.farmName
                                }
                                icon={<House size={16} />}
                            />

                            <InfoItem
                                label="Lịch cho ăn"
                                value={stage?.nutritionPlan?.feedSessions.length}
                                icon={<Clock size={16} />}
                            />

                            <InfoItem
                                label="Thức ăn"
                                value={stage?.nutritionPlan?.nutritionPlanDetails.length || '-'}
                                icon={<Leaf size={16} />}
                            />

                            {/* <div className="flex gap-3 text-sm mb-4">
                                    Đối tượng:{' '}
                                    <strong className="flex-1 text-right">
                                        {nutritionPlan?.targetAudience || '-'}
                                    </strong>
                                </div> */}

                            {/* <div className="flex gap-3 text-sm mb-4">
                                    Giai đoạn phát triển:{' '}
                                    <strong className="flex-1 text-right">
                                        {nutritionPlan?.developmentStage || '-'}
                                    </strong>
                                </div> */}

                            {/* <div className="flex gap-3 text-sm mb-4">
                                    Thức ăn
                                    <strong className="flex-1 text-right">
                                        {food?.productName || '-'}
                                    </strong>
                                </div> */}

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
            </div>
        </div>
    );
}
