'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { BreedingArea } from '@/utils/schemas/breeding-area.schema';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { ChickenCoop } from '@/utils/schemas/chicken-coop.schema';
import {
    BreedingAreaStatus,
    breedingAreaStatusLabels,
    breedingAreaStatusVariant,
} from '@/utils/enum/status.enum';
import { Badge } from '@/components/ui/badge';
import { getAreaUnit } from '@/utils/functions/category.function';
import Image from '@/components/fallback-image';

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
        accessorKey: 'breedingAreaCode', // Ensure the data exists in the row
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    {
        accessorKey: 'breedingAreaName', // Ensure the data exists in the row
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    // {
    //     accessorKey: 'breedingAreaCode',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Mã khu nuôi" />,
    //     cell: ({ row }) => <div className="w-[80px]">{row.getValue('breedingAreaCode')}</div>,
    //     enableSorting: false,
    //     enableHiding: false,
    // },
    // {
    //     accessorKey: 'breedingAreaName',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Tên khu nuôi" />,
    //     cell: ({ row }) => (
    //         <Link
    //             href={`${config.routes.chickenCoop}?breedingAreaId=${row.getValue('breedingAreaId')}`}
    //             onClick={() =>
    //                 sessionStorage.setItem('breedingAreaId', row.getValue('breedingAreaId'))
    //             }
    //         >
    //             {row.getValue('breedingAreaName')}
    //         </Link>
    //     ),
    // },
    {
        accessorKey: 'imageUrl', // Ensure the data exists in the row
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    {
        id: 'breedingArea',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên khu nuôi" />,
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <Image
                        src={row.getValue('imageUrl') ?? '/breeding-area.png'}
                        alt={row.getValue('breedingAreaCode')}
                        className="rounded-sm"
                        width={100}
                        height={100}
                    />
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {row.getValue('breedingAreaCode')}
                        </p>
                        <p>{row.getValue('breedingAreaName')}</p>
                    </div>
                </div>
            );
        },
    },
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
            const areaUnitId = row.getValue('areaUnitId') as string;
            const areaUnit = getAreaUnit(areaUnitId);
            return (
                <div>
                    {area ?? 0} {areaUnit}
                </div>
            );
        },
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
        accessorKey: 'notes',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ghi chú" />,
        cell: ({ row }) => (
            <div className="w-[200px] line-clamp-3">{row.getValue('notes') ?? '-'}</div>
        ),
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as BreedingAreaStatus;
            return (
                <Badge variant={breedingAreaStatusVariant[status]}>
                    {breedingAreaStatusLabels[status]}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
