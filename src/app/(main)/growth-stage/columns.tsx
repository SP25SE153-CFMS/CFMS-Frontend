'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { GrowthStage } from '@/utils/schemas/growth-stage.schema';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { getChickenType } from '@/utils/functions/category.function';
import { NutritionPlan } from '@/utils/schemas/nutrition-plan.schema';
import Link from 'next/link';
import config from '@/configs';

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
            <div className="max-w-[200px] text-left cursor-default">
                {row.getValue('description') || 'Không có mô tả'}
            </div>
        ),
        // <TooltipProvider>
        //     <Tooltip>
        //         <TooltipTrigger>
        //             <div className="max-w-[200px] text-left cursor-default">
        //                 {row.getValue('description')}
        //             </div>
        //         </TooltipTrigger>
        //         <TooltipContent>{row.getValue('description')}</TooltipContent>
        //     </Tooltip>
        // </TooltipProvider>
    },
    {
        accessorKey: 'stageCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã giai đoạn" />,
        cell: ({ row }) => <div>{row.getValue('stageCode') || 'Không có'}</div>,
    },
    {
        accessorKey: 'chickenType',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Loại gà" />,
        cell: ({ row }) => {
            const chickenTypeId = row.getValue('chickenType') as string;
            return <div>{getChickenType(chickenTypeId)}</div>;
        },
    },
    {
        accessorKey: 'minAgeWeek', // Ensure the data exists in the row
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    // {
    //     accessorKey: 'minAgeWeek',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Tuổi bắt đầu" />,
    //     cell: ({ row }) => <div>Tuần {row.getValue('minAgeWeek')}</div>,
    // },
    {
        accessorKey: 'maxAgeWeek',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tuổi" />,
        cell: ({ row }) => (
            <div>
                Tuần {row.getValue('minAgeWeek')} - {row.getValue('maxAgeWeek')}
            </div>
        ),
    },
    {
        accessorKey: 'nutritionPlanId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Chế độ dinh dưỡng" />,
        cell: ({ row }) => {
            const nutritionPlanId = row.getValue('nutritionPlanId') as string;
            const nutritionPlans = JSON.parse(
                sessionStorage.getItem('nutritionPlans') || '[]',
            ) as NutritionPlan[];
            const nutritionPlan = nutritionPlans.find(
                (plan) => plan.nutritionPlanId === nutritionPlanId,
            );
            return (
                <Link href={`${config.routes.nutritionPlan}/${nutritionPlanId}`}>
                    {nutritionPlan?.name ?? 'Không có'}
                </Link>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
