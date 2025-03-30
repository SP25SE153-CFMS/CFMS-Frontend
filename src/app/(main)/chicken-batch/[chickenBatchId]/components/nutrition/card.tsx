'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getFoods } from '@/services/food.service';
import { getNutritionPlans } from '@/services/nutrition-plan.service';
import { getWeightUnit } from '@/utils/functions/category.function';
import { useQuery } from '@tanstack/react-query';
import { Utensils, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function CardNutritionPlan() {
    // Get nutrition plans
    const { data: nutritionPlans, isLoading: isLoadingPlans } = useQuery({
        queryKey: ['nutritionPlans'],
        queryFn: () => getNutritionPlans(),
    });

    // Get all foods
    const { data: foods, isLoading: isLoadingFoods } = useQuery({
        queryKey: ['foods'],
        queryFn: () => getFoods(),
    });

    const isLoading = isLoadingPlans || isLoadingFoods;
    const nutritionPlan = nutritionPlans?.[0];

    if (isLoading) {
        return <NutritionCardSkeleton />;
    }

    if (!nutritionPlan) {
        return (
            <Card className="w-full">
                <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
                    <Info className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-center">Không tìm thấy chế độ dinh dưỡng</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="pt-4 pb-0">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                        Thông tin chế độ dinh dưỡng
                    </h3>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Tên chế độ:</p>
                            <p className="font-semibold">{nutritionPlan?.name || '-'}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Mô tả:</p>
                            <p className="font-medium">
                                {nutritionPlan?.description || 'Không có mô tả'}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Thức ăn:</h4>

                        {nutritionPlan?.nutritionPlanDetails?.length > 0 ? (
                            <div className="grid gap-3">
                                {nutritionPlan.nutritionPlanDetails.map((detail, index) => {
                                    const food = foods?.find(
                                        (food) => food.foodId === detail.foodId,
                                    );
                                    const unit = getWeightUnit(detail.unitId);

                                    return (
                                        <div
                                            key={index}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                                        >
                                            <div className="flex items-center mb-2 sm:mb-0">
                                                <Utensils className="h-4 w-4 mr-2 text-primary" />
                                                <span className="font-medium">
                                                    {food?.foodName || 'Không xác định'}
                                                </span>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="self-start sm:self-auto"
                                            >
                                                {detail.foodWeight || 0}{' '}
                                                {unit?.subCategoryName || '-'}
                                            </Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground py-2">
                                Không có chi tiết chế độ dinh dưỡng
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function NutritionCardSkeleton() {
    return (
        <Card className="w-full">
            <CardHeader className="bg-primary/5 pb-3">
                <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-40" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-full" />
                    </div>
                </div>

                <Separator />

                <div className="space-y-3">
                    <Skeleton className="h-4 w-48" />
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="flex justify-between items-center p-3 rounded-md bg-muted/50"
                            >
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-5 w-20" />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
