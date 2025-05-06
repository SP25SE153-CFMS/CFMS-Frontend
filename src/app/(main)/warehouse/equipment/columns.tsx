'use client';

import dayjs from 'dayjs';
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
        accessorKey: 'equipmentId',
        header: () => null,
        cell: () => null,
    },
    {
        accessorKey: 'equipmentCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã thiết bị" />,
        cell: ({ row }) => <div className="w-[40px]">{row.getValue('equipmentCode')}</div>,
    },
    {
        accessorKey: 'equipmentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên thiết bị" />,
        cell: ({ row }) => <div>{row.getValue('equipmentName')}</div>,
    },
    // {
    //     accessorKey: 'material',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Chất liệu" />,
    //     cell: ({ row }) => <div>{row.getValue('material')}</div>,
    // },
    // {
    //     accessorKey: 'usage',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Cách sử dụng" />,
    //     cell: ({ row }) => <div>{row.getValue('usage')}</div>,
    // },
    {
        accessorKey: 'warranty',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Bảo hành (tháng)" />,
        cell: ({ row }) => <div>{row.getValue('warranty')}</div>,
    },
    // {
    //     accessorKey: 'size',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Kích thước" />,
    //     cell: ({ row }) => <div>{row.getValue('size')}</div>,
    // },
    // {
    //     accessorKey: 'weight',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Khối lượng" />,
    //     cell: ({ row }) => <div>{row.getValue('weight')}</div>,
    // },
    {
        accessorKey: 'purchaseDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày mua" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('purchaseDate'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
    },
    {
        accessorKey: 'specQuantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng" />,
        cell: ({ row }) => <div>{row.getValue('specQuantity')}</div>,
    },
    {
        accessorKey: 'unitSpecification',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Quy cách tính" />,
        cell: ({ row }) => <div>{row.getValue('unitSpecification')}</div>,
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
