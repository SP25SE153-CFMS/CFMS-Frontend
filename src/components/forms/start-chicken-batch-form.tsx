'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AlertCircle, CalendarIcon, Egg, Loader2, Plus, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { getChickenTypes } from '@/services/category.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getGrowthStages } from '@/services/growth-stage.service';
import { startChickenBatch } from '@/services/chicken-batch.service';
import type {
    ChickenCoopResponse,
    ChickenDetailRequest,
    StartChickenBatch,
} from '@/utils/types/custom.type';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { vi } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDate } from '@/utils/functions';
import Link from 'next/link';
import config from '@/configs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function StartChickenBatchForm({ closeDialog }: { closeDialog: () => void }) {
    const queryClient = useQueryClient();
    const { chickenCoopId }: { chickenCoopId: string } = useParams();

    const { data: chickenTypes } = useQuery({
        queryKey: ['chickenTypes'],
        queryFn: () => getChickenTypes(),
    });

    const { data: growthStages } = useQuery({
        queryKey: ['growthStages'],
        queryFn: () => getGrowthStages(),
    });

    const [chickenId, setChickenId] = useState('');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [chickenTypeId, setChickenTypeId] = useState('');
    const [chickenDetailRequests, setChickenDetailRequests] = useState<ChickenDetailRequest[]>([
        { gender: 0, quantity: 0 },
    ]);
    const [growDays, setGrowDays] = useState({ min: 0, max: 0 });

    useEffect(() => {
        const currentCoop: ChickenCoopResponse = JSON.parse(
            sessionStorage.getItem('currentCoop') || '{}',
        );
        const chickenTypeId = currentCoop?.purposeId;
        if (chickenTypeId) {
            setChickenTypeId(chickenTypeId);
        }
    }, []);

    const chickens = chickenTypes?.find(
        (type) => type.chickenType?.subCategoryId === chickenTypeId,
    )?.chickens;

    const mutation = useMutation({
        mutationFn: startChickenBatch,
        onSuccess: () => {
            toast.success('Bắt đầu lứa nuôi thành công');
            queryClient.invalidateQueries({ queryKey: ['chickenCoop', chickenCoopId] });
            closeDialog();
        },
        onError: (error: any) => {
            toast(error?.response?.data?.message || 'Có lỗi xảy ra', { icon: '⚠️' });
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (growDays.min > growDays.max) {
            toast('Số ngày nuôi tối thiểu phải nhỏ hơn số ngày nuôi tối đa', {
                icon: '⚠️',
            });
            return;
        }

        const formData: StartChickenBatch = {
            chickenCoopId,
            chickenBatchName: (e.target as HTMLFormElement).chickenBatchName.value,
            stageCode:
                growthStages?.find((stage) => stage.chickenType === chickenTypeId)?.stageCode ?? '',
            chickenId,
            startDate: dayjs(startDate).format('YYYY-MM-DD'),
            chickenDetailRequests,
            minGrowDays: growDays.min,
            maxGrowDays: growDays.max,
        };

        mutation.mutate(formData);
    };

    const totalQuantity = chickenDetailRequests.reduce((sum, detail) => sum + detail.quantity, 0);

    const selectedChickenType = chickenTypes?.find(
        (type) => type.chickenType?.subCategoryId === chickenTypeId,
    )?.chickenType?.subCategoryName;

    const filteredGrowthStages = growthStages
        ?.filter((stage) => stage.chickenType === chickenTypeId)
        // Remove duplicate stages
        .filter(
            (stage, index, self) =>
                index === self.findIndex((s) => s.stageCode === stage.stageCode),
        );

    const isFormValid = chickenId && totalQuantity > 0;

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-1">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="chickenBatchName" className="text-sm font-medium">
                            Tên lứa nuôi
                        </Label>
                        <Input
                            id="chickenBatchName"
                            placeholder="Nhập tên lứa nuôi (vd: Lứa nuôi gà đẻ trứng)"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Đặt tên dễ nhận biết cho lứa nuôi
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Ngày bắt đầu</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !startDate && 'text-muted-foreground',
                                    )}
                                >
                                    {formatDate(startDate.toISOString())}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                    mode="single"
                                    selected={startDate}
                                    locale={vi}
                                    onSelect={(day) => setStartDate(day ?? new Date())}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Loại gà</Label>
                        <div className="relative">
                            <Input
                                disabled
                                value={selectedChickenType || ''}
                                className="bg-muted/50 text-muted-foreground"
                            />
                            <Egg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>

                    {chickenTypeId && (
                        <>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Nhóm giai đoạn phát triển
                                </Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn nhóm giai đoạn phát triển" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-72">
                                        {filteredGrowthStages?.map((stage) => (
                                            <SelectItem
                                                key={stage.growthStageId}
                                                value={stage.growthStageId}
                                            >
                                                {stage.stageCode}
                                            </SelectItem>
                                        ))}
                                        {filteredGrowthStages?.length === 0 && (
                                            <div className="p-2">
                                                <Link
                                                    href={config.routes.growthStage}
                                                    className="text-sm font-medium flex items-center p-2 rounded-md hover:bg-muted"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Tạo giai đoạn phát triển mới
                                                </Link>
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Giống gà</Label>
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
                                        {chickens?.length === 0 && (
                                            <div className="p-2">
                                                <Link
                                                    href={config.routes.ware}
                                                    className="text-sm font-medium flex items-center p-2 rounded-md hover:bg-muted"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Thêm giống gà mới
                                                </Link>
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Ngày nuôi tối thiểu</Label>
                            <Input
                                type="number"
                                min={0}
                                placeholder="0"
                                onChange={(e) =>
                                    setGrowDays({
                                        ...growDays,
                                        min: Number(e.target.value),
                                    })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Ngày nuôi tối đa</Label>
                            <Input
                                type="number"
                                min={0}
                                placeholder="0"
                                onChange={(e) =>
                                    setGrowDays({
                                        ...growDays,
                                        max: Number(e.target.value),
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-medium">Chi tiết giống gà</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Thêm thông tin về số lượng và giới tính gà
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={chickenDetailRequests.length >= 2}
                            onClick={() =>
                                setChickenDetailRequests([
                                    ...chickenDetailRequests,
                                    {
                                        gender: chickenDetailRequests[0].gender === 0 ? 1 : 0,
                                        quantity: 0,
                                    },
                                ])
                            }
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm loại
                        </Button>
                    </div>

                    <Card className="border-dashed">
                        <CardContent className="p-4 space-y-4">
                            {chickenDetailRequests.map((detail, index) => (
                                <div key={index} className="space-y-2">
                                    {index > 0 && <Separator className="my-3" />}
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-medium">
                                            {detail.gender === 0 ? 'Gà trống' : 'Gà mái'}
                                        </h4>
                                        {chickenDetailRequests.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 text-destructive hover:text-destructive/90"
                                                onClick={() => {
                                                    const newDetails = [...chickenDetailRequests];
                                                    newDetails.splice(index, 1);
                                                    setChickenDetailRequests(newDetails);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Xóa
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label htmlFor={`gender-${index}`} className="text-xs">
                                                Giới tính
                                            </Label>
                                            <Select
                                                value={detail.gender.toString()}
                                                onValueChange={(value) => {
                                                    const newDetails = [...chickenDetailRequests];
                                                    newDetails[index].gender =
                                                        Number.parseInt(value);
                                                    setChickenDetailRequests(newDetails);
                                                }}
                                                disabled={chickenDetailRequests.length >= 2}
                                            >
                                                <SelectTrigger
                                                    id={`gender-${index}`}
                                                    className="mt-1"
                                                >
                                                    <SelectValue placeholder="Chọn giới tính" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem
                                                        value="0"
                                                        disabled={
                                                            index > 0 &&
                                                            chickenDetailRequests[0].gender === 0
                                                        }
                                                    >
                                                        Trống
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="1"
                                                        disabled={
                                                            index > 0 &&
                                                            chickenDetailRequests[0].gender === 1
                                                        }
                                                    >
                                                        Mái
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor={`quantity-${index}`}
                                                className="text-xs"
                                            >
                                                Số lượng
                                            </Label>
                                            <Input
                                                id={`quantity-${index}`}
                                                type="number"
                                                min="1"
                                                className="mt-1"
                                                value={detail.quantity}
                                                onChange={(e) => {
                                                    const newDetails = [...chickenDetailRequests];
                                                    newDetails[index].quantity =
                                                        Number.parseInt(e.target.value) || 0;
                                                    setChickenDetailRequests(newDetails);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {totalQuantity > 0 && (
                                <div className="flex justify-between items-center pt-2 mt-3 border-t">
                                    <span className="text-sm font-medium">Tổng số lượng:</span>
                                    <Badge variant="secondary" className="text-sm">
                                        {totalQuantity} con
                                    </Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {totalQuantity > 0 && (
                        <Alert
                            variant="default"
                            className="bg-blue-50 text-blue-800 border-blue-200"
                        >
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Thông tin lứa nuôi</AlertTitle>
                            <AlertDescription>
                                <ul className="text-xs space-y-1 mt-1">
                                    <li>
                                        • Lứa nuôi sẽ được bắt đầu từ ngày{' '}
                                        {formatDate(startDate.toISOString())}
                                    </li>
                                    <li>• Tổng số lượng gà: {totalQuantity} con</li>
                                    {growDays.min > 0 && (
                                        <li>• Số ngày nuôi tối thiểu: {growDays.min} ngày</li>
                                    )}
                                    {growDays.max > 0 && (
                                        <li>• Số ngày nuôi tối đa: {growDays.max} ngày</li>
                                    )}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    {!chickenId && chickens?.length === 0 && (
                        <Alert
                            variant="default"
                            className="bg-amber-50 text-amber-800 border-amber-200"
                        >
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Chưa có giống gà</AlertTitle>
                            <AlertDescription className="text-xs">
                                Bạn cần thêm giống gà trước khi bắt đầu lứa nuôi.{' '}
                                <Link href={config.routes.ware} className="font-medium underline">
                                    Thêm giống gà
                                </Link>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>

            <div className="flex justify-center">
                <Button
                    type="submit"
                    className="w-full max-w-xs"
                    disabled={mutation.isPending || !isFormValid}
                >
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        'Bắt đầu lứa nuôi'
                    )}
                </Button>
            </div>
        </form>
    );
}
