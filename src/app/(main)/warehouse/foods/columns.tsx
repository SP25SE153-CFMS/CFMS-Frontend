import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
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
        accessorKey: 'foodId',
        header: () => null,
        cell: () => null,
    },
    {
        accessorKey: 'foodCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã hàng" />,
        cell: ({ row }) => (
            <div className="w-[40px]">{String(row.getValue('foodCode')).toUpperCase()}</div>
        ),
    },
    {
        accessorKey: 'foodName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên hàng" />,
        cell: ({ row }) => <div>{row.getValue('foodName')}</div>,
    },
    {
        accessorKey: 'note',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ghi chú" />,
        cell: ({ row }) => <div>{row.getValue('note')}</div>,
    },
    {
        accessorKey: 'expiryDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Hạn sử dụng" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('expiryDate'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
    },
    {
        accessorKey: 'productionDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày sản xuất" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('productionDate'));
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
        id: 'action',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
