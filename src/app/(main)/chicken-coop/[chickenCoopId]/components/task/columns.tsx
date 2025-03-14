'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import dayjs from 'dayjs';
import { chickenCoops } from '@/utils/data/table.data';
import { TaskLog } from '@/utils/schemas/task-log.schema';

export const columns: ColumnDef<TaskLog>[] = [
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
        accessorKey: 'chickenCoopId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Chuồng gà" />,
        cell: ({ row }) => {
            const coop = chickenCoops.find(
                (coop) => coop.chickenCoopId === row.getValue('chickenCoopId'),
            );
            return <div>{coop?.chickenCoopName || '-'}</div>;
        },
    },
    {
        accessorKey: 'type',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Loại công việc" />,
        cell: ({ row }) => <div>{row.getValue('type')}</div>,
    },
    {
        accessorKey: 'startDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bắt đầu" />,
        cell: ({ row }) => <div>{dayjs(row.getValue('startDate')).format('DD/MM/YYYY')}</div>,
    },
    {
        accessorKey: 'endDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày kết thúc" />,
        cell: ({ row }) => {
            const endDate = row.getValue('endDate') as Date;
            return <div>{endDate ? dayjs(endDate).format('DD/MM/YYYY') : '-'}</div>;
        },
    },
];
