'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import dayjs from 'dayjs';
import { HealthLog } from '@/utils/schemas/health-log.schema';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<HealthLog>[] = [
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
        accessorKey: 'startDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bắt đầu" />,
        cell: ({ row }) => <div>{dayjs(row.getValue('startDate')).format('DD/MM/YYYY')}</div>,
    },
    {
        accessorKey: 'endDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày kết thúc" />,
        cell: ({ row }) => {
            const endDate = row.getValue('endDate') as string | null;
            return <div>{endDate ? dayjs(endDate).format('DD/MM/YYYY') : 'Chưa kết thúc'}</div>;
        },
    },
    {
        accessorKey: 'notes',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ghi chú" />,
        cell: ({ row }) => <div>{row.getValue('notes') || 'Không có ghi chú'}</div>,
    },
    {
        accessorKey: 'checkedAt',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Thời gian kiểm tra" />
        ),
        cell: ({ row }) => <div>{dayjs(row.getValue('checkedAt')).format('DD/MM/YYYY HH:mm')}</div>,
    },
    // {
    //     accessorKey: 'location',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Vị Trí" />,
    //     cell: ({ row }) => <div>{row.getValue('location') || 'Không có vị trí'}</div>,
    // },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
