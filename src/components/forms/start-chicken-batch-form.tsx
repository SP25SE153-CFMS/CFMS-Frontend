import { useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { getChickenTypes } from '@/services/category.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getGrowthStages } from '@/services/growth-stage.service';
import { startChickenBatch } from '@/services/chicken-batch.service';
import { StartChickenBatch } from '@/utils/types/custom.type';
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
                                    !startDate && 'text-muted-foreground',
                                )}
                            >
                                <CalendarIcon />
                                {format(startDate, 'PPP')}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                                mode="single"
                                selected={startDate}
                                onSelect={(day) => setStartDate(day ?? new Date())}
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

            <Button type="submit" className="w-full">
                Bắt đầu
            </Button>
        </form>
    );
}
