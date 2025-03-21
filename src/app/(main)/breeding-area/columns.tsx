'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { BreedingArea } from '@/utils/schemas/breeding-area.schema';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import Link from 'next/link';
import { DataTableRowActions } from './data-table-row-actions';
import { ChickenCoop } from '@/utils/schemas/chicken-coop.schema';
import config from '@/configs';

export const columns: ColumnDef<BreedingArea>[] = [
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
        accessorKey: 'breedingAreaId', // Ensure the data exists in the row
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    {
        accessorKey: 'breedingAreaCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã khu nuôi" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('breedingAreaCode')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'breedingAreaName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên khu nuôi" />,
        cell: ({ row }) => (
            <Link
                href={`${config.routes.chickenCoop}?breedingAreaId=${row.getValue('breedingAreaId')}`}
                onClick={() =>
                    sessionStorage.setItem('breedingAreaId', row.getValue('breedingAreaId'))
                }
            >
                {row.getValue('breedingAreaName')}
            </Link>
        ),
    },
    {
        accessorKey: 'mealsPerDay',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Bữa ăn/ngày" />,
    },
    {
        accessorKey: 'area',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Diện tích" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('area') ?? 0} m²</div>,
    },
    {
        accessorKey: 'chickenCoops',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số chuồng nuôi" />,
        cell: ({ row }) => {
            const chickenCoops = row.getValue('chickenCoops') as ChickenCoop[];
            return <div className="w-[80px]">{chickenCoops?.length ?? 0}</div>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
