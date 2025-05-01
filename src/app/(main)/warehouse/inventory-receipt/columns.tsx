'use client';

import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { InventoryReceipt } from '@/utils/schemas/inventory-receipt.schema';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { DataTableRowActions } from './data-table-row-actions';
import { User } from '@/utils/schemas/user.schema';
import { getReceiptType } from '@/utils/functions/category.function';

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
            const receiptType = getReceiptType(receiptTypeId);
            return <span>{receiptType ?? '-'}</span>;
        },
    },
    {
        accessorKey: 'receiptCodeNumber',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã phiếu" />,
        cell: ({ row }) => <div>{String(row.getValue('receiptCodeNumber')).toUpperCase()}</div>,
    },
    // {
    //     accessorKey: 'subcategoryName',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Danh mục" />,
    //     cell: ({ row }) => <div>{row.getValue('subcategoryName')}</div>,
    // },
    {
        accessorKey: 'createdByUserId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tạo bởi" />,
        cell: ({ row }) => {
            const users: User[] = JSON.parse(sessionStorage.getItem('users') || '[]');
            const createBy = users.find((user) => user.userId === row.getValue('createdByUserId'));
            return <span>{createBy?.fullName ?? '-'}</span>;
        },
    },
    {
        accessorKey: 'batchNumber',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lô" />,
        cell: ({ row }) => <div>{row.getValue('batchNumber')}</div>,
    },
    {
        accessorKey: 'createdWhen',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo phiếu" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdWhen'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
    },
    // {
    //     accessorKey: 'status',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
    //     cell: ({ row }) => {
    //         const status = row.getValue('status') as string;
    //         return (
    //             <Badge variant={receiptStatusVariant[status]}>{receiptStatusLabels[status]}</Badge>
    //         );
    //     },
    // },
    {
        id: 'action',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
