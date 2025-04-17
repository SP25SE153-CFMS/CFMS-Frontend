'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ChickenCoop } from '@/utils/schemas/chicken-coop.schema';
import {
    ChickenCoopStatus,
    chickenCoopStatusLabels,
    chickenCoopStatusVariant,
} from '@/utils/enum/status.enum';
import { getChickenType, getSubCategoryByCategoryType } from '@/utils/functions/category.function';
import { CategoryType } from '@/utils/enum/category.enum';
import Link from 'next/link';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

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
            <Link href={`/chicken-coop/${row.getValue('chickenCoopId')}`}>
                {row.getValue('chickenCoopName')}
            </Link>
        ),
    },
    {
        accessorKey: 'maxQuantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Sức chứa" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('maxQuantity') ?? '0'} con</div>,
    },
    // {
    //     accessorKey: 'currentQuantity',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng hiện tại" />,
    //     cell: ({ row }) => (
    //         <div className="w-[80px]">{row.getValue('currentQuantity') ?? '0'} con</div>
    //     ),
    // },
    {
        accessorKey: 'areaUnitId', // Ensure the data exists in the row
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    {
        accessorKey: 'area',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Diện tích" />,
        cell: ({ row }) => {
            const area = row.getValue('area') as number;
            const areaUnit = getSubCategoryByCategoryType(CategoryType.AREA_UNIT)?.find(
                (unit) => unit.subCategoryId === row.getValue('areaUnitId'),
            )?.subCategoryName;
            return (
                <div className="w-[100px]">
                    {area} {areaUnit}
                </div>
            );
        },
    },
    {
        accessorKey: 'densityUnitId', // Ensure the data exists in the row
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    {
        accessorKey: 'density',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mật độ" />,
        cell: ({ row }) => {
            const density = row.getValue('density') as number;
            const densityUnit = getSubCategoryByCategoryType(CategoryType.DENSITY_UNIT)?.find(
                (unit) => unit.subCategoryId === row.getValue('densityUnitId'),
            )?.subCategoryName;
            return (
                <div className="w-[100px]">
                    {density} {densityUnit}
                </div>
            );
        },
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
        accessorKey: 'purposeId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Loại gà" />,
        cell: ({ row }) => {
            const purpose = getChickenType(row.getValue('purposeId'));
            return <div className="w-[120px]">{purpose || '-'}</div>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
