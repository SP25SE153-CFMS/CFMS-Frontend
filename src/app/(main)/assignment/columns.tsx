'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Assignment } from '@/utils/schemas/assignment.schema';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { taskStatusLabels, taskStatusVariant } from '@/utils/enum/status.enum';
import { Task } from '@/utils/schemas/task.schema';
import dayjs from 'dayjs';
import { FarmEmployeeResponse } from '@/utils/types/custom.type';

export const columns: ColumnDef<Assignment>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'assignmentId',
        header: () => null,
        cell: () => null,
    },
    {
        accessorKey: 'taskId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Công việc" />,
        cell: ({ row }) => {
            const tasks: Task[] = JSON.parse(sessionStorage.getItem('tasks') || '[]');
            const task = tasks?.find((task) => task.taskId === row.getValue('taskId'));
            return <div>{task?.taskName}</div>;
        },
    },
    {
        accessorKey: 'assignedToId',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Người được phân công" />
        ),
        cell: ({ row }) => {
            const employees: FarmEmployeeResponse[] = JSON.parse(
                sessionStorage.getItem('employees') || '[]',
            );
            const employee = employees?.find(
                (employee) => employee.userId === row.getValue('assignedToId'),
            );
            return <div>{employee?.user.fullName}</div>;
        },
    },
    {
        accessorKey: 'assignedDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày phân công" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('assignedDate'));
            return <div>{date ? dayjs(date).format('DD/MM/YYYY') : 'Chưa phân công'}</div>;
        },
    },
    // {
    //     accessorKey: 'shiftScheduleId',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="ID Lịch ca" />,
    // },
    // {
    //     accessorKey: 'taskScheduleId',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="ID Lịch công việc" />,
    // },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return <Badge variant={taskStatusVariant[status]}>{taskStatusLabels[status]}</Badge>;
        },
    },
    {
        accessorKey: 'note',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ghi chú" />,
    },
    // {
    //     id: 'actions',
    //     cell: ({ row }) => <DataTableRowActions row={row} />,
    // },
];
