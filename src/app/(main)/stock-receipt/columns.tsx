import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { StockReceiptResponse } from '@/utils/types/custom.type';
import { getRequestType } from '@/utils/functions/category.function';
import dayjs from 'dayjs';

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
        accessorKey: 'createdWhen',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdWhen'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
    },
    {
        accessorKey: 'receiptTypeId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Loại phiếu" />,
        cell: ({ row }) => {
            const receiptTypeId = row.getValue('receiptTypeId') as string;
            const receiptType = getRequestType(receiptTypeId);
            return <span>{receiptType ?? '-'}</span>;
        },
    },
    {
        accessorKey: 'stockReceiptCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã đơn hàng" />,
        cell: ({ row }) => <div>{row.getValue('stockReceiptCode')}</div>,
    },
    {
        accessorKey: 'createdByUser',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Người tạo" />,
        cell: ({ row }) => <div>{row.getValue('createdByUser')}</div>,
    },
    // {
    //     id: 'action',
    //     cell: ({ row }) => <DataTableRowActions row={row} />,
    // },
];
