'use client';

import EquipmentForm from '@/components/forms/equipment-form';
import { DataTable } from '@/components/table/data-table';
import {
    breedingAreas,
    chickenBatches,
    chickenCoops,
    coopEquipments,
} from '@/utils/data/table.data';
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
import { Card, CardFooter } from '@/components/ui/card';
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
import { Chart } from './chart';
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

const techinicalIndicators = [
    { id: 1, name: 'NGÀY NUÔI', value: '9' },
    { id: 2, name: 'TỔNG ĐÀN', value: '9820 con' },
    { id: 3, name: 'CÂN NẶNG TB', value: '0.12kg' },
    { id: 4, name: 'MẬT ĐỘ', value: '9.18 con/m2' },
    { id: 5, name: 'SL THU HOẠCH', value: '136 (1,36%)' },
];

// TODO: Optimize and shorten the code
export default function Page() {
    const { chickenCoopId } = useParams();

    const currentCoop = chickenCoops.find((coop) => coop.chickenCoopId === chickenCoopId);
    const currentChickenBatch = chickenBatches.find(
        (batch) => batch.chickenCoopId === chickenCoopId,
    );

    if (!currentCoop) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Card className="px-36 py-8">
                    <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                        <Image src="/no-data.jpg" width={300} height={300} alt="Not Found" />
                        <h1 className="text-2xl font-bold">Chuồng nuôi không tồn tại</h1>
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
                    Thông tin chuồng nuôi
                    <span className="text-primary ml-2">{currentCoop?.chickenCoopName}</span>
                </h1>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Đổi khu nuôi..." />
                    </SelectTrigger>
                    <SelectContent>
                        {breedingAreas.map((area) => (
                            <SelectItem key={area.breedingAreaId} value={area.breedingAreaId}>
                                {area.breedingAreaName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-6">
                <div className="flex flex-col gap-4">
                    {/* Chicken Coop Details */}
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
                                        <Select defaultOpen>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Đổi chuồng nuôi..." />
                                            </SelectTrigger>
                                            <SelectContent className="h-72">
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
                                <strong className="flex-1 text-right">
                                    {currentCoop?.chickenCoopCode}
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-4">
                                Tên chuồng gà:{' '}
                                <strong className="flex-1 text-right">
                                    {currentCoop?.chickenCoopName}
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-4">
                                Số lượng:{' '}
                                <strong className="flex-1 text-right">
                                    {currentCoop?.capacity} con
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-4">
                                Vị trí:{' '}
                                <strong className="flex-1 text-right">
                                    {currentCoop?.location}
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-4 items-center justify-between">
                                Trạng thái: <Badge>{currentCoop?.status}</Badge>
                            </div>
                            <div className="flex gap-3 text-sm mb-4">
                                Ngày tạo:{' '}
                                <strong className="flex-1 text-right">
                                    {dayjs(currentCoop?.createdAt).format('DD/MM/YYYY')}
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-4">
                                Ngày cập nhật:{' '}
                                <strong className="flex-1 text-right">
                                    {currentCoop?.updatedAt
                                        ? dayjs(currentCoop?.updatedAt)?.format('DD/MM/YYYY')
                                        : '-'}
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

                    {/* Chicken Batch Details */}
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
                                        <Select defaultOpen>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Đổi lứa nuôi..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {chickenBatches.map((batch) => (
                                                    <SelectItem
                                                        key={batch.chickenBatchId}
                                                        value={batch.chickenBatchId}
                                                    >
                                                        {batch.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </PopoverContent>
                                </PopoverWithOverlay>
                            </div>

                            <h3 className="mb-2 font-semibold">{currentChickenBatch?.name}</h3>
                            <div className="flex gap-3 text-sm mb-2">
                                Thời gian từ:{' '}
                                <strong className="flex-1 text-right">
                                    {dayjs(currentChickenBatch?.startDate).format('DD/MM/YYYY')}
                                </strong>
                            </div>
                            <div className="flex gap-3 text-sm mb-2">
                                Trạng thái:{' '}
                                <strong className="flex-1 text-right">
                                    <Badge>{currentChickenBatch?.status?.toUpperCase()}</Badge>
                                </strong>
                            </div>
                        </div>

                        <CardFooter className="flex flex-col gap-2">
                            <Button variant="outline" className="w-full space-x-1">
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
                                            Ấn kết thúc khi lứa nuôi đã hoàn thành để có được thống
                                            kê hoạt động và bắt đầu một lứa nuôi mới.
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

                    {/* Expense Chart */}
                    <Chart />
                </div>
                <div className="col-span-2">
                    <Card className="p-6 mb-6">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight">
                                    Chỉ số kỹ thuật
                                </h2>
                                <p className="text-muted-foreground">
                                    Danh sách tất cả chỉ số kỹ thuật của chuồng nuôi
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="space-x-1">
                                    <span>Mục tiêu</span> <Plus size={18} />
                                </Button>
                            </div>
                        </div>
                        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                            <div className="flex justify-between">
                                {techinicalIndicators.map((indicator) => (
                                    <div
                                        key={indicator.id}
                                        className="flex-1 flex p-2 border gap-2 items-center"
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

                    <Tabs defaultValue="chickens" className="w-auto">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="chickens">Đàn gà</TabsTrigger>
                            <TabsTrigger value="employees">Nhân công</TabsTrigger>
                            <TabsTrigger value="equipment">Trang thiết bị</TabsTrigger>
                            <TabsTrigger value="harvest">Thu hoạch</TabsTrigger>
                        </TabsList>
                        <TabsContent value="chickens">
                            <CardComponent title="Danh sách đàn gà" />
                            <CardComponent title="Thông tin đàn gà" />
                        </TabsContent>
                        <TabsContent value="employees">
                            <CardComponent title="Danh sách nhân công" />
                        </TabsContent>
                        <TabsContent value="equipment">
                            <CardComponent title="Danh sách trang thiết bị" />
                        </TabsContent>
                        <TabsContent value="harvest">
                            <CardComponent title="Quản lý thu hoạch" />
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
