import InfoItem from '@/components/info-item';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { TaskResponse } from '@/utils/types/custom.type';
import { useEffect, useState } from 'react';
import { Calendar, Clock, FileText, Info, Type } from 'lucide-react';
import { getTaskType } from '@/utils/functions/category.function';
import dayjs from 'dayjs';
import { taskStatusLabels, taskStatusVariant } from '@/utils/enum/status.enum';
import Link from 'next/link';
import config from '@/configs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TaskDialogProps {
    open: boolean;
    // eslint-disable-next-line no-unused-vars
    onOpenChange: (open: boolean) => void;
    taskId: string;
}

export default function TaskDialog({ open, onOpenChange, taskId }: TaskDialogProps) {
    const [task, setTask] = useState<TaskResponse | null>(null);

    useEffect(() => {
        if (taskId) {
            const tasks: TaskResponse[] = JSON.parse(sessionStorage.getItem('tasks') || '[]');
            const taskData = tasks?.find((task) => task.taskId === taskId);
            setTask(taskData || null);
        }
    }, [taskId]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chi tiết công việc</DialogTitle>
                    <DialogDescription>
                        Dưới đây là các thông tin chi tiết của công việc.
                    </DialogDescription>
                </DialogHeader>
                {task ? (
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
                            value={
                                <Badge variant={taskStatusVariant[task?.status]}>
                                    {taskStatusLabels[task?.status]}
                                </Badge>
                            }
                            icon={<Clock size={16} />}
                        />

                        <InfoItem
                            label="Ngày bắt đầu"
                            value={
                                task?.startWorkDate
                                    ? dayjs(task.startWorkDate).format('DD/MM/YYYY HH:mm')
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
                ) : (
                    <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
                        Không tìm thấy công việc
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
