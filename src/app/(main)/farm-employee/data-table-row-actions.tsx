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
import config from '@/configs';
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
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { deleteFarmEmployee } from '@/services/farm-employee.service';
import { getCookie } from 'cookies-next';
import InfoItem from '@/components/info-item';
import { Activity, Calendar, IdCard, Mail, MapPin, Phone, Tag } from 'lucide-react';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';
import { employeeStatusLabels, employeeStatusVariant } from '@/utils/enum/status.enum';
import FarmEmployeeForm from './form';
import { FarmEmployeeResponse } from '@/utils/types/custom.type';

interface Props<T> {
    row: Row<T>;
}

export function DataTableRowActions<T>({ row }: Props<T>) {
    const [openDetail, setOpenDetail] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const farmId = getCookie(config.cookies.farmId);

    const queryClient = useQueryClient();

    const farmEmployee = row.original as FarmEmployeeResponse;
    const employee = farmEmployee.user;

    const handleDelete = async () => {
        await deleteFarmEmployee(farmEmployee.farmEmployeeId).then(() => {
            toast.success('Xóa nhân viên trang trại thành công');
            queryClient.invalidateQueries({ queryKey: ['farmEmployees', farmId] });
            setOpenDelete(false);
        });
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
                    <DropdownMenuItem onClick={() => setOpenDetail(true)}>
                        Xem chi tiết
                    </DropdownMenuItem>
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
            <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thông tin nhân viên</DialogTitle>
                        <DialogDescription>
                            Các thông tin chi tiết của nhân viên này.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                            {/* <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                    Thông tin chi tiết
                                </h3>
                            </div> */}

                            <InfoItem
                                label="Họ và tên"
                                value={employee.fullName}
                                icon={<Tag size={16} />}
                            />

                            <InfoItem
                                label="Số điện thoại"
                                value={employee.phoneNumber || 'Không có'}
                                icon={<Phone size={16} />}
                            />

                            <InfoItem
                                label="Email"
                                value={employee.mail}
                                icon={<Mail size={16} />}
                            />

                            <InfoItem
                                label="Ngày sinh"
                                value={
                                    employee.dateOfBirth
                                        ? dayjs(employee.dateOfBirth).format('DD/MM/YYYY')
                                        : 'Không có'
                                }
                                icon={<Calendar size={16} />}
                            />

                            <InfoItem
                                label="Địa chỉ"
                                value={employee.address || 'Không có'}
                                icon={<MapPin size={16} />}
                            />

                            <InfoItem
                                label="CCCD"
                                value={employee.cccd || 'Không có'}
                                icon={<IdCard size={16} />}
                            />

                            <InfoItem
                                label="Trạng thái"
                                value={
                                    <Badge variant={employeeStatusVariant[employee.status]}>
                                        {employeeStatusLabels[employee.status]}
                                    </Badge>
                                }
                                icon={<Activity size={16} />}
                            />

                            {/* <InfoItem
                                label="Vai trò hệ thống"
                                value={`Vai trò ${employee.systemRole}`}
                                icon={<User size={16} />}
                            /> */}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Update Dialog */}
            <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật nhân viên trang trại</DialogTitle>
                        <DialogDescription>Hãy nhập các thông tin dưới đây.</DialogDescription>
                    </DialogHeader>
                    <FarmEmployeeForm
                        closeDialog={() => setOpenUpdate(false)}
                        defaultValues={farmEmployee}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa nhân viên trang trại này?
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
