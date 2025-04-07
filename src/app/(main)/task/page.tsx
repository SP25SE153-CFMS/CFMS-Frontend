'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Plus, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { getTasks } from '@/services/task.service';
import Link from 'next/link';
import config from '@/configs';
import { downloadCSV } from '@/utils/functions/download-csv.function';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TaskResponse } from '@/utils/types/custom.type';
import dayjs from 'dayjs';
import {
    AssignmentStatus,
    assignmentBadge,
    assignmentBorder,
    assignmentStatusLabels,
} from '@/utils/enum/status.enum';
import { mapEnumToValues } from '@/utils/functions/enum.function';
import { cn } from '@/lib/utils';

export default function Page() {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: () => getTasks(),
    });

    // Check if tasks are loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
            </div>
        );
    }

    // Check if tasks data exists
    if (!tasks) {
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

    const filteredTasks = tasks.filter(
        (task) =>
            task.taskName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Define the columns for the Kanban board
    const columns = mapEnumToValues(AssignmentStatus).map((status) => ({
        id: Number(status),
        title: assignmentStatusLabels[status],
        color: assignmentBadge[status],
    }));

    // Group tasks by status
    const getTasksByStatus = (status: number) => {
        if (status === 0) {
            return filteredTasks.filter((task) => task.status === 0 || !task.status);
        }
        return filteredTasks.filter((task) => task.status === Number(status));
    };

    // Return the page
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Quản lý công việc</h1>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm công việc..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadCSV(tasks, 'tasks.csv')}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Tải file
                        </Button>

                        <Link href={config.routes.createTask}>
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Tạo công việc
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-auto p-4">
                <div className="h-full gap-4 pb-4 overflow-x-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {columns.map((column) => (
                        <div
                            key={column.id}
                            className={`flex-shrink-0 flex flex-col rounded-md ${column.color}`}
                        >
                            <div className="p-3 font-medium flex items-center justify-between border-b">
                                <h3 className="text-black">{column.title}</h3>
                                <Badge variant="outline">
                                    {getTasksByStatus(column.id).length}
                                </Badge>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px]">
                                {getTasksByStatus(column.id).map((task) => (
                                    <Link
                                        href={`${config.routes.task}/${task.taskId}`}
                                        key={task.taskId}
                                    >
                                        <TaskCard task={task} />
                                    </Link>
                                ))}
                                {getTasksByStatus(column.id).length === 0 && (
                                    <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
                                        Không có công việc
                                    </div>
                                )}
                            </div>
                            <div className="p-2 border-t">
                                <Link href={config.routes.createTask}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start text-muted-foreground hover:bg-transparent"
                                    >
                                        <Plus className="h-4 w-4 mr-1" /> Thêm công việc
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function TaskCard({ task }: { task: TaskResponse }) {
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
                    <span className="text-sm font-medium line-clamp-2 border-b border-transparent hover:border-black">
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
