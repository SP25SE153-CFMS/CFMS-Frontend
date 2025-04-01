'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';
import { FarmEmployee } from '@/utils/schemas/farm-employee.schema';
import { farms, users } from '@/utils/data/table.data';
import {
    EmployeeStatus,
    employeeStatusLabels,
    employeeStatusVariant,
} from '@/utils/enum/status.enum';
import { User } from '@/utils/schemas/user.schema';
import { DataTableRowActions } from './data-table-row-actions';
import { farmRoleLabels } from '@/utils/enum';

export const columns: ColumnDef<FarmEmployee>[] = [
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
    //     accessorKey: 'farmId',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Trang trại" />,
    //     cell: ({ row }) => {
    //         const farm = farms.find((farm) => farm.farmId === row.getValue('farmId'));
    //         return <div>{farm?.farmName}</div>;
    //     },
    // },
    {
        accessorKey: 'user',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nhân viên" />,
        cell: ({ row }) => {
            const user = row.getValue('user') as User;
            return <div>{user?.fullName ?? '-'}</div>;
        },
    },
    {
        accessorKey: 'startDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bắt đầu" />,
        cell: ({ row }) => <div>{dayjs(row.getValue('startDate')).format('DD/MM/YYYY')}</div>,
    },
    {
        accessorKey: 'endDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày kết thúc" />,
        cell: ({ row }) => {
            const endDate = row.getValue('endDate') as Date;
            return <div>{endDate ? dayjs(endDate).format('DD/MM/YYYY') : 'Chưa kết thúc'}</div>;
        },
    },
    {
        accessorKey: 'farmRole',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Vai trò" />,
        cell: ({ row }) => {
            const farmRole = row.getValue('farmRole') as string;
            return <div>{farmRoleLabels[farmRole]}</div>;
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as EmployeeStatus;
            return (
                <Badge variant={employeeStatusVariant[status]}>
                    {employeeStatusLabels[status]}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
