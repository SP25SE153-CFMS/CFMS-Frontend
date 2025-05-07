'use client';

import { DataTable } from '@/components/table/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { Columns3, Grid, Hourglass, Plus, Search } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ShiftForm from '@/components/forms/shift-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { deleteShift, getShifts } from '@/services/shift.service';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from '@/components/fallback-image';
import ShiftCard from './shift-card';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';
import { Shift } from '@/utils/schemas/shift.schema';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function Page() {
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [currentShift, setCurrentShift] = useState<Shift | null>();
    const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const openModal = () => setOpen(true);
    const onOpenChange = (val: boolean) => setOpen(val);

    const { data: shifts, isLoading } = useQuery({
        queryKey: ['shifts'],
        queryFn: async () => {
            const shifts = await getShifts();
            sessionStorage.setItem('shifts', JSON.stringify(shifts));
            return shifts;
        },
    });

    const queryClient = useQueryClient();

    const handleDelete = async () => {
        await deleteShift(currentShift?.shiftId || '').then(() => {
            toast.success('Xóa ca làm việc thành công');
            queryClient.invalidateQueries({ queryKey: ['shifts'] });
            setOpenDelete(false);
        });
    };

    const filteredShifts = shifts?.filter((shift) => {
        const shiftNameLower = shift.shiftName.toLowerCase();
        const searchQueryLower = searchQuery.toLowerCase();

        return shiftNameLower.includes(searchQueryLower);
    });

    // Check if shifts is loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
            </div>
        );
    }

    // Check if shifts is not null, undefined
    if (!shifts) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Card className="px-36 py-8">
                    <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                        <Image src="/no-data.jpg" width={300} height={300} alt="Not Found" />
                        <h1 className="text-2xl font-bold">Danh sách không tồn tại</h1>
                        <Button variant="outline" onClick={() => window.history.back()}>
                            Quay lại
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Return the page
    return (
        <>
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                            <Hourglass className="h-6 w-6 text-muted-foreground" />
                            <h1 className="text-2xl font-bold tracking-tight">
                                Quản lý ca làm việc
                            </h1>
                        </div>

                        <p className="text-muted-foreground">
                            Danh sách tất cả các ca làm việc trong trang trại
                        </p>
                    </div>

                    <Button className="space-x-1" onClick={openModal}>
                        <span>Thêm ca</span> <Plus size={18} />
                    </Button>
                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo ca làm việc mới</DialogTitle>
                                <DialogDescription>
                                    Hãy nhập các thông tin dưới đây.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[600px]">
                                <ShiftForm closeDialog={() => setOpen(false)} />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
                <Separator className="mb-6" />

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Tìm kiếm ca làm việc..."
                                    className="pl-8 w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-1 border rounded-md p-1">
                                <Button
                                    variant={viewMode === 'card' ? 'default' : 'ghost'}
                                    size="sm"
                                    className="h-7 px-4"
                                    onClick={() => setViewMode('card')}
                                >
                                    <Grid className="h-4 w-4" />
                                    <span>Dạng lưới</span>
                                </Button>
                                <Button
                                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                                    size="sm"
                                    className="h-7 px-4"
                                    onClick={() => setViewMode('table')}
                                >
                                    <Columns3 className="h-4 w-4" />
                                    <span>Dạng bảng</span>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {/* Card View */}
                        {viewMode === 'card' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredShifts?.map((shift) => (
                                    <ShiftCard
                                        key={shift.shiftId}
                                        shift={shift}
                                        setCurrentShift={setCurrentShift}
                                        setOpenUpdate={setOpenUpdate}
                                        setOpenDelete={setOpenDelete}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Table View */}
                        {viewMode === 'table' && (
                            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                                <DataTable data={filteredShifts || []} columns={columns} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Update Dialog */}
            <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật ca làm việc</DialogTitle>
                        <DialogDescription>Hãy nhập các thông tin dưới đây.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[600px]">
                        <ShiftForm
                            closeDialog={() => setOpenUpdate(false)}
                            defaultValues={currentShift as Shift}
                        />
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa ca làm việc này?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpenDelete(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Xóa
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
