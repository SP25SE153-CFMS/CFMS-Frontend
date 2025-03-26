'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { FeedLog } from '@/utils/schemas/feed-log.schema';
import { DataTableRowActions } from './data-table-row-actions';
import dayjs from 'dayjs';

export const columns: ColumnDef<FeedLog>[] = [
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
        accessorKey: 'feedingDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày Cho Ăn" />,
        cell: ({ row }) => (
            <div>{dayjs(row.getValue('feedingDate')).format('DD/MM/YYYY HH:mm')}</div>
        ),
    },
    {
        accessorKey: 'actualFeedAmount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Lượng Thức Ăn Thực Tế" />
        ),
        cell: ({ row }) => <div>{row.getValue('actualFeedAmount')}</div>,
    },
    {
        accessorKey: 'unitId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Đơn Vị" />,
        cell: ({ row }) => <div>{row.getValue('unitId')}</div>,
    },
    {
        accessorKey: 'note',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ghi Chú" />,
        cell: ({ row }) => <div>{row.getValue('note') || 'Không có ghi chú'}</div>,
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
