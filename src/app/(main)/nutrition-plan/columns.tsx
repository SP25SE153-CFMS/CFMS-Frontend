'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { NutritionPlan } from '@/utils/schemas/nutrition-plan.schema';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import Link from 'next/link';
import { DataTableRowActions } from './data-table-row-actions';
import config from '@/configs';

export const columns: ColumnDef<NutritionPlan>[] = [
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
        accessorKey: 'nutritionPlanId', // Ensure the data exists in the row
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tên chế độ dinh dưỡng" />
        ),
        cell: ({ row }) => (
            <Link href={`${config.routes.nutritionPlan}/${row.getValue('nutritionPlanId')}`}>
                {row.getValue('name')}
            </Link>
        ),
    },
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mô tả" />,
        // cell: ({ row }) => (
        //     <div className="max-w-[450px] truncate">{row.getValue('description')}</div>
        // ),
    },
    // {
    //     accessorKey: 'feedSessions',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Số lịch cho ăn" />,
    //     cell: ({ row }) => {
    //         const feedSessions = row.getValue('feedSessions') as FeedSession[];
    //         return <div>{feedSessions?.length ?? 0}</div>;
    //     },
    // },
    // {
    //     accessorKey: 'nutritionPlanDetails',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng thức ăn" />,
    //     cell: ({ row }) => {
    //         const nutritionPlanDetails = row.getValue(
    //             'nutritionPlanDetails',
    //         ) as NutritionPlanDetail[];
    //         return <div>{nutritionPlanDetails?.length ?? 0}</div>;
    //     },
    // },
    // {
    //     accessorKey: '',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Mục tiêu" />,
    //     cell: ({ row }) => <div className="w-[150px]">{row.getValue('target') ?? 'Không có'}</div>,
    // },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
