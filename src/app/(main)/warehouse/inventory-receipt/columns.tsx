'use client';

import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { receiptStatusLabels, receiptStatusVariant, requestStatusLabels, requestStatusVariant } from '@/utils/enum/status.enum';
import { InventoryReceipt } from '@/utils/schemas/inventory-receipt.schema';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<InventoryReceipt>[] = [
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
        accessorKey: 'inventoryReceiptId',
        header: () => null,
        cell: () => null,
    },
    {
        accessorKey: 'inventoryCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã phiếu" />,
        cell: ({ row }) => <div>{String(row.getValue('inventoryCode')).toUpperCase()}</div>,
    },
    {
        accessorKey: 'subcategoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Danh mục" />,
        cell: ({ row }) => <div>{row.getValue('subcategoryName')}</div>,
    },
    {
        accessorKey: 'createBy',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tạo bởi" />,
        cell: () => <span>Ngọc Anh</span>,
    },
    {
        accessorKey: 'createDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo phiếu" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('createDate'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <Badge variant={receiptStatusVariant[status]}>{receiptStatusLabels[status]}</Badge>
            );
        },
    },
    {
        id: 'action',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
