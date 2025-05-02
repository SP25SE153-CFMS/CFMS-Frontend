'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { FeedSession } from '@/utils/schemas/feed-session.schema';

export const columns: ColumnDef<FeedSession>[] = [
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
    //     accessorKey: 'feedSessionId',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Mã Phiên" />,
    //     cell: ({ row }) => <div>{row.getValue('feedSessionId')}</div>,
    // },
    {
        accessorKey: 'startTime',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Thời Gian Bắt Đầu" />,
        // cell: ({ row }) => (
        //     <div>{dayjs(row.getValue('startTime')).format('DD/MM/YYYY HH:mm')}</div>
        // ),
    },
    {
        accessorKey: 'endTime',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Thời Gian Kết thúc" />
        ),
    },
    {
        accessorKey: 'feedAmount',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Lượng Thức Ăn" />,
        cell: ({ row }) => <div>{row.getValue('feedAmount')} kg</div>,
    },
    {
        accessorKey: 'note',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ghi Chú" />,
        cell: ({ row }) => <div>{row.getValue('note') || 'Không có ghi chú'}</div>,
    },
];
