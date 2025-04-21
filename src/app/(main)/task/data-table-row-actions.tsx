'use client';

import { Row } from '@tanstack/react-table';
import { Task } from '@/utils/schemas/task.schema';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteTask } from '@/services/task.service';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import config from '@/configs';

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
    const router = useRouter();
    // const [openDetail, setOpenDetail] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [loading, setLoading] = useState(false);

    const task = row.original as Task;

    const onDelete = async () => {
        try {
            setLoading(true);
            await deleteTask(task.taskId);
            toast.success('Xóa thành công');
            router.refresh();
        } catch (error: any) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
            setOpenDelete(false);
        }
    };

    // const createTask: CreateTask = {
    //     taskName: task.taskName,
    //     taskTypeId: task.taskTypeId,
    //     description: task.description,
    //     isHavest: task.isHavest,
    //     frequency: task.frequency,
    //     timeUnitId: task.timeUnitId,
    //     startWorkDate: task.startWorkDate,
    //     endWorkDate: task.endWorkDate,
    //     shiftIds: task.shiftIds,
    //     locationType: task.locationType,
    //     locationId: task.locationId,
    //     taskResources: task.taskResources,
    //     status: task.status,
    // };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Mở menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                    // onClick={() => router.push(`${config.routes.task}/${task.taskId}`)}
                    // onClick={() => router.push(`${config.routes.createTask}`)}
                    // onClick={() => setOpenDetail(true)}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => router.push(`${config.routes.task}/${task.taskId}`)}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenDelete(true)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Detail Dialog */}
            {/* <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent className="max-w-5xl">
                    <DialogHeader>
                        <DialogTitle>Chi tiết công việc</DialogTitle>
                        <DialogDescription>Đây là những thông tin của công việc</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[500px]">
                        <TaskForm />
                    </ScrollArea>
                </DialogContent>
            </Dialog> */}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa công việc này?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpenDelete(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={onDelete} disabled={loading}>
                            Xóa
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
