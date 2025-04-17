'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarRange, ChevronLeft, Columns3, Plus, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { getTasksByFarmId } from '@/services/task.service';
import Link from 'next/link';
import config from '@/configs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import {
    AssignmentStatus,
    assignmentBackground,
    assignmentBadge,
    assignmentStatusLabels,
} from '@/utils/enum/status.enum';
import { mapEnumToValues } from '@/utils/functions/enum.function';
import { getCookie } from 'cookies-next';
import TaskCard from './task-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/big-calendar';
import { getShifts } from '@/services/shift.service';
import { Shift } from '@/utils/schemas/shift.schema';
import { Event, ShiftEvent } from '@/components/big-calendar/type';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AssignmentForm from '@/components/forms/assignment-form';

export default function Page() {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'calendar' | 'kanban'>('kanban');

    const [open, setOpen] = useState(false);

    const farmId = getCookie(config.cookies.farmId) ?? '';

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: () => getTasksByFarmId(farmId),
    });

    const { data: shifts } = useQuery({
        queryKey: ['shifts'],
        queryFn: () => getShifts(),
    });

    const mapShiftToShiftEvent = (shift: Shift): ShiftEvent => ({
        id: shift.shiftId,
        name: shift.shiftName,
        timeRange: `${shift.startTime} - ${shift.endTime}`,
        startHour: parseInt(shift.startTime),
        endHour: parseInt(shift.endTime),
    });

    // TODO: Change to Task type
    const mapTaskToEvent = (task: any): Event => ({
        id: task.taskId,
        title: task.taskName,
        date: new Date(task.startWorkDate),
        color: assignmentBackground[task.status],
        status: parseInt(task.status),
        shift: shifts?.[0]?.shiftId ?? '',
    });

    const events = (tasks || []).map(mapTaskToEvent);
    const shiftEvents = (shifts || []).map(mapShiftToShiftEvent);

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center text-sm text-muted-foreground">
                <Link href={config.routes.farm}>
                    <Button variant="ghost" size="sm" className="gap-1 p-0">
                        <ChevronLeft className="h-4 w-4" />
                        Trang trại
                    </Button>
                </Link>
                <span className="mx-2">/</span>
                <span>Khu nuôi</span>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý công việc</h1>
                    <p className="text-muted-foreground mt-1">
                        Quản lý tất cả các công việc trong trang trại
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {/* <Button
                        variant="outline"
                        className="h-9"
                        onClick={() => downloadCSV(tasks, 'tasks.csv')}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Xuất CSV
                    </Button> */}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="h-9">
                                <Plus className="mr-2 h-4 w-4" />
                                Giao việc
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Giao công việc mới</DialogTitle>
                            </DialogHeader>

                            <AssignmentForm closeDialog={() => setOpen(false)} />
                        </DialogContent>
                    </Dialog>
                    <Link href={config.routes.createTask}>
                        <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo công việc
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm công việc..."
                                className="pl-8 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="border rounded-md p-1 flex">
                                <Button
                                    variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                                    size="sm"
                                    className="h-7 px-2"
                                    onClick={() => setViewMode('calendar')}
                                >
                                    <CalendarRange className="h-4 w-4" />
                                    <span>Dạng lịch</span>
                                </Button>
                                <Button
                                    variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                                    size="sm"
                                    className="h-7 px-2"
                                    onClick={() => setViewMode('kanban')}
                                >
                                    <Columns3 className="h-4 w-4" />
                                    <span>Dạng cột</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Kanban Board */}
                    {viewMode === 'kanban' && (
                        <div className="flex-1 overflow-auto py-4">
                            <ScrollArea className="h-screen">
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
                                                        <Plus className="h-4 w-4 mr-1" /> Thêm công
                                                        việc
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}

                    {/* Calendar View */}
                    {viewMode === 'calendar' && (
                        <div>
                            <div className="flex items-center gap-6 my-6">
                                {mapEnumToValues(AssignmentStatus).map((status) => (
                                    <div key={status} className="flex items-center gap-2">
                                        <div
                                            className={cn(
                                                'w-6 h-6 rounded-sm',
                                                assignmentBackground[status],
                                            )}
                                        ></div>
                                        <span>{assignmentStatusLabels[status]}</span>
                                    </div>
                                ))}
                            </div>
                            <Calendar events={events} shifts={shiftEvents} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
