'use client';

import { getResourceById } from '@/services/resource.service';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Pill, Apple, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type ResourceCardProps = {
    resourceId: string;
    onViewDetails?: (id: string) => void;
};

export default function ResourceCard({ resourceId, onViewDetails }: ResourceCardProps) {
    const {
        data: resource,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['resource', resourceId],
        queryFn: () => getResourceById(resourceId),
    });

    if (isLoading) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                </CardContent>
            </Card>
        );
    }

    if (error || !resource) {
        return (
            <Card className="w-full max-w-md border-destructive/20">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-destructive">
                        <AlertCircle className="mr-2 h-5 w-5" />
                        Error Loading Resource
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Unable to load resource information. Please try again later.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const getResourceIcon = () => {
        if (resource.food) return <Apple className="h-5 w-5 text-green-500" />;
        if (resource.equipment) return <Package className="h-5 w-5 text-blue-500" />;
        if (resource.medicine) return <Pill className="h-5 w-5 text-red-500" />;
        return null;
    };

    const getResourceType = () => {
        if (resource.food) return 'Thực phẩm';
        if (resource.equipment) return 'Thiết bị';
        if (resource.medicine) return 'Thuốc';
        return 'Sản phẩm';
    };

    const getResourceBadgeColor = () => {
        if (resource.food) return 'bg-green-100 text-green-800 hover:bg-green-200';
        if (resource.equipment) return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
        if (resource.medicine) return 'bg-red-100 text-red-800 hover:bg-red-200';
        return '';
    };

    return (
        <Card className="w-full max-w-md transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                        {getResourceIcon()}
                        <span className="ml-2">Sản phẩm</span>
                    </CardTitle>
                    <Badge className={getResourceBadgeColor()}>{getResourceType()}</Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                {resource.food && (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">
                                Mã thực phẩm:
                            </span>
                            <span className="font-medium">{resource.food.foodCode}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">
                                Tên thực phẩm:
                            </span>
                            <span>{resource.food.foodName}</span>
                        </div>
                    </div>
                )}

                {resource.equipment && (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">
                                Mã thiết bị:
                            </span>
                            <span className="font-medium">{resource.equipment.equipmentCode}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">
                                Tên thiết bị:
                            </span>
                            <span>{resource.equipment.equipmentName}</span>
                        </div>
                    </div>
                )}

                {resource.medicine && (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">
                                Mã thuốc:
                            </span>
                            <span className="font-medium">{resource.medicine.medicineCode}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">
                                Tên thuốc:
                            </span>
                            <span>{resource.medicine.medicineName}</span>
                        </div>
                    </div>
                )}
            </CardContent>

            <Separator />

            {/* <CardFooter className="pt-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto flex items-center"
                    onClick={() => onViewDetails?.(resourceId)}
                >
                    Xem chi tiết
                    <ExternalLink className="ml-1 h-4 w-4" />
                </Button>
            </CardFooter> */}
        </Card>
    );
}
