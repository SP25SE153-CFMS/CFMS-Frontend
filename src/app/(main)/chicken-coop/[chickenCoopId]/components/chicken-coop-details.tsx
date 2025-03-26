import PopoverWithOverlay from '@/components/popover-with-overlay';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import config from '@/configs';
import { getBreedingAreas } from '@/services/breeding-area.service';
import { useChickenCoopStore } from '@/store/use-chicken-coop';
import { chickenBatchStatusVariant, chickenCoopStatusLabels } from '@/utils/enum/status.enum';
import { ChickenCoop } from '@/utils/schemas/chicken-coop.schema';
import { Select } from '@radix-ui/react-select';
import { useQuery } from '@tanstack/react-query';
import { AlignRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ChickenCoopDetails = () => {
    const { chickenCoop, setChickenCoop } = useChickenCoopStore();
    const router = useRouter();
    const chickenCoops: ChickenCoop[] = JSON.parse(sessionStorage.getItem('chickenCoops') ?? '[]');

    const { data: breedingAreas } = useQuery({
        queryKey: ['breedingAreas'],
        queryFn: () => getBreedingAreas(),
    });

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
            <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                        Thông tin chuồng nuôi
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

                <div className="flex gap-3 text-sm mb-4">
                    Mã chuồng gà:{' '}
                    <strong className="flex-1 text-right">{chickenCoop?.chickenCoopCode}</strong>
                </div>
                <div className="flex gap-3 text-sm mb-4">
                    Tên chuồng gà:{' '}
                    <strong className="flex-1 text-right">{chickenCoop?.chickenCoopName}</strong>
                </div>
                <div className="flex gap-3 text-sm mb-4">
                    Số lượng:{' '}
                    <strong className="flex-1 text-right">{chickenCoop?.capacity} con</strong>
                </div>
                <div className="flex gap-3 text-sm mb-4">
                    Khu nuôi:{' '}
                    <strong className="flex-1 text-right">
                        {currentBreedingArea?.breedingAreaName ?? '-'}
                    </strong>
                </div>
                <div className="flex gap-3 text-sm mb-4 items-center justify-between">
                    Trạng thái:{' '}
                    {chickenCoop?.status ? (
                        <Badge variant={chickenBatchStatusVariant[chickenCoop?.status]}>
                            {chickenCoopStatusLabels[chickenCoop?.status]}
                        </Badge>
                    ) : (
                        '-'
                    )}
                </div>
                {/* <div className="flex gap-3 text-sm mb-4">
                    Ngày tạo:{' '}
                    <strong className="flex-1 text-right">
                        {dayjs(chickenCoop?.createdAt).format('DD/MM/YYYY')}
                    </strong>
                </div>
                <div className="flex gap-3 text-sm mb-4">
                    Ngày cập nhật:{' '}
                    <strong className="flex-1 text-right">
                        {chickenCoop?.updatedAt
                            ? dayjs(chickenCoop?.updatedAt)?.format('DD/MM/YYYY')
                            : '-'}
                    </strong>
                </div> */}

                {/* Uncomment this code when you want to update */}
                {/* <div className="flex flex-row gap-x-3 gap-y-3 sm:flex-col mt-8">
                    <Button
                        component={Link}
                        to={`/dashboard/center/${centerId}/court/${courtId}/update`}
                        className="py-[10px] flex-1"
                        leftSection={<GrUpdate />}
                    >
                        Cập nhật
                    </Button> 
                </div> */}
            </div>
        </Card>
    );
};

export default ChickenCoopDetails;
