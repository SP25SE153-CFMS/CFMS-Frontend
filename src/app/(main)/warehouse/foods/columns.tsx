import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { capitalizeFirstLetter } from '@/utils/functions';
import { WarehouseProduct } from '@/utils/schemas/warehouse-product.schema';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<WarehouseProduct>[] = [
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
        accessorKey: 'productId',
        header: () => null,
        cell: () => null,
    },
    {
        accessorKey: 'productCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã hàng" />,
        cell: ({ row }) => (
            <div className="w-[40px]">{String(row.getValue('productCode')).toUpperCase()}</div>
        ),
    },
    {
        accessorKey: 'productName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên hàng" />,
        cell: ({ row }) => <div>{capitalizeFirstLetter(row.getValue('productName'))}</div>,
    },
    {
        accessorKey: 'quantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng hiện tại" />,
        cell: ({ row }) => <div>{row.getValue('quantity')}</div>,
    },
    {
        accessorKey: 'expiry',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Hạn sử dụng" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('expiry'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
    },
    {
        accessorKey: 'dateToImport',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày nhập" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('dateToImport'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
    },
    // {
    //     accessorKey: 'supplier',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Nhà cung cấp" />,
    //     cell: ({ row }) => <div>{capitalizeFirstLetter(row.getValue('supplier'))}</div>,
    // },
    {
        id: 'action',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
