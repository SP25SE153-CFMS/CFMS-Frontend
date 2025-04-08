'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { NutritionPlanDetail } from '@/utils/schemas/nutrition-plan-detail.schema';
import { getWeightUnit } from '@/utils/functions/category.function';
import { Food } from '@/utils/schemas/food.schema';

export const columns: ColumnDef<NutritionPlanDetail>[] = [
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
    //     accessorKey: 'nutritionPlanDetailId',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Mã Chi Tiết" />,
    //     cell: ({ row }) => <div>{row.getValue('nutritionPlanDetailId')}</div>,
    // },
    // {
    //     accessorKey: 'foodId',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Thức Ăn" />,
    //     cell: ({ row }) => <div>{row.getValue('foodId')}</div>,
    // },
    {
        accessorKey: 'food',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Thức Ăn" />,
        cell: ({ row }) => {
            const food = row.getValue('food') as Food;
            return <div>{food?.foodName ?? '-'}</div>;
        },
    },
    {
        accessorKey: 'unitId',
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    {
        accessorKey: 'foodWeight',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Khối Lượng" />,
        cell: ({ row }) => {
            const unitId = row.getValue('unitId') as string;
            const unit = getWeightUnit(unitId);
            return (
                <div>
                    {row.getValue('foodWeight')} {unit}
                </div>
            );
        },
    },
];
