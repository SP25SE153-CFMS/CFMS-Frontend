'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { FeedLog } from '@/utils/schemas/feed-log.schema';
import { DataTableRowActions } from './data-table-row-actions';
import dayjs from 'dayjs';
import { getWeightUnit } from '@/utils/functions/category.function';

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
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày cho ăn" />,
        cell: ({ row }) => (
            <div>{dayjs(row.getValue('feedingDate')).format('DD/MM/YYYY HH:mm')}</div>
        ),
    },
    {
        accessorKey: 'actualFeedAmount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Lượng thức ăn thực tế" />
        ),
        cell: ({ row }) => {
            const actualFeedAmount = row.getValue('actualFeedAmount') as number;
            const unitId = row.getValue('unitId') as string;

            return (
                <div>
                    {actualFeedAmount} {getWeightUnit(unitId)}
                </div>
            );
        },
    },
    {
        accessorKey: 'unitId', // Ensure the data exists in the row
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    {
        accessorKey: 'note',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ghi chú" />,
        cell: ({ row }) => <div>{row.getValue('note') || 'Không có ghi chú'}</div>,
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
