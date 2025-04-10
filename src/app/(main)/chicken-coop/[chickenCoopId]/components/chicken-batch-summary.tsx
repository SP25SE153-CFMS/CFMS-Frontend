'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { AlignRight, Calendar, Info, Timer, TrendingUp } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import PopoverWithOverlay from '@/components/popover-with-overlay';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button, buttonVariants } from '@/components/ui/button';
import type { ChickenBatch } from '@/utils/schemas/chicken-batch.schema';
import {
    ChickenBatchStatus,
    chickenBatchStatusLabels,
    chickenBatchStatusVariant,
} from '@/utils/enum/status.enum';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import config from '@/configs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from '@/components/ui/dialog';
import InfoItem from '@/components/info-item';
import { calculateDuration } from './batch-progress';

import { endChickenBatch } from '@/services/chicken-batch.service';
import toast from 'react-hot-toast';
import StartChickenBatchForm from '@/components/forms/start-chicken-batch-form';
import { useQueryClient } from '@tanstack/react-query';

const ChickenBatchSummary = ({ chickenBatches }: { chickenBatches: ChickenBatch[] }) => {
    const [open, setOpen] = useState(false);

    const [currentChickenBatch, setCurrentChickenBatch] = useState<ChickenBatch>(
        chickenBatches?.[0],
    );

    useEffect(() => {
        if (chickenBatches) {
            setCurrentChickenBatch(chickenBatches[0]);
        }
    }, [chickenBatches]);

    const handleBatchChange = (batchId: string) => {
        const selectedBatch = chickenBatches?.find((batch) => batch.chickenBatchId === batchId);
        if (selectedBatch) {
            setCurrentChickenBatch(selectedBatch);
        }
    };

    const queryClient = useQueryClient();

    const closeChickenBatch = async () => {
        try {
            await endChickenBatch(currentChickenBatch.chickenBatchId);
            queryClient.invalidateQueries({
                queryKey: ['chickenCoop', currentChickenBatch.chickenCoopId],
            });
            toast.success('Kết thúc lứa nuôi thành công');
        } catch (error) {
            toast.error('Kết thúc lứa nuôi thất bại');
        }
    };

    const duration = calculateDuration(
        currentChickenBatch?.startDate,
        currentChickenBatch?.endDate,
    );

    const isAllBatchCompleted = chickenBatches?.every(
        (batch) => batch.status === ChickenBatchStatus.COMPLETED,
    );

    // const timeOptions = ['ngày', 'tuần', 'tháng', 'năm'];

    return (
        <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex-row justify-between items-center py-4">
                <h3 className="h-min font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                    Lứa nuôi hiện tại
                </h3>
                {chickenBatches?.length > 0 && (
                    <PopoverWithOverlay>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-muted"
                            >
                                <AlignRight size={18} />
                                <span className="sr-only">Chọn lứa nuôi</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-64">
                            <Select
                                defaultValue={currentChickenBatch?.chickenBatchId}
                                onValueChange={handleBatchChange}
                            >
                                <SelectTrigger className="border-0 focus:ring-0">
                                    <SelectValue placeholder="Đổi lứa nuôi..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {chickenBatches?.map((batch) => (
                                        <SelectItem
                                            key={batch.chickenBatchId}
                                            value={batch.chickenBatchId}
                                            className="cursor-pointer"
                                        >
                                            {batch.chickenBatchName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </PopoverContent>
                    </PopoverWithOverlay>
                )}
            </CardHeader>

            {/* {currentChickenBatch && currentChickenBatch?.status !== ChickenBatchStatus.COMPLETED ? ( */}
            {currentChickenBatch && !isAllBatchCompleted ? (
                <>
                    <CardContent className="pb-0">
                        <h3 className="mb-2 font-semibold">
                            {currentChickenBatch?.chickenBatchName}
                        </h3>

                        <InfoItem
                            label="Thời gian từ"
                            value={dayjs(currentChickenBatch?.startDate).format('DD/MM/YYYY')}
                            icon={<Calendar size={16} />}
                        />

                        <InfoItem
                            label="Trạng thái"
                            value={
                                currentChickenBatch?.status || currentChickenBatch?.status === 0 ? (
                                    <Badge
                                        variant={
                                            chickenBatchStatusVariant[currentChickenBatch?.status]
                                        }
                                        className="ml-2 animate-in fade-in"
                                    >
                                        {chickenBatchStatusLabels[currentChickenBatch?.status]}
                                    </Badge>
                                ) : (
                                    '-'
                                )
                            }
                            icon={<TrendingUp size={16} />}
                        />

                        <InfoItem
                            label="Thời gian nuôi"
                            value={`${duration > 0 ? `${duration} ngày` : 'Chưa bắt đầu'}`}
                            icon={<Timer size={16} />}
                        />
                    </CardContent>

                    <CardFooter className="flex flex-col gap-2">
                        <Link
                            href={`${config.routes.chickenBatch}/${currentChickenBatch?.chickenBatchId}`}
                            className={cn(buttonVariants({ variant: 'outline' }), 'w-full group')}
                        >
                            <Info
                                size={16}
                                className="mr-2 group-hover:text-primary transition-colors"
                            />
                            <span>Xem chi tiết</span>
                        </Link>

                        {currentChickenBatch?.status === ChickenBatchStatus.ACTIVE && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full">
                                        Kết thúc lứa nuôi
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Bạn có chắc chắn muốn kết thúc lứa nuôi này?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Ấn kết thúc khi lứa nuôi đã hoàn thành để có được thống
                                            kê hoạt động và bắt đầu một lứa nuôi mới.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                        <AlertDialogAction onClick={closeChickenBatch}>
                                            Kết thúc
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </CardFooter>
                </>
            ) : (
                <>
                    <CardContent className="py-8 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                <Calendar size={24} className="text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">Chưa có thông tin lứa nuôi</p>
                        </div>
                    </CardContent>
                    <CardFooter className="pb-4">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant="default" className="w-full">
                                    Bắt đầu lứa nuôi mới
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                    <DialogTitle>Bắt đầu lứa nuôi mới</DialogTitle>
                                    <DialogDescription>
                                        Hãy nhập các thông tin dưới đây để bắt đầu lứa nuôi mới
                                    </DialogDescription>
                                </DialogHeader>
                                <StartChickenBatchForm closeDialog={() => setOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </>
            )}
        </Card>
    );
};

export default ChickenBatchSummary;
