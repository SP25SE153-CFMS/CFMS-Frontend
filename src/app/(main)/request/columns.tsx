'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Request } from '@/utils/schemas/request.schema';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import { requestStatusLabels, requestStatusVariant } from '@/utils/enum/status.enum';
import { DataTableRowActions } from './data-table-row-ations';
import { User } from '@/utils/schemas/user.schema';
import { getRequestType } from '@/utils/functions/category.function';

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
        accessorKey: 'requestTypeId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Loại yêu cầu" />,
        cell: ({ row }) => {
            const requestTypeId = row.getValue('requestTypeId') as string;
            const requestType = getRequestType(requestTypeId);
            return <span>{requestType ?? '-'}</span>;
        },
    },
    // {
    //     accessorKey: 'content',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Nội dung" />,
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
        accessorKey: 'createdByUserId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Người tạo" />,
        cell: ({ row }) => {
            const users: User[] = JSON.parse(sessionStorage.getItem('users') || '[]');
            const createdBy = users.find((user) => user.userId === row.getValue('createdByUserId'));
            return <span>{createdBy?.fullName ?? '-'}</span>;
        },
    },
    {
        accessorKey: 'approvedById',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Người duyệt" />,
        cell: ({ row }) => {
            const users: User[] = JSON.parse(sessionStorage.getItem('users') || '[]');
            const approvedBy = users.find((user) => user.userId === row.getValue('approvedById'));
            return <span>{approvedBy?.fullName ?? 'Chưa duyệt'}</span>;
        },
    },
    {
        accessorKey: 'approvedAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày duyệt" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('approvedAt'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
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
    // {
    //     accessorKey: 'actions',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Hành động" />,
    //     cell: () => (
    //         <p>
    //             <span className="text-primary cursor-pointer">Duyệt</span> |{' '}
    //             <span className="text-red-500 cursor-pointer">Hủy</span>
    //         </p>
    //     ),
    // },

    // Làm logic view detail với tạo phiếu cho dễ
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
