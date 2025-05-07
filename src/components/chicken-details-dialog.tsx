'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ChickenGender } from '@/utils/enum/gender.enum';
import type { ChickenDetail } from '@/utils/schemas/chicken-detail.schema';
import { Info, Users } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface ChickenDetailsDialogProps {
    chickenDetails: ChickenDetail[];
    trigger: React.ReactNode;
}

export default function ChickenDetailsDialog({
    chickenDetails,
    trigger,
}: ChickenDetailsDialogProps) {
    // Calculate summary statistics
    const totalChickens = chickenDetails.reduce((sum, detail) => sum + (detail.quantity || 0), 0);
    const totalRoosters = chickenDetails
        .filter((detail) => detail.gender === ChickenGender.ROOSTER) // Assuming 0 is rooster based on the code
        .reduce((sum, detail) => sum + (detail.quantity || 0), 0);
    const totalHens = chickenDetails
        .filter((detail) => detail.gender === ChickenGender.HEN) // Assuming 1 is hen based on the code
        .reduce((sum, detail) => sum + (detail.quantity || 0), 0);

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-xl">
                        <Info className="h-5 w-5 mr-2 text-primary" />
                        Chi tiết giống gà
                    </DialogTitle>
                    <DialogDescription>
                        Thông tin chi tiết về số lượng gà trống và gà mái trong đàn
                    </DialogDescription>
                </DialogHeader>

                <Card>
                    <CardContent className="pt-6">
                        {chickenDetails?.length > 0 ? (
                            <div className="space-y-4">
                                {/* Summary Section */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/10 border border-primary/20">
                                        <Users className="h-5 w-5 mb-1 text-primary" />
                                        <span className="text-sm text-muted-foreground">
                                            Tổng số
                                        </span>
                                        <span className="text-xl font-bold">{totalChickens}</span>
                                    </div>

                                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                        <div className="h-5 w-5 mb-1 text-blue-500">♂</div>
                                        <span className="text-sm text-muted-foreground">
                                            Gà trống
                                        </span>
                                        <span className="text-xl font-bold text-blue-500">
                                            {totalRoosters}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                                        <div className="h-5 w-5 mb-1 text-pink-500">♀</div>
                                        <span className="text-sm text-muted-foreground">
                                            Gà mái
                                        </span>
                                        <span className="text-xl font-bold text-pink-500">
                                            {totalHens}
                                        </span>
                                    </div>
                                </div>

                                {/* Visualization */}
                                <div className="relative h-6 bg-muted rounded-full overflow-hidden mb-4">
                                    {totalChickens > 0 && (
                                        <>
                                            <div
                                                className="absolute h-full bg-blue-500 transition-all duration-500"
                                                style={{
                                                    width: `${(totalRoosters / totalChickens) * 100}%`,
                                                }}
                                            />
                                            <div
                                                className="absolute h-full bg-pink-500 transition-all duration-500"
                                                style={{
                                                    width: `${(totalHens / totalChickens) * 100}%`,
                                                    left: `${(totalRoosters / totalChickens) * 100}%`,
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-4">
                                    <span>
                                        Gà trống:{' '}
                                        {Math.round((totalRoosters / totalChickens) * 100) || 0}%
                                    </span>
                                    <span>
                                        Gà mái: {Math.round((totalHens / totalChickens) * 100) || 0}
                                        %
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center p-8">
                                <div className="text-center">
                                    <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                        <Info className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-1">
                                        Không có thông tin chi tiết
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Chưa có dữ liệu về giống gà này
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
}
