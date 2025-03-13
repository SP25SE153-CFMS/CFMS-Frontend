'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';
import { Flock } from '@/utils/schemas/flock.schema';

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
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên đàn gà" />,
        cell: ({ row }) => <div className="w-[200px] font-medium">{row.getValue('name')}</div>,
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
            const statusLabels: Record<string, string> = {
                in_farm: 'Trong trang trại',
                sold: 'Đã bán',
                removed: 'Đã loại bỏ',
                dead: 'Đã chết',
            };
            return (
                <Badge variant={status === 'in_farm' ? 'default' : 'outline'}>
                    {statusLabels[status]}
                </Badge>
            );
        },
    },
];
