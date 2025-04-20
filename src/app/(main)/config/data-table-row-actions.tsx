import { useState } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { deleteConfig } from '@/services/config.service';
import { toast } from 'react-hot-toast';
import { ConfigForm } from '@/components/config-form';
import { SystemConfig } from '@/utils/schemas/config.schema';
interface Props {
    row: Row<SystemConfig>;
}

export function DataTableRowActions({ row }: Props) {
    // const [openDetail, setOpenDetail] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const queryClient = useQueryClient();
    const config = row.original;

    const handleDelete = async () => {
        try {
            await deleteConfig(config.systemConfigId);
            toast.success('Xóa cấu hình thành công');
            queryClient.invalidateQueries({ queryKey: ['configs'] });
            setOpenDelete(false);
        } catch (error) {
            toast.error('Đã có lỗi xảy ra khi xóa cấu hình');
        }
    };

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-6 w-6 p-0">
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Mở menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    {/* <DropdownMenuItem onClick={() => setOpenDetail(true)}>
                        Xem chi tiết
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
                        Cập nhật
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-red-600">
                        Xóa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Detail Dialog */}
            {/* <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chi tiết cấu hình</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <InfoItem label="Tên cấu hình" value={config.settingName} icon={Tag} />
                        <InfoItem
                            label="Giá trị"
                            value={config.settingValue.toString()}
                            icon={FileText}
                        />
                        <InfoItem label="Mô tả" value={config.description} icon={FileText} />
                        <InfoItem
                            label="Ngày bắt đầu"
                            value={dayjs(config.effectedDateFrom).format('DD/MM/YYYY')}
                            icon={Calendar}
                        />
                        <InfoItem
                            label="Ngày kết thúc"
                            value={dayjs(config.effectedDateTo).format('DD/MM/YYYY')}
                            icon={Calendar}
                        />
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Trạng thái:</span>
                            <Badge variant={config.status === 1 ? 'default' : 'secondary'}>
                                {config.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                            </Badge>
                        </div>
                    </div>
                </DialogContent>
            </Dialog> */}

            {/* Update Dialog */}
            <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật cấu hình</DialogTitle>
                        <DialogDescription>Hãy nhập các thông tin dưới đây.</DialogDescription>
                    </DialogHeader>
                    <ConfigForm defaultValues={config} closeDialog={() => setOpenUpdate(false)} />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa cấu hình này?
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
