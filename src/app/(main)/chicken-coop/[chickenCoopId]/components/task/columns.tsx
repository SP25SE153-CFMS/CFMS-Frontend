'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import dayjs from 'dayjs';
import { TaskLog } from '@/utils/schemas/task-log.schema';
import { ChickenCoop } from '@/utils/schemas/chicken-coop.schema';
import { DataTableRowActions } from './data-table-row-actions';

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
            const chickenCoops: ChickenCoop[] = JSON.parse(
                sessionStorage.getItem('chickenCoops') || '[]',
            );
            const coop = chickenCoops.find(
                (coop) => coop.chickenCoopId === row.getValue('chickenCoopId'),
            );
            return <div>{coop?.chickenCoopName || '-'}</div>;
        },
    },
    // {
    //     accessorKey: 'type',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Loại công việc" />,
    //     cell: ({ row }) => <div>{row.getValue('type')}</div>,
    // },
    // {
    //     accessorKey: 'startDate',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bắt đầu" />,
    //     cell: ({ row }) => <div>{dayjs(row.getValue('startDate')).format('DD/MM/YYYY')}</div>,
    // },
    {
        accessorKey: 'completedAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày hoàn thành" />,
        cell: ({ row }) => {
            const completedAt = row.getValue('completedAt') as Date;
            return (
                <div>
                    {completedAt ? dayjs(completedAt).format('DD/MM/YYYY') : 'Chưa hoàn thành'}
                </div>
            );
        },
    },
    {
        accessorKey: 'note',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ghi chú" />,
        cell: ({ row }) => {
            const note = row.getValue('note') as string;
            return <div>{note ? note : 'Không có ghi chú'}</div>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
