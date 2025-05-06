'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { SystemConfig } from '@/utils/schemas/config.schema';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<SystemConfig>[] = [
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
        accessorKey: 'systemConfigId',
        header: () => null,
        cell: () => null,
    },
    // {
    //     accessorKey: 'settingName',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Tên cấu hình" />,
    // },
    {
        accessorKey: 'settingValue',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Giá trị" />,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mô tả" />,
    },
    {
        accessorKey: 'effectedDateFrom',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bắt đầu" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('effectedDateFrom'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
    },
    {
        accessorKey: 'effectedDateTo',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày kết thúc" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('effectedDateTo'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as number;
            return (
                <Badge variant={status === 1 ? 'default' : 'secondary'}>
                    {status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                </Badge>
            );
        },
    },
    // {
    //     accessorKey: 'createdByUserId',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Người tạo" />,
    //     cell: ({ row }) => {
    //         const users: User[] = JSON.parse(sessionStorage.getItem('users') || '[]');
    //         const createdBy = users.find((user) => user.userId === row.getValue('createdByUserId'));
    //         return <span>{createdBy?.fullName ?? '-'}</span>;
    //     },
    // },
    // {
    //     accessorKey: 'createdWhen',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
    //     cell: ({ row }) => {
    //         const date = new Date(row.getValue('createdWhen'));
    //         return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
    //     },
    // },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
