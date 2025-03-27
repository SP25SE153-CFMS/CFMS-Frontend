'use client';

import dayjs from 'dayjs';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Chicken } from '@/utils/schemas/chicken.schema';
import { DataTableRowActions } from './data-table-row-actions';
import { Badge } from '@/components/ui/badge';
import { commonStatusLabels, commonStatusVariant } from '@/utils/enum/status.enum';

export const columns: ColumnDef<Chicken>[] = [
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
        accessorKey: 'chickenCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã gà" />,
    },
    {
        accessorKey: 'chickenName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên gà" />,
    },
    {
        accessorKey: 'totalQuantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tổng số lượng" />,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as number;
            return (
                <Badge variant={commonStatusVariant[status]}>{commonStatusLabels[status]}</Badge>
            );
        },
    },
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mô tả" />,
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
