'use client';

import { DataTable } from '@/components/table/data-table';
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
// } from '@/components/ui/dialog';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { downloadCSV } from '@/utils/functions/download-csv.function';
import { columns } from './columns';
import { NutritionPlanDetail } from '@/utils/schemas/nutrition-plan-detail.schema';

interface CardFoodProps {
    nutritionPlanDetails: NutritionPlanDetail[];
}

export default function CardFood({ nutritionPlanDetails }: CardFoodProps) {
    // const [open, setOpen] = useState(false);

    // const openModal = () => setOpen(true);
    // const onOpenChange = (val: boolean) => setOpen(val);

    return (
        <Card className="p-6 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-x-4 space-y-2">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Danh sách thức ăn</h2>
                    <p className="text-muted-foreground">Danh sách các thức ăn cho gà</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="space-x-1"
                        onClick={() => downloadCSV(nutritionPlanDetails, 'foods.csv')}
                    >
                        <span>Tải file</span> <Download size={18} />
                    </Button>
                    {/* <Button className="space-x-1" onClick={openModal}>
                        <span>Thêm thức ăn</span> <Plus size={18} />
                    </Button> */}
                    {/* <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Thêm thức ăn mới</DialogTitle>
                                <DialogDescription>
                                    Hãy nhập các thông tin dưới đây.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[600px]">
                                <AutoForm formSchema={CreateFoodSchema}>
                                    <Button type="submit"> Gửi</Button>
                                </AutoForm>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog> */}
                </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <DataTable data={nutritionPlanDetails} columns={columns} />
            </div>
        </Card>
    );
}
