'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { HarvestLog } from '@/utils/schemas/harvest-log.schema';

export const columns: ColumnDef<HarvestLog>[] = [
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
    //     accessorKey: 'chickenCoopId',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Mã chuồng gà" />,
    //     cell: ({ row }) => {
    //         const chickenCoopId = row.getValue('chickenCoopId') as string;
    //         const chickenCoop = chickenCoops.find((coop) => coop.chickenCoopId === chickenCoopId);
    //         return <div className="w-[150px]">{chickenCoop?.chickenCoopName}</div>;
    //     },
    // },
    // {
    //     accessorKey: 'date',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày thu hoạch" />,
    //     cell: ({ row }) => (
    //         <div className="w-[150px]">{dayjs(row.getValue('date')).format('DD/MM/YYYY')}</div>
    //     ),
    // },
    {
        accessorKey: 'harvestProductCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã sản phẩm" />,
        cell: ({ row }) => <div className="w-[150px]">{row.getValue('harvestProductCode')}</div>,
    },
    {
        accessorKey: 'harvestProductName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên sản phẩm" />,
        cell: ({ row }) => <div className="w-[150px]">{row.getValue('harvestProductName')}</div>,
    },
    {
        accessorKey: 'harvestProductType',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Loại sản phẩm" />,
        cell: ({ row }) => <div className="w-[150px]">{row.getValue('harvestProductType')}</div>,
    },
    {
        accessorKey: 'harvestProductQuantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng" />,
        cell: ({ row }) => (
            <div className="w-[100px]">{row.getValue('harvestProductQuantity')}</div>
        ),
    },
];
