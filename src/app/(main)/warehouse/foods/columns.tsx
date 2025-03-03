import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { WarehouseProduct } from '@/utils/schemas/warehouse-product.schema';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

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
        cell: ({ row }) => <div className="w-[40px]">{row.getValue('productCode')}</div>,
    },
    {
        accessorKey: 'productName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên hàng" />,
        cell: ({ row }) => <div>{row.getValue('productName')}</div>,
    },
    {
        accessorKey: 'currentQuantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng hiện tại" />,
        cell: ({ row }) => <div>{row.getValue('currentQuantity')}</div>,
    },
    {
        accessorKey: 'unit',
        header: () => <div className='text-xs whitespace-nowrap'>Đơn vị</div>,
        cell: ({ row }) => <div>{row.getValue('unit')}</div>,
    },
    {
        accessorKey: 'area',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Khu vực" />,
        cell: ({ row }) => <div>{row.getValue('area')}</div>,
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
    {
        accessorKey: 'supplier',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nhà cung cấp" />,
        cell: ({ row }) => <div>{row.getValue('supplier')}</div>,
    },
];
