'use client';

import EquipmentForm from '@/components/forms/equipment-form';
import { DataTable } from '@/components/table/data-table';
import { chickenCoops, coopEquipments, flocks } from '@/utils/data/table.data';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { Download, AlignRight, Plus, Database } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams } from 'next/navigation';
import dayjs from 'dayjs';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import PopoverWithOverlay from '@/components/popover-with-overlay';

const techinicalIndicators = [
    { id: 1, name: 'GÀ CHẾT', value: '9 con' },
    { id: 2, name: 'GÀ SỐNG', value: '42 con' },
    { id: 3, name: 'CÂN NẶNG TB', value: '0.12kg' },
    { id: 4, name: 'TỔNG ĐÀN', value: '51 con' },
    { id: 5, name: 'SL THU HOẠCH', value: '136 (1,36%)' },
];

// TODO: Optimize and shorten the code
export default function Page() {
    const { flockId } = useParams();

    const currentFlock = flocks.find((flock) => flock.flockId === flockId);

    if (!currentFlock) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Card className="px-36 py-8">
                    <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                        <Image src="/no-data.jpg" width={300} height={300} alt="Not Found" />
                        <h1 className="text-2xl font-bold">Đàn không tồn tại</h1>
                        <Button variant="outline" onClick={() => window.history.back()}>
                            Quay lại
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    Thông tin đàn gà
                    <span className="text-primary ml-2">{currentFlock?.name}</span>
                </h1>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Đổi chuồng nuôi..." />
                    </SelectTrigger>
                    <SelectContent>
                        {chickenCoops.map((coop) => (
                            <SelectItem key={coop.chickenCoopId} value={coop.chickenCoopId}>
                                {coop.chickenCoopName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-6">
                <div className="flex flex-col gap-4">
                    {/* Flock Details */}
                    <Card>
                        <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                    Thông tin chi tiết
                                </h3>
                                <PopoverWithOverlay>
                                    <PopoverTrigger>
                                        <AlignRight size={20} />
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Select defaultOpen>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Đổi đàn gà..." />
                                            </SelectTrigger>
                                            <SelectContent className="h-72">
                                                {flocks.map((flock) => (
                                                    <SelectItem
                                                        key={flock.flockId}
                                                        value={flock.flockId.toString()}
                                                    >
                                                        {flock.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </PopoverContent>
                                </PopoverWithOverlay>
                            </div>

                            <div className="flex gap-3 text-sm mb-4">
                                Mã đàn:{' '}
                                <strong className="flex-1 text-right">
                                    {currentFlock?.flockId}
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-4">
                                Số lượng:{' '}
                                <strong className="flex-1 text-right">
                                    {currentFlock?.quantity} con
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-4 justify-between">
                                Trạng thái: <Badge>{currentFlock?.status.toUpperCase()}</Badge>
                            </div>
                            <div className="flex gap-3 text-sm mb-4">
                                Ngày bắt đầu:{' '}
                                <strong className="flex-1 text-right">
                                    {dayjs(currentFlock?.startDate).format('DD/MM/YYYY')}
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-4">
                                Ngày kết thúc:{' '}
                                <strong className="flex-1 text-right">
                                    {currentFlock?.endDate
                                        ? dayjs(currentFlock?.endDate).format('DD/MM/YYYY')
                                        : 'Chưa kết thúc'}
                                </strong>
                            </div>

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

                    {/* Technical Indicators */}
                    <Card>
                        <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                    Chỉ số kỹ thuật
                                </h3>
                            </div>
                            <div className="flex flex-wrap justify-between">
                                {techinicalIndicators.map((indicator) => (
                                    <div
                                        key={indicator.id}
                                        className="flex flex-auto p-2 border gap-2 items-center"
                                    >
                                        <Database size={24} className="text-primary" />
                                        <div>
                                            <h4 className="text-xs uppercase font-semibold">
                                                {indicator.name}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                {indicator.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-span-2">
                    <Tabs defaultValue="nutritions" className="w-auto">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="nutritions">Chế độ dinh dưỡng</TabsTrigger>
                            <TabsTrigger value="calendar">Lịch cho ăn</TabsTrigger>
                            <TabsTrigger value="health">Nhật ký sức khỏe</TabsTrigger>
                            <TabsTrigger value="quantity">Nhật ký số lượng</TabsTrigger>
                        </TabsList>
                        <TabsContent value="nutritions">
                            <CardComponent title="Chế độ dinh dưỡng" />
                        </TabsContent>
                        <TabsContent value="calendar">
                            <CardComponent title="Lịch cho ăn" />
                        </TabsContent>
                        <TabsContent value="health">
                            <CardComponent title="Nhật ký sức khỏe" />
                        </TabsContent>
                        <TabsContent value="quantity">
                            <CardComponent title="Nhật ký số lượng" />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

// TODO: Split to a new file
const CardComponent = ({ title }: { title: string }) => {
    const [open, setOpen] = useState(false);

    const openModal = () => setOpen(true);
    const onOpenChange = (val: boolean) => setOpen(val);

    return (
        <Card className="p-6 mb-4">
            {/* Equipment List */}
            <div className="flex flex-wrap items-center justify-between gap-x-4 space-y-2">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                    <p className="text-muted-foreground">
                        Danh sách tất cả các trang thiết bị trong khu nuôi
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="space-x-1">
                        <span>Tải file</span> <Download size={18} />
                    </Button>
                    <Button className="space-x-1" onClick={openModal}>
                        <span>Thêm trang thiết bị</span> <Plus size={18} />
                    </Button>
                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Thêm trang thiết bị mới</DialogTitle>
                                <DialogDescription>
                                    Hãy nhập các thông tin dưới đây.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[600px]">
                                <EquipmentForm />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <DataTable data={coopEquipments} columns={columns} />
            </div>
        </Card>
    );
};
