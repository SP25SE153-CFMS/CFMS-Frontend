'use client';

import dayjs from 'dayjs';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Equipment } from '@/utils/schemas/equipment.schema';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Equipment>[] = [
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
        accessorKey: 'equipmentCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã thiết bị" />,
    },
    {
        accessorKey: 'equipmentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên thiết bị" />,
    },
    {
        accessorKey: 'purchaseDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày mua" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('purchaseDate'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
    },
    {
        accessorKey: 'warrantyPeriod',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Bảo hành (tháng)" />,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
    },
    {
        accessorKey: 'cost',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Chi phí" />,
        cell: ({ row }) => <div>{row.getValue('cost')?.toLocaleString()} VNĐ</div>,
    },
    {
        accessorKey: 'quantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng" />,
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
