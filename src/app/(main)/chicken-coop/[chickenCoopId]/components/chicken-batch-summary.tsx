'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { AlignRight, Calendar, Info, Timer, TrendingUp, CalendarIcon } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import InfoItem from '@/components/info-item';
import { calculateDuration } from './batch-progress';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { getChickenTypes } from '@/services/category.service';
import { useQuery } from '@tanstack/react-query';
import { getGrowthStages } from '@/services/growth-stage.service';

const ChickenBatchSummary = ({ chickenBatches }: { chickenBatches: ChickenBatch[] }) => {
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

    // const timeOptions = ['ngày', 'tuần', 'tháng', 'năm'];

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
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Bắt đầu lứa nuôi mới</DialogTitle>
                                    <DialogDescription>
                                        Hãy nhập các thông tin dưới đây để bắt đầu lứa nuôi mới
                                    </DialogDescription>
                                </DialogHeader>
                                <StartChickenBatchForm />
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </>
            )}
        </Card>
    );
};

export default ChickenBatchSummary;

const StartChickenBatchForm = () => {
    const { data: chickenTypes } = useQuery({
        queryKey: ['chickenTypes'],
        queryFn: () => getChickenTypes(),
    });

    const { data: growthStages } = useQuery({
        queryKey: ['growthStages'],
        queryFn: () => getGrowthStages(),
    });

    const [chickenId, setChickenId] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [chickenTypeId, setChickenTypeId] = useState('');

    const chickens = chickenTypes?.find((type) => type.subCategoryId === chickenTypeId)?.chickens;

    return (
        <form className="space-y-5">
            <div className="space-y-4">
                <div className="*:not-first:mt-2">
                    <Label htmlFor={`chickenBatchName`}>Tên lứa nuôi</Label>
                    <Input id={`chickenBatchName`} placeholder="Lứa nuôi gà đẻ trứng" required />
                </div>
                <div className="*:not-first:mt-2">
                    <Label>Loại gà</Label>
                    <Select defaultValue={chickenTypeId} onValueChange={setChickenTypeId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn loại gà" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                            {chickenTypes?.map((type) => (
                                <SelectItem key={type.subCategoryId} value={type.subCategoryId}>
                                    {type.subCategoryName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {chickenTypeId && (
                    <>
                        <div className="*:not-first:mt-2">
                            <Label>Nhóm giai đoạn phát triển</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nhóm giai đoạn phát triển..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-72">
                                    {growthStages
                                        // Filter stages by chicken type
                                        ?.filter((stage) => stage.chickenType === chickenTypeId)
                                        // Remove duplicate stages
                                        .filter(
                                            (stage, index, self) =>
                                                index ===
                                                self.findIndex(
                                                    (s) => s.stageCode === stage.stageCode,
                                                ),
                                        )
                                        // Render stages
                                        .map((stage) => (
                                            <SelectItem
                                                key={stage.growthStageId}
                                                value={stage.growthStageId}
                                            >
                                                {stage.stageCode}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`chickenBatchName`}>Giống gà</Label>
                            <Select defaultValue={chickenId} onValueChange={setChickenId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn giống gà" />
                                </SelectTrigger>
                                <SelectContent className="max-h-72">
                                    {chickens?.map((chicken) => (
                                        <SelectItem
                                            key={chicken.chickenId}
                                            value={chicken.chickenId}
                                        >
                                            {chicken.chickenName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {/* <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full">
                                        Chọn giống gà
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuGroup>
                                        {chickenTypes?.map((type) => (
                                            <DropdownMenuSub key={type.subCategoryId}>
                                                <DropdownMenuSubTrigger inset>
                                                    {type.subCategoryName}
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuRadioGroup
                                                            value={chickenId}
                                                            onValueChange={setChickenId}
                                                        >
                                                            {type.chickens.map((chicken) => (
                                                                <DropdownMenuRadioItem
                                                                    value={chicken.chickenId}
                                                                    key={chicken.chickenId}
                                                                >
                                                                    {chicken.chickenName}
                                                                </DropdownMenuRadioItem>
                                                            ))}
                                                        </DropdownMenuRadioGroup>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                        ))}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu> */}
                        </div>
                    </>
                )}

                {/* This code for range datetime */}
                <div className="*:not-first:mt-2 grid gap-2">
                    <Label>Ngày bắt đầu</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={'outline'}
                                className={cn(
                                    'justify-start text-left font-normal',
                                    !date && 'text-muted-foreground',
                                )}
                            >
                                <CalendarIcon />
                                {format(date, 'PPP')}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={(day) => setDate(day ?? new Date())}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Duration */}
                {/* <div className="*:not-first:mt-2">
                    <Label>Thời lượng</Label>
                    <div className="flex rounded-md shadow-xs">
                        <Input
                            className="-me-px rounded-e-none shadow-none focus-visible:z-10"
                            placeholder="1"
                            type="number"
                            min={0}
                        />
                        <SelectNative className="text-muted-foreground hover:text-foreground w-fit rounded-s-none shadow-none bg-gray-50">
                            {timeOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </SelectNative>
                    </div>
                </div> */}
            </div>

            <Button type="button" className="w-full">
                Bắt đầu
            </Button>
        </form>
    );
};
