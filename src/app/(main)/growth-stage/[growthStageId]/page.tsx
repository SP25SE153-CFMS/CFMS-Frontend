'use client';

import InfoItem from '@/components/info-item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import config from '@/configs';
import { addNutritionPlanToGrowthStage, getGrowthStageById } from '@/services/growth-stage.service';
import { getNutritionPlans } from '@/services/nutrition-plan.service';
import { getChickenType } from '@/utils/functions/category.function';
import { useQuery } from '@tanstack/react-query';
import { ChartArea, Clock, FolderTree, House, Leaf, Plus, Tag, Utensils } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function GrowthStagePage() {
    const { growthStageId }: { growthStageId: string } = useParams();
    const [open, setOpen] = useState(false);
    const [nutritionPlanId, setNutritionPlanId] = useState<string>('');

    const { data: stage, refetch } = useQuery({
        queryKey: ['growthStage'],
        queryFn: () => getGrowthStageById(growthStageId),
    });

    const { data: nutritionPlans } = useQuery({
        queryKey: ['nutritionPlans'],
        queryFn: () => getNutritionPlans(),
    });

    const upsertNutritionPlan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check if nutritionPlanId is valid
        if (!nutritionPlanId) {
            toast('Không tìm thấy chế độ dinh dưỡng', { icon: '⚠️' });
            return;
        }

        // // Update nutrition plan
        // if (currentNutritionPlanOfGrowthStage) {
        //     await updateNutritionPlanToGrowthStage(growthStageId, nutritionPlanId).then(() => {
        //         toast.success('Đã cập nhật chế độ dinh dưỡng');
        //         queryClient.invalidateQueries({ queryKey: ['growthStages'] });
        //         setOpenNutriPlanForm(false);
        //     });
        //     return;
        // }

        // Add nutrition plan
        await addNutritionPlanToGrowthStage(growthStageId, nutritionPlanId).then(() => {
            toast.success('Đã thêm chế độ dinh dưỡng');
            refetch();
            setOpen(false);
        });
    };

    return (
        <div className="max-w-screen-lg mx-auto flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Stage */}
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
                        </div>
                    </Card>
                </div>

                {/* Nutrition Plan */}
                <div>
                    {stage?.nutritionPlan ? (
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

                                <Link
                                    href={`${config.routes.nutritionPlan}/${stage?.nutritionPlanId}`}
                                >
                                    <Button variant="default" className="w-full gap-2">
                                        <FolderTree size={16} />
                                        Xem chi tiết
                                    </Button>
                                </Link>
                                {/* <Button variant="destructive" className="w-full gap-2 mt-2">
                                    <Trash size={16} />
                                    Xóa chế độ dinh dưỡng
                                </Button> */}
                            </div>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="py-8 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                        <Utensils size={24} className="text-muted-foreground" />
                                    </div>
                                    <p className="text-muted-foreground">
                                        Chưa có chế độ dinh dưỡng
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="pb-4">
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="default" className="w-full">
                                            Thêm chế độ dinh dưỡng mới
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Thêm chế độ dinh dưỡng</DialogTitle>
                                            <DialogDescription>
                                                Hãy nhập các thông tin dưới đây
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form
                                            onSubmit={upsertNutritionPlan}
                                            className="flex flex-col"
                                        >
                                            <div className="grid grid-cols-1 gap-6 px-1 w-full">
                                                <Select
                                                    onValueChange={(value) =>
                                                        setNutritionPlanId(value)
                                                    }
                                                    // defaultValue={currentNutritionPlanOfGrowthStage}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn chế độ dinh dưỡng" />
                                                    </SelectTrigger>
                                                    <SelectContent className="w-full">
                                                        {nutritionPlans?.map((nutritionPlan) => (
                                                            <SelectItem
                                                                key={nutritionPlan.nutritionPlanId}
                                                                value={
                                                                    nutritionPlan.nutritionPlanId
                                                                }
                                                            >
                                                                {nutritionPlan.name}
                                                            </SelectItem>
                                                        ))}
                                                        {nutritionPlans?.length === 0 && (
                                                            <Link
                                                                href={config.routes.nutritionPlan}
                                                                className="text-sm font-medium flex items-center p-2"
                                                            >
                                                                <Plus className="w-4 h-4 mr-2" />
                                                                Nhấn vào đây để tạo chế độ dinh
                                                                dưỡng
                                                            </Link>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <Button type="submit" className="mx-auto mt-6 w-60">
                                                Gửi
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardFooter>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
