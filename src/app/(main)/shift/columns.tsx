'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Shift } from '@/utils/schemas/shift.schema';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Shift>[] = [
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
        accessorKey: 'shiftName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên ca làm việc" />,
    },
    {
        accessorKey: 'startTime',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Thời gian bắt đầu" />,
    },
    {
        accessorKey: 'endTime',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Thời gian kết thúc" />
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
