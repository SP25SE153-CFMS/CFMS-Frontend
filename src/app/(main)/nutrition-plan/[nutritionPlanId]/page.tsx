'use client';

import { Card } from '@/components/ui/card';
import { getNutritionPlanById } from '@/services/nutrition-plan.service';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import InfoItem from '@/components/info-item';
import { ChartArea, House, Tag, Clock, Leaf } from 'lucide-react';
import CardFood from './food/card';
import CardFeedSession from './feed-session/card';

export default function Page() {
    const { nutritionPlanId }: { nutritionPlanId: string } = useParams();
    const { data: nutritionPlan, isLoading } = useQuery({
        queryKey: ['nutritionPlan', nutritionPlanId],
        queryFn: () => getNutritionPlanById(nutritionPlanId),
        enabled: !!nutritionPlanId,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[75vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!nutritionPlan) {
        return (
            <div className="flex flex-col items-center justify-center h-[75vh] gap-4">
                <p className="text-muted-foreground">Không tìm thấy dữ liệu</p>
            </div>
        );
    }

    // const food = warehouseProducts.find((product) => product.productId === nutrition?.foodId);
    return (
        <div className="max-w-screen-lg mx-auto flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Nutrition Information */}
                <div className="col-span-2">
                    <Card>
                        <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                    Thông tin chi tiết
                                </h3>
                            </div>

                            <InfoItem
                                label="Tên chế độ"
                                value={nutritionPlan?.name || '-'}
                                icon={<Tag size={16} />}
                            />

                            <InfoItem
                                label="Mô tả"
                                value={nutritionPlan?.description || '-'}
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
                                value={nutritionPlan?.feedSessions.length}
                                icon={<Clock size={16} />}
                            />

                            <InfoItem
                                label="Thức ăn"
                                value={nutritionPlan?.nutritionPlanDetails.length || '-'}
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

                {/* Food */}
                <div className="col-span-3">
                    <CardFood nutritionPlanDetails={nutritionPlan?.nutritionPlanDetails || []} />
                </div>
            </div>

            {/* Feed Session */}
            <CardFeedSession feedSessions={nutritionPlan?.feedSessions || []} />
        </div>
    );
}
