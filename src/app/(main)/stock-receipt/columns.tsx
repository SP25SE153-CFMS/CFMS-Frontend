import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { StockReceiptResponse } from '@/utils/types/custom.type';
import dayjs from 'dayjs';
import { User } from '@/utils/schemas/user.schema';
import { SubCategory } from '@/utils/schemas/sub-category.schema';

export const columns: ColumnDef<StockReceiptResponse>[] = [
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
    //     accessorKey: 'status',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
    //     cell: ({ row }) => {
    //         const status = row.getValue('status') as string;
    //         return (
    //             <Badge
    //                 variant={stockReceiptStatusVariant[status]}
    //                 className="px-2 py-1 text-xs min-w-fit overflow-hidden text-ellipsis whitespace-nowrap"
    //             >
    //                 {stockReceiptStatusLabels[status]}
    //             </Badge>
    //         );
    //     },
    // },
    {
        accessorKey: 'stockReceiptCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã đơn hàng" />,
        cell: ({ row }) => <div>{row.getValue('stockReceiptCode')}</div>,
    },
    {
        accessorKey: 'createdWhen',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdWhen'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
    },
    {
        accessorKey: 'receiptType',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Loại đơn hàng" />,
        cell: ({ row }) => {
            const receiptType = row.getValue('receiptType') as SubCategory;
            return <span>{receiptType.description ?? '-'}</span>;
        },
    },
    {
        accessorKey: 'createdByUser',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Người tạo" />,
        cell: ({ row }) => {
            const user = row.getValue('createdByUser') as User;
            return <div>{user?.fullName || ''}</div>;
        },
    },
    // {
    //     id: 'action',
    //     cell: ({ row }) => <DataTableRowActions row={row} />,
    // },
];
