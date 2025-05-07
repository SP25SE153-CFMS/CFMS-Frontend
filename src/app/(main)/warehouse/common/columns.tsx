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
    // {
    //     accessorKey: 'chickenCode',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Mã gà" />,
    // },
    // {
    //     accessorKey: 'chickenName',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Tên gà" />,
    // },
    // {
    //     accessorKey: 'chickenTypeName',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Loại gà" />,
    // },
    // {
    //     accessorKey: 'totalQuantity',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Tổng số lượng" />,
    // },
    // {
    //     accessorKey: 'status',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
    //     cell: ({ row }) => {
    //         const status = row.getValue('status') as number;
    //         return (
    //             <Badge variant={commonStatusVariant[status]}>{commonStatusLabels[status]}</Badge>
    //         );
    //     },
    // },
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
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nhà cung cáp" />,
    },
    {
        accessorKey: 'unitSpecification',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Quy cách tính" />,
    },
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
            const currentSupplierName = row.getValue('currentSupplierName') as string;
            return currentSupplierId ? (
                <Link href={`${config.routes.supplier}/${currentSupplierId}`}>
                    {currentSupplierName}
                </Link>
            ) : (
                <div className="text-muted-foreground"> {currentSupplierName}</div>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
