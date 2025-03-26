'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import dayjs from 'dayjs';
import { FlockNutrition } from '@/utils/schemas/nutrition.schema';
import { flocks, nutritions } from '@/utils/data/table.data';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<FlockNutrition>[] = [
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
    //     accessorKey: 'flockNutritionId',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="ID Dinh Dưỡng Đàn" />,
    //     cell: ({ row }) => (
    //         <div className="w-[250px] truncate">{row.getValue('flockNutritionId')}</div>
    //     ),
    // },
    {
        accessorKey: 'flockId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Đàn gà" />,
        cell: ({ row }) => {
            const flockId = row.getValue('flockId');
            const flock = flocks.find((flock) => flock.flockId === flockId);
            return <div>{flock?.name}</div>;
        },
    },
    {
        accessorKey: 'nutritionId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Dinh Dưỡng" />,
        cell: ({ row }) => {
            const nutritionId = row.getValue('nutritionId');
            const nutrition = nutritions.find((nutrition) => nutrition.nutritionId === nutritionId);
            return <div>{nutrition?.name}</div>;
        },
    },
    {
        accessorKey: 'startDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày Bắt Đầu" />,
        cell: ({ row }) => <div>{dayjs(row.getValue('startDate')).format('DD/MM/YYYY')}</div>,
    },
    {
        accessorKey: 'endDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày Kết Thúc" />,
        cell: ({ row }) => <div>{dayjs(row.getValue('endDate')).format('DD/MM/YYYY')}</div>,
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
