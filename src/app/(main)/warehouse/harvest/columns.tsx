'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { WareStockResponse } from '@/utils/types/custom.type';

export const columns: ColumnDef<WareStockResponse>[] = [
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
        accessorKey: 'harvestProductCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã sản phẩm" />,
    },
    {
        accessorKey: 'harvestProductName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên sản phẩm" />,
    },
    {
        accessorKey: 'harvestProductTypeName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Loại sản phẩm" />,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mô tả" />,
    },
    {
        accessorKey: 'specQuantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng" />,
    },
    {
        accessorKey: 'supplierName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nhà cung cấp" />,
    },
    {
        accessorKey: 'unitSpecification',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Quy cách tính" />,
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
