'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { WareStockResponse } from '@/utils/types/custom.type';
import Link from 'next/link';
import config from '@/configs';

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
        accessorKey: 'unitSpecification',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Quy cách tính" />,
    },
    // {
    //     accessorKey: 'supplierName',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Nhà cung cấp" />,
    // },
    {
        accessorKey: 'currentSupplierId', // Ensure the data exists in the row
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    {
        accessorKey: 'currentSupplierName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nhà cung cấp" />,
        cell: ({ row }) => {
            const currentSupplierId = row.getValue('currentSupplierId') as string;
            return currentSupplierId ? (
                <Link href={`${config.routes.supplier}/${currentSupplierId}`}>
                    {row.getValue('currentSupplierName')}
                </Link>
            ) : (
                <div className="text-muted-foreground">Chưa có nhà cung cấp</div>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
