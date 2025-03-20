import dayjs from 'dayjs';
import { Download, AlignRight } from 'lucide-react';

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
import { Card, CardFooter } from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import { getChickenBatches } from '@/services/chicken-batch.service';
import { useQuery } from '@tanstack/react-query';
import { downloadCSV } from '@/utils/functions/download-csv.function';
import { ChickenBatch } from '@/utils/schemas/chicken-batch.schema';
import { useEffect, useState } from 'react';
import { chickenBatchStatusLabels, chickenBatchStatusVariant } from '@/utils/enum/status.enum';

const ChickenBatchDetails = ({ chickenCoopId }: { chickenCoopId: string }) => {
    const { data: chickenBatches } = useQuery({
        queryKey: ['chickenBatches'],
        queryFn: () => getChickenBatches(),
    });

    console.log(
        chickenBatches?.find((batch) => batch.chickenCoopId === chickenCoopId) ||
            chickenBatches?.[0],
    );

    const [currentChickenBatch, setCurrentChickenBatch] = useState<ChickenBatch>();

    useEffect(() => {
        if (chickenBatches) {
            setCurrentChickenBatch(
                chickenBatches.find((batch) => batch.chickenCoopId === chickenCoopId) ||
                    chickenBatches[0],
            );
        }
    }, [chickenBatches, chickenCoopId]);

    return (
        <Card>
            <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                        Thông tin lứa nuôi
                    </h3>
                    <PopoverWithOverlay>
                        <PopoverTrigger>
                            <AlignRight size={20} />
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                            <Select
                                defaultOpen
                                onValueChange={(batchId) =>
                                    setCurrentChickenBatch(
                                        chickenBatches?.find(
                                            (batch) => batch.chickenBatchId === batchId,
                                        ),
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Đổi lứa nuôi..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {chickenBatches?.map((batch) => (
                                        <SelectItem
                                            key={batch.chickenBatchId}
                                            value={batch.chickenBatchId}
                                        >
                                            {batch.chickenBatchName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </PopoverContent>
                    </PopoverWithOverlay>
                </div>

                <h3 className="mb-2 font-semibold">{currentChickenBatch?.chickenBatchName}</h3>
                <div className="flex gap-3 text-sm mb-2">
                    Thời gian từ:{' '}
                    <strong className="flex-1 text-right">
                        {dayjs(currentChickenBatch?.startDate).format('DD/MM/YYYY')}
                    </strong>
                </div>
                <div className="flex gap-3 text-sm mb-2">
                    Trạng thái:{' '}
                    <strong className="flex-1 text-right">
                        {currentChickenBatch?.status ? (
                            <Badge variant={chickenBatchStatusVariant[currentChickenBatch?.status]}>
                                {chickenBatchStatusLabels[currentChickenBatch?.status]}
                            </Badge>
                        ) : (
                            '-'
                        )}
                    </strong>
                </div>
            </div>

            <CardFooter className="flex flex-col gap-2">
                <Button
                    variant="outline"
                    className="w-full space-x-1"
                    onClick={() => downloadCSV(chickenBatches || [], 'chicken-batches.csv')}
                >
                    <span>Tải file Excel</span> <Download size={18} />
                </Button>
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
                                Ấn kết thúc khi lứa nuôi đã hoàn thành để có được thống kê hoạt động
                                và bắt đầu một lứa nuôi mới.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction>Kết thúc</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
};

export default ChickenBatchDetails;
