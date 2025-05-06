import { useState } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { TaskLogResponse } from '@/utils/types/custom.type';
import InfoItem from '@/components/info-item';
import { Calendar, Clock, FileText, Info, Type } from 'lucide-react';
import { taskStatusLabels } from '@/utils/enum/status.enum';
import dayjs from 'dayjs';
import Link from 'next/link';
import config from '@/configs';
import { getTaskType } from '@/utils/functions/category.function';

interface Props<T> {
    row: Row<T>;
}

export function DataTableRowActions<T>({ row }: Props<T>) {
    const [open, setOpen] = useState(false);

    const task = (row.original as TaskLogResponse).task;

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
                    <DropdownMenuItem onClick={() => setOpen(true)}>Xem công việc</DropdownMenuItem>
                    {/*<DropdownMenuSeparator />
                     <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-red-600">
                        Xóa <Trash size={16} className="ml-auto" />
                    </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chi tiết công việc</DialogTitle>
                        <DialogDescription>
                            Dưới đây là các thông tin chi tiết của công việc.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col">
                        <InfoItem
                            label="Tên công việc"
                            value={task?.taskName || 'Không có tên công việc'}
                            icon={<FileText size={16} />}
                        />

                        <InfoItem
                            label="Loại công việc"
                            value={getTaskType(task?.taskTypeId) || 'Không có'}
                            icon={<Type size={16} />}
                        />

                        <InfoItem
                            label="Mô tả"
                            value={task?.description || 'Không có mô tả'}
                            icon={<Info size={16} />}
                        />

                        <InfoItem
                            label="Trạng thái"
                            value={taskStatusLabels[task?.status] || 'Không có'}
                            icon={<Clock size={16} />}
                        />

                        <InfoItem
                            label="Ngày bắt đầu"
                            value={
                                task?.startWorkDate
                                    ? dayjs(task.startWorkDate).format('DD/MM/YYYY')
                                    : 'Không có ngày bắt đầu'
                            }
                            icon={<Calendar size={16} />}
                        />

                        <InfoItem
                            label="Ngày kết thúc"
                            value={
                                task?.endWorkDate
                                    ? dayjs(task.endWorkDate).format('DD/MM/YYYY HH:mm')
                                    : 'Không có ngày kết thúc'
                            }
                            icon={<Calendar size={16} />}
                        />

                        <Link href={`${config.routes.task}/${task?.taskId}`} className="mt-4">
                            <Button className="w-full">Xem chi tiết</Button>
                        </Link>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
