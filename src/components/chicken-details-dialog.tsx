import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ChickenDetail } from '@/utils/schemas/chicken-detail.schema';
import { Egg, Info, Utensils, Weight } from 'lucide-react';
import { chickenGenderLabels, chickenGenderVariant } from '@/utils/enum/gender.enum';
import { Badge } from './ui/badge';

interface ChickenDetailsDialogProps {
    chickenDetails: ChickenDetail[];
    trigger: React.ReactNode;
}

export default function ChickenDetailsDialog({
    chickenDetails,
    trigger,
}: ChickenDetailsDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Weight className="h-4 w-4 mr-2 text-primary" />
                        Chi tiết giống gà:
                    </DialogTitle>
                    <DialogDescription>
                        Dưới đây là thông tin chi tiết về giống gà bạn đang chọn.
                    </DialogDescription>
                </DialogHeader>
                {chickenDetails?.length > 0 ? (
                    <div className="space-y-3">
                        <div className="grid gap-3">
                            {chickenDetails.map((detail, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-center mb-2 sm:mb-0">
                                        <Utensils className="h-4 w-4 mr-2 text-primary" />
                                        <span className="font-medium">
                                            Trọng lượng: {detail.weight || 0} kg
                                        </span>
                                    </div>

                                    <div className="flex items-center mb-2 sm:mb-0">
                                        <Egg className="h-4 w-4 mr-2 text-primary" />
                                        <span className="font-medium">
                                            Số lượng: {detail.quantity || 0}
                                        </span>
                                    </div>

                                    <Badge
                                        variant={chickenGenderVariant[detail.gender]}
                                        className="self-start sm:self-auto"
                                    >
                                        {chickenGenderLabels[detail.gender] ?? 'Không xác định'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-6">
                        <div className="text-center">
                            <Info className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                            <h3 className="text-lg font-medium">
                                Không có thông tin chi tiết về giống gà
                            </h3>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
