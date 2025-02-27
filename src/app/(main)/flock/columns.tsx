'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Flock } from '@/utils/schemas/flock.schema';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import Link from 'next/link';

export const columns: ColumnDef<Flock>[] = [
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
        accessorKey: 'flockId',
        header: () => null,
        cell: () => null,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên đàn" />,
        cell: ({ row }) => (
            <Link href={`/flock/details/${row.getValue('flockId')}`}>{row.getValue('name')}</Link>
        ),
    },
    {
        accessorKey: 'quantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng" />,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
    },
    {
        accessorKey: 'avgWeight',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Trọng lượng TB (kg)" />
        ),
    },
    {
        accessorKey: 'mortalityRate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tỷ lệ tử vong (%)" />,
    },
    {
        accessorKey: 'startDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bắt đầu" />,
    },
    {
        accessorKey: 'endDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày kết thúc" />,
    },
    {
        accessorKey: 'housingId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Chuồng trại" />,
    },
];
