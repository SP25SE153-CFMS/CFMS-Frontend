'use client';

import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { InventoryReceipt } from '@/utils/schemas/inventory-receipt.schema';
import { ColumnDef } from '@tanstack/react-table';

import { DataTableRowActions } from './data-table-row-actions';
import { getRequestType } from '@/utils/functions/category.function';

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
        accessorKey: 'receiptTypeId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Loại phiếu" />,
        cell: ({ row }) => {
            const receiptTypeId = row.getValue('receiptTypeId') as string;
            const receiptType = getRequestType(receiptTypeId);
            return <span>{receiptType ?? '-'}</span>;
        },
    },
    {
        accessorKey: 'receiptCodeNumber',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã phiếu" />,
        cell: ({ row }) => <div>{String(row.getValue('receiptCodeNumber')).toUpperCase()}</div>,
    },
    {
        accessorKey: 'batchNumber',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lô" />,
        cell: ({ row }) => <div>{row.getValue('batchNumber')}</div>,
    },
    {
        id: 'action',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
