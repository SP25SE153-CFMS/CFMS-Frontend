'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { ChickenCoop } from '@/utils/schemas/chicken-coop.schema';
import { breedingAreas } from '@/utils/data/table.data';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { DataTableRowActions } from './data-table-row-actions';
import {
    ChickenCoopStatus,
    chickenCoopStatusLabels,
    chickenCoopStatusVariant,
} from '@/utils/enum/status.enum';

export const columns: ColumnDef<ChickenCoop>[] = [
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
        accessorKey: 'chickenCoopId', // Ensure the data exists in the row
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    {
        accessorKey: 'chickenCoopCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã chuồng" />,
        cell: ({ row }) => <div className="w-[100px]">{row.getValue('chickenCoopCode')}</div>,
        enableSorting: true,
    },
    {
        accessorKey: 'chickenCoopName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên chuồng" />,
        cell: ({ row }) => (
            <Link
                href={`/chicken-coop/${row.getValue('chickenCoopId')}`}
                // onClick={() => {
                //     const chickenCoops = table.getCoreRowModel().rows.map((row) => row.original);
                //     sessionStorage.setItem('chickenCoops', JSON.stringify(chickenCoops));
                // }}
            >
                {row.getValue('chickenCoopName')}
            </Link>
        ),
    },
    {
        accessorKey: 'currentQuantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('currentQuantity')} con</div>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as ChickenCoopStatus;
            return (
                <Badge variant={chickenCoopStatusVariant[status]}>
                    {chickenCoopStatusLabels[status]}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'breedingAreaId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Khu vực chăn nuôi" />,
        cell: ({ row }) => (
            <div>
                {breedingAreas.find(
                    (area) => area.breedingAreaId === row.getValue('breedingAreaId'),
                )?.breedingAreaName || '-'}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
