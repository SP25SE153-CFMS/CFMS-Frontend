'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/utils/schemas/task.schema';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { taskStatusLabels, taskStatusVariant } from '@/utils/enum/status.enum';
import { DataTableRowActions } from './data-table-row-ations';
import { getTaskType } from '@/utils/functions/category.function';

export const columns: ColumnDef<Task>[] = [
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
        accessorKey: 'taskId',
        header: () => null,
        cell: () => null,
    },
    {
        accessorKey: 'taskName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên công việc" />,
    },
    {
        accessorKey: 'taskTypeId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Loại công việc" />,
        cell: ({ row }) => {
            const taskTypeId = row.getValue('taskTypeId') as string;
            return <span>{getTaskType(taskTypeId)}</span>;
        },
    },
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mô tả" />,
    },
    {
        accessorKey: 'isHavest',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Thu hoạch" />,
        cell: ({ row }) => {
            const isHavest = row.getValue('isHavest') as boolean;
            return <span>{isHavest ? 'Có' : 'Không'}</span>;
        },
    },
    // {
    //     accessorKey: 'startWorkDate',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bắt đầu" />,
    //     cell: ({ row }) => {
    //         const date = new Date(row.getValue('startWorkDate'));
    //         return <div>{date ? dayjs(date).format('DD/MM/YYYY') : '-'}</div>;
    //     },
    // },
    // {
    //     accessorKey: 'endWorkDate',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày kết thúc" />,
    //     cell: ({ row }) => {
    //         const date = new Date(row.getValue('endWorkDate'));
    //         return <div>{date ? dayjs(date).format('DD/MM/YYYY') : '-'}</div>;
    //     },
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
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
