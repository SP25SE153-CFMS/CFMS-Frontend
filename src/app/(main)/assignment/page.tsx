'use client';

import { Calendar } from '@/components/big-calendar';
import { DataTable } from '@/components/table/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
    AssignmentStatus,
    assignmentBackground,
    assignmentStatusLabels,
} from '@/utils/enum/status.enum';
import { mapEnumToValues } from '@/utils/functions/enum.function';
import { columns } from './columns';
import { useQuery } from '@tanstack/react-query';
import { getAssignments } from '@/services/assignment.service';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Event, ShiftEvent } from '@/components/big-calendar/type';
import { getTasks } from '@/services/task.service';
import { getEmployeesByFarmId } from '@/services/farm.service';
import { getCookie } from 'cookies-next';
import { getShifts } from '@/services/shift.service';
import { Shift } from '@/utils/schemas/shift.schema';

export default function Home() {
    const { data: assignments, isLoading: isAssignmentsLoading } = useQuery({
        queryKey: ['assignments'],
        queryFn: () => getAssignments(),
    });

    const { data: tasks, isLoading: isTasksLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const tasks = await getTasks();
            sessionStorage.setItem('tasks', JSON.stringify(tasks));
            return tasks;
        },
    });

    const { isLoading: isEmployeesLoading } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const farmId = getCookie('farmId') ?? '';
            const employees = await getEmployeesByFarmId(farmId);
            sessionStorage.setItem('employees', JSON.stringify(employees));
            return employees;
        },
    });

    const { data: shifts } = useQuery({
        queryKey: ['shifts'],
        queryFn: () => getShifts(),
    });

    // const mapAssignmentToEvent = (assignment: Assignment): Event => ({
    //     id: assignment.assignmentId,
    //     title: tasks?.find((task) => task.taskId === assignment.taskId)?.taskName || '',
    //     date: new Date(assignment.assignedDate),
    //     color: assignmentBackground[assignment.status],
    //     status: parseInt(assignment.status),
    //     // TODO: Get shift from shiftScheduleId
    //     shift: 1,
    // });

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

    // Check if assignments is loading
    if (isAssignmentsLoading || isTasksLoading || isEmployeesLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[75vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    // const assignments: Assignment[] = events.map((event) => ({
    //     assignmentId: event.id.toString(),
    //     taskId: '1',
    //     assignedToId: '1',
    //     assignedDate: event.date.toISOString(),
    //     shiftScheduleId: '1',
    //     taskScheduleId: '1',
    //     status: event.status.toString(),
    //     note: 'note',
    // }));

    return (
        <main className="container mx-auto py-10 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Lịch trình công việc</h1>
                    <p className="text-muted-foreground">
                        Quản lý lịch trình công việc và thêm công việc mới vào lịch.
                    </p>
                </div>
                <Tabs defaultValue="all" className="mb-6">
                    <TabsList className="grid w-[600px] grid-cols-3 mb-4">
                        <TabsTrigger value="all">Lịch trình</TabsTrigger>
                        <TabsTrigger value="cancel">Công việc hủy</TabsTrigger>
                        <TabsTrigger value="completed">Công việc hoàn thành</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all">
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
                    </TabsContent>
                    <TabsContent value="cancel">
                        {/* TODO: Filter assignments by status */}
                        <DataTable data={assignments || []} columns={columns} />
                    </TabsContent>
                    <TabsContent value="completed">
                        {/* TODO: Filter assignments by status */}
                        <DataTable data={assignments || []} columns={columns} />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}
