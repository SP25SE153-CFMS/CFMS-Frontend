'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Flock } from '@/utils/schemas/flock.schema';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import config from '@/configs';
import { DataTableRowActions } from './data-table-row-actions';
import { flockStatusLabels, flockStatusVariant } from '@/utils/enum/status.enum';

export const columns: ColumnDef<Flock>[] = [
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
        accessorKey: 'flockId',
        header: () => null,
        cell: () => null,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên đàn" />,
        cell: ({ row, table }) => (
            <Link
                href={`${config.routes.flock}/${row.getValue('flockId')}`}
                onClick={() => {
                    const flocks = table.getCoreRowModel().rows.map((row) => row.original);
                    sessionStorage.setItem('flocks', JSON.stringify(flocks));
                }}
            >
                {row.getValue('name')}
            </Link>
        ),
    },
    {
        accessorKey: 'quantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng" />,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return <Badge variant={flockStatusVariant[status]}>{flockStatusLabels[status]}</Badge>;
        },
    },
    {
        accessorKey: 'avgWeight',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Trọng lượng TB (kg)" />
        ),
    },
    {
        accessorKey: 'mortalityRate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tỷ lệ tử vong (%)" />,
    },
    {
        accessorKey: 'housingId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Chuồng trại" />,
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
    // {
    //     accessorKey: 'lastHealthCheck',
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Lần kiểm tra sức khỏe cuối" />
    //     ),
    //     cell: ({ row }) => (
    //         <div className="w-[150px]">
    //             {row.getValue('lastHealthCheck')
    //                 ? dayjs(row.getValue('lastHealthCheck')).format('DD/MM/YYYY')
    //                 : '-'}
    //         </div>
    //     ),
    // },
    // {
    //     accessorKey: 'gender',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Giới tính" />,
    //     cell: ({ row }) => {
    //         const genderLabels: Record<string, string> = {
    //             male: 'Trống',
    //             female: 'Mái',
    //             mixed: 'Hỗn hợp',
    //         };
    //         const gender: string = row.getValue('gender');
    //         return <div className="w-[100px] text-center">{genderLabels[gender]}</div>;
    //     },
    // },
];
