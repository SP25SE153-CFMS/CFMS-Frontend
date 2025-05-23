import ChickenCoopForm from '@/components/forms/chicken-coop-form';
import InfoItem from '@/components/info-item';
import PopoverWithOverlay from '@/components/popover-with-overlay';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import config from '@/configs';
import { useChickenCoopStore } from '@/store/chicken-coop.store';
import { chickenCoopStatusLabels, chickenCoopStatusVariant } from '@/utils/enum/status.enum';
import { getAreaUnit, getDensityUnit } from '@/utils/functions/category.function';
import { BreedingArea } from '@/utils/schemas/breeding-area.schema';
import { ChickenCoop } from '@/utils/schemas/chicken-coop.schema';
import { Select } from '@radix-ui/react-select';
import {
    AlignRight,
    Baseline,
    Code,
    Container,
    LandPlot,
    PencilLine,
    ScanEye,
    Sigma,
    Tag,
    TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ChickenCoopDetails = () => {
    const [open, setOpen] = useState(false);
    const { chickenCoop, setChickenCoop } = useChickenCoopStore();
    const router = useRouter();
    const chickenCoops: ChickenCoop[] = JSON.parse(sessionStorage.getItem('chickenCoops') ?? '[]');

    const breedingAreas: BreedingArea[] = JSON.parse(
        sessionStorage.getItem('breedingAreas') ?? '[]',
    );

    const currentBreedingArea = breedingAreas?.find(
        (area) => area.breedingAreaId === chickenCoop?.breedingAreaId,
    );

    const handleCoopChange = (coopId: string) => {
        const selectedCoop = chickenCoops.find((coop) => coop.chickenCoopId === coopId);
        if (selectedCoop) {
            setChickenCoop(selectedCoop);
            router.push(`${config.routes.chickenCoop}/${coopId}`);
        }
    };

    return (
        <Card>
            <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4 sm:pb-0">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                        Thông tin chi tiết
                    </h3>
                    <PopoverWithOverlay>
                        <PopoverTrigger>
                            <AlignRight size={20} />
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                            <Select onValueChange={(coopId) => handleCoopChange(coopId)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Đổi chuồng nuôi..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-72">
                                    {chickenCoops.map((coop) => (
                                        <SelectItem
                                            key={coop.chickenCoopId}
                                            value={coop.chickenCoopId}
                                        >
                                            {coop.chickenCoopName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </PopoverContent>
                    </PopoverWithOverlay>
                </div>

                <InfoItem
                    label="Mã chuồng gà"
                    value={chickenCoop?.chickenCoopCode}
                    icon={<Code size={16} />}
                />

                <InfoItem
                    label="Tên chuồng gà"
                    value={chickenCoop?.chickenCoopName}
                    icon={<Tag size={16} />}
                />

                <InfoItem
                    label="Số lượng hiện tại"
                    value={`${chickenCoop?.currentQuantity ?? 0} con`}
                    icon={<Container size={16} />}
                />

                <InfoItem
                    label="Sức chứa"
                    // value={`${Number(chickenCoop?.area) * Number(chickenCoop?.density)} con`}
                    value={`${Number(chickenCoop?.maxQuantity)} con`}
                    icon={<Sigma size={16} />}
                />

                <InfoItem
                    label="Khu nuôi"
                    value={currentBreedingArea?.breedingAreaName ?? '-'}
                    icon={<Baseline size={16} />}
                />

                <InfoItem
                    label="Diện tích"
                    value={`${chickenCoop?.area ?? '-'} ${getAreaUnit(chickenCoop?.areaUnitId ?? '')}`}
                    icon={<LandPlot size={16} />}
                />

                <InfoItem
                    label="Mật độ"
                    value={`${chickenCoop?.density ?? '-'} ${getDensityUnit(chickenCoop?.densityUnitId ?? '')}`}
                    icon={<ScanEye size={16} />}
                />

                <InfoItem
                    label="Trạng thái"
                    value={
                        chickenCoop?.status || chickenCoop?.status === 0 ? (
                            <Badge
                                variant={chickenCoopStatusVariant[chickenCoop?.status]}
                                className="ml-2 animate-in fade-in"
                            >
                                {chickenCoopStatusLabels[chickenCoop?.status]}
                            </Badge>
                        ) : (
                            '-'
                        )
                    }
                    icon={<TrendingUp size={16} />}
                />
            </div>
            <CardFooter className="pb-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <PencilLine />
                            Cập nhật
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Cập nhật chuồng nuôi</DialogTitle>
                            <DialogDescription>
                                Hãy nhập các thông tin dưới đây để cập nhật chuồng nuôi
                            </DialogDescription>
                        </DialogHeader>
                        {chickenCoop && (
                            <ScrollArea className="max-h-[82vh]">
                                <ChickenCoopForm
                                    closeDialog={() => setOpen(false)}
                                    defaultValues={chickenCoop}
                                />
                            </ScrollArea>
                        )}
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
};

export default ChickenCoopDetails;
