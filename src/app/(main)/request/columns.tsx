'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Request } from '@/utils/schemas/request.schema';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import { requestStatusLabels, requestStatusVariant } from '@/utils/enum/status.enum';

export const columns: ColumnDef<Request>[] = [
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
        accessorKey: 'requestId',
        header: () => null,
        cell: () => null,
    },
    {
        accessorKey: 'requestType',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Loại yêu cầu" />,
        cell: ({ row }) => {
            const requestType = row.getValue('requestType') as string;
            return <span>{requestType.toUpperCase()}</span>;
        },
    },
    {
        accessorKey: 'content',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nội dung" />,
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdAt'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
    },
    {
        accessorKey: 'createdBy',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Người tạo" />,
        cell: () => <span>Hải Đăng</span>,
    },
    {
        accessorKey: 'approvedBy',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Người duyệt" />,
        cell: () => <span>Hải Đăng</span>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <Badge variant={requestStatusVariant[status]}>{requestStatusLabels[status]}</Badge>
            );
        },
    },
    {
        accessorKey: 'actions',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Hành động" />,
        cell: () => (
            <p>
                <span className="text-primary cursor-pointer">Duyệt</span> |{' '}
                <span className="text-red-500 cursor-pointer">Hủy</span>
            </p>
        ),
    },
];
