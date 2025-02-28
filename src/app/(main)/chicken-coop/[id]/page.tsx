'use client';

import EquipmentForm from '@/components/equipment-form';
import { DataTable } from '@/components/table/data-table';
import { chickenCoops, coopEquipments } from '@/utils/data/table.data';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
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
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import dayjs from 'dayjs';

export default function Page() {
    const [open, setOpen] = useState(false);

    const openModal = () => setOpen(true);
    const onOpenChange = (val: boolean) => setOpen(val);

    const { id: chickenCoopId } = useParams();
    console.log(useParams());

    const currentCoop = chickenCoops.find((coop) => coop.chickenCoopId === chickenCoopId);

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">
                Thông tin chuồng nuôi
                <span className="text-primary ml-2">{currentCoop?.chickenCoopName}</span>
            </h1>
            <Card className="my-4">
                <div className="flex gap-6 w-full p-3 relative flex-col sm:flex-row sm:px-6 sm:py-4">
                    <Image
                        src={
                            currentCoop?.image ??
                            'https://blackdoctor.org/wp-content/uploads/2020/07/GettyImages-1134731964-1536x1026.jpg'
                        }
                        width={500}
                        height={200}
                        className="flex-1 rounded-lg object-cover max-h-96"
                        alt={currentCoop?.chickenCoopName ?? ''}
                    />

                    <div className="rounded bg-slate-50 p-4 max-w-80">
                        <h3 className="font-bold text-xl pl-3 mb-4 relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                            Thông tin
                        </h3>
                        <div className="flex gap-3 text-md mb-4">
                            Mã chuồng gà:{' '}
                            <strong className="flex-1 text-right">
                                {currentCoop?.chickenCoopCode}
                            </strong>
                        </div>
                        <div className="flex gap-3 text-md mb-4">
                            Tên chuồng gà:{' '}
                            <strong className="flex-1 text-right">
                                {currentCoop?.chickenCoopName}
                            </strong>
                        </div>
                        <div className="flex gap-3 text-md mb-4">
                            Số lượng:{' '}
                            <strong className="flex-1 text-right">
                                {currentCoop?.capacity} con
                            </strong>
                        </div>
                        <div className="flex gap-3 text-md mb-4">
                            Vị trí:{' '}
                            <strong className="flex-1 text-right">{currentCoop?.location}</strong>
                        </div>
                        <div className="flex gap-3 text-md mb-4 items-center justify-between">
                            Trạng thái:{' '}
                            <div className="flex gap-2 rounded bg-slate-200 py-2 px-4 items-center">
                                {currentCoop?.status}
                            </div>
                        </div>
                        <div className="flex gap-3 text-md mb-4">
                            Ngày tạo:{' '}
                            <strong className="flex-1 text-right">
                                {dayjs(currentCoop?.createdAt).format('DD/MM/YYYY')}
                            </strong>
                        </div>
                        <div className="flex gap-3 text-md mb-4">
                            Ngày cập nhật:{' '}
                            <strong className="flex-1 text-right">
                                {dayjs(currentCoop?.updatedAt)?.format('DD/MM/YYYY')}
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
                </div>
            </Card>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2 mt-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Danh sách trang thiết bị</h2>
                    <p className="text-muted-foreground">
                        Danh sách tất cả các trang thiết bị trong khu nuôi
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="space-x-1">
                        <span>Nhập file</span> <Download size={18} />
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
        </div>
    );
}
