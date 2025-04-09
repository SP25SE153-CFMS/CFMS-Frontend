import { useState } from 'react';
import { useParams } from 'next/navigation';
import { AlertCircle, CalendarIcon, Plus, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { getChickenTypes } from '@/services/category.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getGrowthStages } from '@/services/growth-stage.service';
import { startChickenBatch } from '@/services/chicken-batch.service';
import { ChickenDetailRequest, StartChickenBatch } from '@/utils/types/custom.type';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { vi } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { formatDate } from '@/utils/functions';

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

    const chickens = chickenTypes?.find((type) => type.subCategoryId === chickenTypeId)?.chickens;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData: StartChickenBatch = {
            chickenCoopId,
            chickenBatchName: (e.target as HTMLFormElement).chickenBatchName.value,
            stageCode:
                growthStages?.find((stage) => stage.chickenType === chickenTypeId)?.stageCode ?? '',
            chickenId,
            startDate: dayjs(startDate).format('YYYY-MM-DD'),
            chickenDetailRequests,
        };

        try {
            const response = await startChickenBatch(formData);
            toast.success(response.message);
            queryClient.invalidateQueries({ queryKey: ['chickenCoop', chickenCoopId] });
            closeDialog();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                    {/* Chicken batch name */}
                    <div className="*:not-first:mt-2">
                        <Label htmlFor={`chickenBatchName`}>Tên lứa nuôi</Label>
                        <Input
                            id={`chickenBatchName`}
                            placeholder="Lứa nuôi gà đẻ trứng"
                            required
                        />
                    </div>

                    {/* Start date */}
                    <div className="*:not-first:mt-2 grid gap-2">
                        <Label>Ngày bắt đầu</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    className={cn(
                                        'justify-start text-left font-normal',
                                        !startDate && 'text-muted-foreground',
                                    )}
                                >
                                    {formatDate(startDate.toISOString())}
                                    <CalendarIcon />
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

                    {/* Chicken type */}
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

                    {/* Growth stage */}
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

                <div className="*:not-first:mt-2">
                    <div className="flex justify-between items-center mb-2">
                        <Label htmlFor={`chickenBatchName`}>Chi tiết giống gà</Label>
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
                            Thêm
                        </Button>
                    </div>

                    <div className="space-y-4 border p-4 rounded-md">
                        {chickenDetailRequests.map((detail, index) => (
                            <div key={index} className="grid grid-cols-5 gap-4 pt-2">
                                <div className="col-span-2">
                                    <Label htmlFor={`gender-${index}`}>Giới tính</Label>
                                    <Select
                                        value={detail.gender.toString()}
                                        onValueChange={(value) => {
                                            const newDetails = [...chickenDetailRequests];
                                            newDetails[index].gender = Number.parseInt(value);
                                            setChickenDetailRequests(newDetails);
                                        }}
                                        disabled={chickenDetailRequests.length >= 2}
                                    >
                                        <SelectTrigger id={`gender-${index}`}>
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
                                <div className="col-span-2">
                                    <Label htmlFor={`quantity-${index}`}>Số lượng</Label>
                                    <Input
                                        id={`quantity-${index}`}
                                        type="number"
                                        min="0"
                                        value={detail.quantity}
                                        onChange={(e) => {
                                            const newDetails = [...chickenDetailRequests];
                                            newDetails[index].quantity =
                                                Number.parseInt(e.target.value) || 0;
                                            setChickenDetailRequests(newDetails);
                                        }}
                                    />
                                </div>
                                {index > 0 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="mt-6"
                                        onClick={() => {
                                            const newDetails = [...chickenDetailRequests];
                                            newDetails.splice(index, 1);
                                            setChickenDetailRequests(newDetails);
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                    </Button>
                                )}
                            </div>
                        ))}

                        {chickenDetailRequests.length > 0 && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Lưu ý</AlertTitle>
                                <AlertDescription>
                                    Tổng số lượng gà:{' '}
                                    {chickenDetailRequests.reduce(
                                        (sum, detail) => sum + detail.quantity,
                                        0,
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center">
                <Button type="submit" className="block w-lg">
                    Bắt đầu
                </Button>
            </div>
        </form>
    );
}
