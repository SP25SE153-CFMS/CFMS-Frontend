import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { assignmentBorder } from '@/utils/enum/status.enum';
import { TaskResponse } from '@/utils/types/custom.type';
import dayjs from 'dayjs';

export default function TaskCard({ task }: { task: TaskResponse }) {
    // const priorityColors = {
    //     high: 'text-red-500 bg-red-50 border-red-200',
    //     medium: 'text-yellow-500 bg-yellow-50 border-yellow-200',
    //     low: 'text-green-500 bg-green-50 border-green-200',
    // } as const;

    // const priorityClass = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.low;

    return (
        <Card
            className={cn(
                'p-3 bg-white hover:shadow-md transition-shadow cursor-pointer border-l-4 mb-1',
                assignmentBorder[task.status],
            )}
        >
            <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                    <span className="text-sm font-medium line-clamp-2 border-b border-transparent text-black">
                        {task.taskName}
                    </span>
                    {/* {task.priority && (
                        <Badge variant="outline" className={`text-xs ${priorityClass}`}>
                            {task.priority}
                        </Badge>
                    )} */}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                    {task.description || 'Không có mô tả'}
                </p>

                <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                        {task.startWorkDate
                            ? dayjs(task.startWorkDate).format('DD/MM/YYYY')
                            : 'Không có ngày bắt đầu'}
                    </div>

                    {/*{task.assignee && (
                        <Avatar className="h-6 w-6">
                            <div className="flex h-full w-full items-center justify-center bg-muted text-xs">
                                {task.assignee.substring(0, 2).toUpperCase()}
                            </div>
                        </Avatar>
                    )} */}
                </div>
            </div>
        </Card>
    );
}
