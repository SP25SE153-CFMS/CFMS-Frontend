'use client';

import type React from 'react';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { splitChickenBatch } from '@/services/chicken-batch.service';
import type {
    ChickenCoopResponse,
    ChickenDetailRequest,
    SplitChickenBatch,
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
import { getChickenCoopsByBreedingAreaId } from '@/services/chicken-coop.service';
import { Textarea } from '@/components/ui/textarea';
import { ChickenGender, chickenGenderLabels } from '@/utils/enum/gender.enum';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function SplitChickenBatchForm({ closeDialog }: { closeDialog: () => void }) {
    const queryClient = useQueryClient();
    const { chickenBatchId }: { chickenBatchId: string } = useParams();

    const { data: chickenCoops } = useQuery({
        queryKey: ['chickenCoops'],
        queryFn: () =>
            getChickenCoopsByBreedingAreaId(sessionStorage.getItem('breedingAreaId') ?? ''),
    });

    const { data: chickenTypes } = useQuery({
        queryKey: ['chickenTypes'],
        queryFn: () => getChickenTypes(),
    });

    const { data: growthStages } = useQuery({
        queryKey: ['growthStages'],
        queryFn: () => getGrowthStages(),
    });

    const [chickenCoopId, setChickenCoopId] = useState('');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [chickenTypeId, setChickenTypeId] = useState('');
    const [notes, setNotes] = useState('');
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

    const mutation = useMutation({
        mutationFn: splitChickenBatch,
        onSuccess: () => {
            toast.success('Tách lứa nuôi thành công');
            queryClient.invalidateQueries({ queryKey: ['chickenBatch', chickenBatchId] });
            closeDialog();
        },
        onError: (error: any) => {
            toast(error?.response?.data?.message || 'Có lỗi xảy ra', { icon: '⚠️' });
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData: SplitChickenBatch = {
            parentBatchId: chickenBatchId,
            chickenBatchName: (e.target as HTMLFormElement).chickenBatchName.value,
            chickenCoopId,
            chickenDetailRequests,
            stageCode:
                growthStages?.find((stage) => stage.chickenType === chickenTypeId)?.stageCode ?? '',
            startDate: dayjs(startDate).format('YYYY-MM-DD'),
            minGrowDays: growDays.min,
            maxGrowDays: growDays.max,
            notes,
        };

        mutation.mutate(formData);
    };

    const getQuantityMessage = useCallback(
        (gender: ChickenGender) => {
            const chickenDetails = JSON.parse(sessionStorage.getItem('chickenDetails') || '[]');
            const detail = chickenDetails.find(
                (item: ChickenDetailRequest) => item.gender === gender,
            );
            const currentQuantityInForm = chickenDetailRequests?.find(
                (item) => item.gender === gender,
            );
            if (!currentQuantityInForm) return '';
            if (!detail) return `Không tồn tại ${chickenGenderLabels[gender]?.toLowerCase()}`;
            if (currentQuantityInForm?.quantity > detail.quantity) {
                return `Số lượng ${chickenGenderLabels[detail.gender]?.toLowerCase()} không được vượt quá ${detail.quantity}`;
            }
            return '';
        },
        [chickenDetailRequests],
    );

    const roosterQuantityMessage = useMemo(
        () => getQuantityMessage(ChickenGender.ROOSTER),
        [getQuantityMessage],
    );

    const henQuantityMessage = useMemo(
        () => getQuantityMessage(ChickenGender.HEN),
        [getQuantityMessage],
    );

    const isErrorQuantity = useMemo(() => {
        return !!roosterQuantityMessage || !!henQuantityMessage;
    }, [roosterQuantityMessage, henQuantityMessage]);

    const totalQuantity = useMemo(() => {
        return chickenDetailRequests.reduce((sum, detail) => sum + detail.quantity, 0);
    }, [chickenDetailRequests]);

    const selectedChickenType = useMemo(() => {
        return chickenTypes?.find((type) => type?.chickenType?.subCategoryId === chickenTypeId)
            ?.chickenType?.subCategoryName;
    }, [chickenTypes, chickenTypeId]);

    const filteredGrowthStages = useMemo(() => {
        return (
            growthStages
                ?.filter((stage) => stage.chickenType === chickenTypeId)
                // Remove duplicate stages
                .filter(
                    (stage, index, self) =>
                        index === self.findIndex((s) => s.stageCode === stage.stageCode),
                )
        );
    }, [growthStages, chickenTypeId]);

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-1">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="chickenBatchName" className="text-sm font-medium">
                            Tên lứa nuôi mới
                        </Label>
                        <Input id="chickenBatchName" placeholder="Nhập tên lứa nuôi mới" required />
                        <p className="text-xs text-muted-foreground">
                            Đặt tên dễ nhận biết cho lứa nuôi mới
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
                                    disabled={(date) => date < new Date()}
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
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Nhóm giai đoạn phát triển</Label>
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
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Số ngày nuôi tối thiểu</Label>
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
                            <Label className="text-sm font-medium">Số ngày nuôi tối đa</Label>
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

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Chuồng tiếp nhận</Label>
                        <Select defaultValue={chickenCoopId} onValueChange={setChickenCoopId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn chuồng tiếp nhận" />
                            </SelectTrigger>
                            <SelectContent className="max-h-72">
                                {chickenCoops?.map((coop) => (
                                    <SelectItem key={coop.chickenCoopId} value={coop.chickenCoopId}>
                                        {coop.chickenCoopName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Đây là chuồng mà lứa nuôi sẽ được lưu sau khi tách lứa
                        </p>
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
                                                placeholder="0"
                                                className="mt-1"
                                                value={
                                                    detail.quantity ? detail.quantity : undefined
                                                }
                                                onChange={(e) => {
                                                    const newDetails = [...chickenDetailRequests];
                                                    newDetails[index].quantity =
                                                        Number.parseInt(e.target.value) || 0;
                                                    setChickenDetailRequests(newDetails);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {detail.gender === ChickenGender.ROOSTER &&
                                        roosterQuantityMessage && (
                                            <p className="text-destructive text-xs flex items-center mt-1">
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {roosterQuantityMessage}
                                            </p>
                                        )}
                                    {detail.gender === ChickenGender.HEN && henQuantityMessage && (
                                        <p className="text-destructive text-xs flex items-center mt-1">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {henQuantityMessage}
                                        </p>
                                    )}
                                </div>
                            ))}

                            {totalQuantity > 0 && (
                                <div className="flex justify-between items-center pt-2 mt-3 border-t">
                                    <span className="text-sm font-medium">Tổng số lượng:</span>
                                    <Badge variant="default" className="text-sm">
                                        {totalQuantity} con
                                    </Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {totalQuantity > 0 && (
                        <Alert
                            variant="default"
                            className="bg-amber-50 text-amber-800 border-amber-200"
                        >
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Lưu ý khi tách lứa</AlertTitle>
                            <AlertDescription className="text-xs">
                                Vui lòng kiểm tra kỹ số lượng gà tách. Sau khi xác nhận sẽ không thể
                                hoàn tác.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Ghi chú</Label>
                        <Textarea
                            placeholder="Nhập ghi chú về việc tách lứa nuôi..."
                            className="resize-none min-h-[80px]"
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {/* <div className="bg-muted/30 p-4 rounded-lg border mt-4">
                        <h4 className="text-sm font-medium mb-2 flex items-center">
                            <ChevronRight className="w-4 h-4 mr-1" />
                            Thông tin tách lứa
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span className="text-muted-foreground">Lứa gốc:</span>
                                <span className="font-medium">#{chickenBatchId}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-muted-foreground">Ngày tách:</span>
                                <span className="font-medium">
                                    {formatDate(new Date().toISOString())}
                                </span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-muted-foreground">Số lượng tách:</span>
                                <span className="font-medium">{totalQuantity} con</span>
                            </li>
                        </ul>
                    </div> */}
                </div>
            </div>

            <div className="flex justify-center">
                <Button
                    type="submit"
                    className="w-full max-w-xs"
                    disabled={
                        isErrorQuantity ||
                        mutation.isPending ||
                        totalQuantity === 0 ||
                        !chickenCoopId
                    }
                >
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        'Xác nhận tách lứa'
                    )}
                </Button>
            </div>
        </form>
    );
}
