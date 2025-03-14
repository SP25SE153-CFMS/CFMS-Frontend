'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';
import { Flock } from '@/utils/schemas/flock.schema';
import Link from 'next/link';
import config from '@/configs';
import { flockStatusLabels, flockStatusVariant } from '@/utils/enum/status.enum';

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
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên đàn gà" />,
        cell: ({ row, table }) => (
            <Link
                href={`${config.routes.flock}/${row.getValue('flockId')}`}
                onClick={() => {
                    const flocks = table.getCoreRowModel().rows.map((row) => row.original);
                    sessionStorage.setItem('flocks', JSON.stringify(flocks));
                }}
            >
                {row.getValue('name')}
            </Link>
        ),
    },
    {
        accessorKey: 'quantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng" />,
        cell: ({ row }) => <div className="w-[80px] text-center">{row.getValue('quantity')}</div>,
    },
    {
        accessorKey: 'startDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bắt đầu" />,
        cell: ({ row }) => (
            <div className="w-[150px]">{dayjs(row.getValue('startDate')).format('DD/MM/YYYY')}</div>
        ),
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return <Badge variant={flockStatusVariant[status]}>{flockStatusLabels[status]}</Badge>;
        },
    },
];
