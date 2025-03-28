'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { GrowthStage } from '@/utils/schemas/growth-stage.schema';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import Link from 'next/link';
import { DataTableRowActions } from './data-table-row-actions';
import config from '@/configs';
import { CategoryType } from '@/utils/enum/category.enum';
import { getSubCategoryByCategoryType } from '@/utils/functions/category.function';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const columns: ColumnDef<GrowthStage>[] = [
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
        accessorKey: 'growthStageId', // Ensure the data exists in the row
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    {
        accessorKey: 'stageName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên giai đoạn" />,
        cell: ({ row }) => (
            <Link href={`${config.routes.growthStage}/${row.getValue('growthStageId')}`}>
                {row.getValue('stageName')}
            </Link>
        ),
    },
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mô tả" />,
        cell: ({ row }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <div className="w-[300px] truncate">{row.getValue('description')}</div>
                    </TooltipTrigger>
                    <TooltipContent>{row.getValue('description')}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
    },
    {
        accessorKey: 'stageCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã giai đoạn" />,
        cell: ({ row }) => (
            <div className="w-[150px]">{row.getValue('stageCode') ?? 'Không có'}</div>
        ),
    },
    {
        accessorKey: 'chickenType',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Loại gà" />,
        cell: ({ row }) => {
            const chickenTypeId = row.getValue('chickenType') as string;
            const chickenType = getSubCategoryByCategoryType(CategoryType.CHICKEN).find(
                (subCategory) => subCategory.subCategoryId === chickenTypeId,
            );

            return <div>{chickenType?.subCategoryName ?? 'Không có'}</div>;
        },
    },
    {
        accessorKey: 'minAgeWeek',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tuổi tối thiểu (tuần)" />
        ),
        cell: ({ row }) => <div>{row.getValue('minAgeWeek')}</div>,
    },
    {
        accessorKey: 'maxAgeWeek',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tuổi tối đa (tuần)" />
        ),
        cell: ({ row }) => <div>{row.getValue('maxAgeWeek')}</div>,
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
