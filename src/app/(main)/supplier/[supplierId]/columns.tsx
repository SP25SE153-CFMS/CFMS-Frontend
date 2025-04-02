import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { Food } from '@/utils/schemas/food.schema';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

export const columns: ColumnDef<Food>[] = [
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
        accessorKey: 'foodCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã thức ăn" />,
        cell: ({ row }) => <div>{row.getValue('foodCode')}</div>,
    },
    {
        accessorKey: 'foodName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên" />,
        cell: ({ row }) => <div>{row.getValue('foodName')}</div>,
    },
    {
        accessorKey: 'unitSpecification',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Đơn vị" />,
        cell: ({ row }) => <div>{row.getValue('unitSpecification')}</div>,
    },
    {
        accessorKey: 'price',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Giá" />,
        cell: ({ row }) => <div>{row.getValue('price')}</div>,
    },
    {
        accessorKey: 'note',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ghi chú" />,
        cell: ({ row }) => <div>{row.getValue('note')}</div>,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Miêu tả" />,
        cell: ({ row }) => <div>{row.getValue('description')}</div>,
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
        accessorKey: 'expiryDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Hạn sử dụng" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('expiryDate'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
    },

    {
        id: 'action',
    },
];
