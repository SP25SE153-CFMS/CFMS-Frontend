'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import Image from '@/components/fallback-image';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';
import { User } from '@/utils/schemas/user.schema';
import { userStatusLabels, userStatusVariant } from '@/utils/enum/status.enum';

export const columns: ColumnDef<User>[] = [
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
        accessorKey: 'fullName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Họ và tên" />,
        cell: ({ row }) => <div className="w-[200px]">{row.getValue('fullName')}</div>,
    },
    {
        accessorKey: 'phoneNumber',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số điện thoại" />,
        cell: ({ row }) => <div className="w-[150px]">{row.getValue('phoneNumber')}</div>,
    },
    {
        accessorKey: 'mail',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
        cell: ({ row }) => <div className="w-[200px] truncate">{row.getValue('mail')}</div>,
    },
    {
        accessorKey: 'avatar',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Avatar" />,
        cell: ({ row }) => {
            const avatar = row.getValue('avatar');
            return (
                <div>
                    {avatar ? (
                        <Image
                            src={avatar as string}
                            alt="Avatar"
                            width={40}
                            height={40}
                            className="rounded-full"
                            preview
                        />
                    ) : (
                        '-'
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'dateOfBirth',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày sinh" />,
        cell: ({ row }) => {
            const dateOfBirth = row.getValue('dateOfBirth') as string;
            return (
                <div className="w-[150px]">
                    {dateOfBirth ? dayjs(dateOfBirth).format('DD/MM/YYYY') : '-'}
                </div>
            );
        },
    },
    // {
    //     accessorKey: 'startDate',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bắt đầu" />,
    //     cell: ({ row }) => (
    //         <div className="w-[150px]">{dayjs(row.getValue('startDate')).format('DD/MM/YYYY')}</div>
    //     ),
    // },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return <Badge variant={userStatusVariant[status]}>{userStatusLabels[status]}</Badge>;
        },
    },
    // {
    //     accessorKey: 'address',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Địa chỉ" />,
    //     cell: ({ row }) => <div className="w-[300px] truncate">{row.getValue('address')}</div>,
    // },
    // {
    //     accessorKey: 'cccd',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="cccd" />,
    //     cell: ({ row }) => <div className="w-[150px]">{row.getValue('cccd')}</div>,
    // },
    {
        accessorKey: 'roleName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Vai trò" />,
        cell: ({ row }) => <div className="w-[150px]">{row.getValue('roleName')}</div>,
    },
];
