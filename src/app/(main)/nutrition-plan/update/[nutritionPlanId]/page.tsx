'use client';

import NutritionPlanForm from '@/components/forms/nutrition-plan-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getNutritionPlanById } from '@/services/nutrition-plan.service';
import { useQuery } from '@tanstack/react-query';
import { Utensils } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function Page() {
    const { nutritionPlanId } = useParams();

    const { data: nutritionPlan, isLoading } = useQuery({
        queryKey: ['nutritionPlan', nutritionPlanId],
        queryFn: () => getNutritionPlanById(nutritionPlanId as string),
        enabled: !!nutritionPlanId,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!nutritionPlan) {
        return <div>Không tìm thấy chế độ dinh dưỡng</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-5xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                        <Utensils className="mr-2" />
                        Cập nhật chế độ dinh dưỡng
                    </CardTitle>
                    <CardDescription>Điền thông tin chi tiết cho chế độ dinh dưỡng</CardDescription>
                </CardHeader>
                <CardContent>
                    <NutritionPlanForm defaultValues={nutritionPlan} />
                </CardContent>
            </Card>
        </div>
    );
}
