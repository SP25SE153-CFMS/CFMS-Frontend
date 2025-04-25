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
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import InfoItem from '@/components/info-item';
import { Activity, Calendar, IdCard, Loader2, Mail, MapPin, Phone, Tag } from 'lucide-react';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';
import { UserStatus, userStatusLabels, userStatusVariant } from '@/utils/enum/status.enum';
import FarmEmployeeForm from '@/components/forms/farm-employee-form';
import { FarmEmployeeResponse } from '@/utils/types/custom.type';
import { deleteEmployeeInFarm, updateEmployeeInFarm } from '@/services/farm.service';

interface Props<T> {
    row: Row<T>;
}

export function DataTableRowActions<T>({ row }: Props<T>) {
    const [openDetail, setOpenDetail] = useState(false);
    const [openUpdateInfo, setOpenUpdateInfo] = useState(false);
    const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
    const [status, setStatus] = useState<UserStatus>(UserStatus.FIRED);
    const [openDelete, setOpenDelete] = useState(false);

    const queryClient = useQueryClient();

    const farmEmployee = row.original as FarmEmployeeResponse;
    const employee = farmEmployee.user;

    const deleteMutation = useMutation({
        mutationFn: deleteEmployeeInFarm,
        onSuccess: () => {
            toast.success('Xóa nhân viên trang trại thành công');
            queryClient.invalidateQueries({ queryKey: ['farmEmployees'] });
            setOpenDelete(false);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: updateEmployeeInFarm,
        onSuccess: () => {
            toast.success(`${userStatusLabels[status]} nhân viên thành công`);
            queryClient.invalidateQueries({ queryKey: ['farmEmployees'] });
            setOpenUpdateStatus(false);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    const handleDelete = async () => {
        const farmEmployeeId = farmEmployee.farmEmployeeId;
        await deleteMutation.mutateAsync(farmEmployeeId);
    };

    const handleUpdateStatus = async () => {
        const newValues = {
            ...farmEmployee,
            status,
            user: undefined,
            phoneNumber: null,
            mail: null,
            farmRole: null,
            startDate: null,
            endDate: null,
        };
        await updateStatusMutation.mutateAsync(newValues);
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
                    <DropdownMenuItem onClick={() => setOpenUpdateInfo(true)}>
                        Cập nhật thông tin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setOpenUpdateStatus(true);
                            setStatus(UserStatus.INACTIVE);
                        }}
                    >
                        {userStatusLabels[UserStatus.INACTIVE]}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setOpenUpdateStatus(true);
                            setStatus(UserStatus.FIRED);
                        }}
                    >
                        {userStatusLabels[UserStatus.FIRED]}
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
                                    <Badge variant={userStatusVariant[employee.status]}>
                                        {userStatusLabels[employee.status]}
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
            <Dialog open={openUpdateInfo} onOpenChange={setOpenUpdateInfo}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật nhân viên trang trại</DialogTitle>
                        <DialogDescription>Hãy nhập các thông tin dưới đây.</DialogDescription>
                    </DialogHeader>
                    <FarmEmployeeForm
                        closeDialog={() => setOpenUpdateInfo(false)}
                        defaultValues={farmEmployee}
                    />
                </DialogContent>
            </Dialog>

            {/* Update Status Dialog */}
            <AlertDialog open={openUpdateStatus} onOpenChange={setOpenUpdateStatus}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Xác nhận {userStatusLabels[status]?.toLowerCase()}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn {userStatusLabels[status]?.toLowerCase()} nhân
                            viên trang trại này?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpenUpdateStatus(false)}>
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleUpdateStatus}
                            disabled={updateStatusMutation.isPending}
                        >
                            {deleteMutation.isPending && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            {userStatusLabels[status]}
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

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
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            Xóa
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
