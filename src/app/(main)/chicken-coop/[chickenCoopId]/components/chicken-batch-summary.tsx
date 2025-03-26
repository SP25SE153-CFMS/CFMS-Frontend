'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { AlignRight, Calendar, CalendarIcon, Eye, Timer, TrendingUp } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { chickenBatchStatusLabels, chickenBatchStatusVariant } from '@/utils/enum/status.enum';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';

import { Calendar as CalendarPicker } from '@/components/ui/calendar';

// Calculate the duration in days between start date and now
const calculateDuration = (startDate: string, endDate: string | null) => {
    const start = dayjs(startDate);
    const end = endDate ? dayjs(endDate) : dayjs();
    return end.diff(start, 'day');
};

// Progress bar component for batch duration
const BatchProgress = ({ startDate, endDate }: { startDate: string; endDate: string | null }) => {
    const duration = calculateDuration(startDate, null);
    const total = calculateDuration(startDate, endDate);

    const progress = Math.min(Math.round((duration / total) * 100), 100);

    return (
        <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>Ngày nuôi: {duration}</span>
                <span>{progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500 ease-in-out',
                        progress < 30
                            ? 'bg-blue-500'
                            : progress < 70
                              ? 'bg-amber-500'
                              : 'bg-green-500',
                    )}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

// Info item component for consistent styling
const InfoItem = ({
    label,
    value,
    icon,
}: {
    label: string;
    value: React.ReactNode;
    icon: React.ReactNode;
}) => (
    <div className="flex items-center gap-2 text-sm mb-3">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-muted-foreground">{label}:</span>
        <div className="flex-1 text-right font-medium">{value}</div>
    </div>
);

const ChickenBatchSummary = ({ chickenBatches }: { chickenBatches: ChickenBatch[] }) => {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 150),
    });

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

    return (
        <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex-row justify-between items-center py-4">
                <h3 className="h-min font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                    Lứa nuôi hiện tại
                </h3>
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
            </CardHeader>

            {currentChickenBatch ? (
                <>
                    <CardContent className="pb-6">
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
                                currentChickenBatch?.status ? (
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
                            value={`${calculateDuration(currentChickenBatch?.startDate, currentChickenBatch?.endDate)} ngày`}
                            icon={<Timer size={16} />}
                        />

                        <BatchProgress
                            startDate={currentChickenBatch?.startDate}
                            endDate={currentChickenBatch?.endDate}
                        />
                    </CardContent>

                    <CardFooter className="flex flex-col gap-2">
                        <Link
                            href={`${config.routes.chickenBatch}/${currentChickenBatch?.chickenBatchId}`}
                            className={cn(buttonVariants({ variant: 'outline' }), 'w-full group')}
                        >
                            <Eye
                                size={16}
                                className="mr-2 group-hover:text-primary transition-colors"
                            />
                            <span>Xem chi tiết</span>
                        </Link>

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
                                        Ấn kết thúc khi lứa nuôi đã hoàn thành để có được thống kê
                                        hoạt động và bắt đầu một lứa nuôi mới.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction>Kết thúc</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
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
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="default" className="w-full">
                                    Bắt đầu lứa nuôi mới
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Bắt đầu lứa nuôi mới</DialogTitle>
                                    <DialogDescription>
                                        Hãy nhập các thông tin dưới đây để bắt đầu lứa nuôi mới
                                    </DialogDescription>
                                </DialogHeader>
                                <form className="space-y-5">
                                    <div className="space-y-4">
                                        <div className="*:not-first:mt-2">
                                            <Label htmlFor={`chickenBatchName`}>Tên lứa nuôi</Label>
                                            <Input
                                                id={`chickenBatchName`}
                                                placeholder="Lứa nuôi gà đẻ trứng"
                                                required
                                            />
                                        </div>
                                        <div className="*:not-first:mt-2">
                                            <Label>Nhóm giai đoạn phát triển</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn nhóm giai đoạn phát triển..." />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-72">
                                                    {/* {chickenCoops.map((coop) => (
                                                        <SelectItem
                                                            key={coop.chickenCoopId}
                                                            value={coop.chickenCoopId}
                                                        >
                                                            {coop.chickenCoopName}
                                                        </SelectItem>
                                                    ))} */}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Thời gian</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="date"
                                                        variant={'outline'}
                                                        className={cn(
                                                            'w-[300px] justify-start text-left font-normal',
                                                            !date && 'text-muted-foreground',
                                                        )}
                                                    >
                                                        <CalendarIcon />
                                                        {date?.from ? (
                                                            date.to ? (
                                                                <>
                                                                    {format(date.from, 'LLL dd, y')}{' '}
                                                                    - {format(date.to, 'LLL dd, y')}
                                                                </>
                                                            ) : (
                                                                format(date.from, 'LLL dd, y')
                                                            )
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <CalendarPicker
                                                        initialFocus
                                                        mode="range"
                                                        defaultMonth={date?.from}
                                                        selected={date}
                                                        onSelect={setDate}
                                                        numberOfMonths={2}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>

                                    <Button type="button" className="w-full">
                                        Bắt đầu
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </>
            )}
        </Card>
    );
};

export default ChickenBatchSummary;
