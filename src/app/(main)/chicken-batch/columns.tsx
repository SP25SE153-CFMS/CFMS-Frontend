'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import config from '@/configs';
import { DataTableRowActions } from './data-table-row-actions';
import { chickenBatchStatusLabels, chickenBatchStatusVariant } from '@/utils/enum/status.enum';
import { ChickenBatch } from '@/utils/schemas/chicken-batch.schema';
import dayjs from 'dayjs';

export const columns: ColumnDef<ChickenBatch>[] = [
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
        accessorKey: 'chickenBatchId',
        header: () => null,
        cell: () => null,
    },
    {
        accessorKey: 'chickenBatchName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên lứa nuôi" />,
        cell: ({ row, table }) => (
            <Link
                href={`${config.routes.chickenBatch}/${row.getValue('chickenBatchId')}`}
                onClick={() => {
                    const chickenBatches = table.getCoreRowModel().rows.map((row) => row.original);
                    sessionStorage.setItem('chickenBatches', JSON.stringify(chickenBatches));
                }}
            >
                {row.getValue('chickenBatchName')}
            </Link>
        ),
    },
    {
        accessorKey: 'startDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bắt đầu" />,
        cell: ({ row }) => {
            const startDate = row.getValue('startDate') as string;
            return <div>{startDate ? dayjs(startDate).format('DD/MM/YYYY') : 'Chưa kết thúc'}</div>;
        },
    },
    {
        accessorKey: 'endDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày kết thúc" />,
        cell: ({ row }) => {
            const endDate = row.getValue('endDate') as string | null;
            return <div>{endDate ? dayjs(endDate).format('DD/MM/YYYY') : 'Chưa kết thúc'}</div>;
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <Badge variant={chickenBatchStatusVariant[status]}>
                    {chickenBatchStatusLabels[status]}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'note',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ghi chú" />,
        cell: ({ row }) => {
            const note = row.getValue('note') as string | undefined;
            return <div>{note || 'Không có ghi chú'}</div>;
        },
    },
    // {
    //     accessorKey: 'chickenCoopId',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Chuồng gà" />,
    //     cell: ({ row }) => {
    //         const chickenCoopId = row.getValue('chickenCoopId') as string;
    //         return <div>{chickenCoopId}</div>;
    //     },
    // },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
