'use client';

import dayjs from 'dayjs';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Equipment } from '@/utils/schemas/equipment.schema';
import { DataTableRowActions } from './data-table-row-actions';
import { getLengthUnit, getMaterial, getWeightUnit } from '@/utils/functions/category.function';

export const columns: ColumnDef<Equipment>[] = [
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
        accessorKey: 'equipmentCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã thiết bị" />,
    },
    {
        accessorKey: 'equipmentName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên thiết bị" />,
    },
    {
        accessorKey: 'purchaseDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày mua" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('purchaseDate'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
    },
    // {
    //     accessorKey: 'warrantyPeriod',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Bảo hành (tháng)" />,
    // },
    // {
    //     accessorKey: 'status',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
    //     cell: ({ row }) => {
    //         const status = row.getValue('status') as string;
    //         return (
    //             <Badge variant={equipmentStatusVariant[status]}>
    //                 {equipmentStatusLabels[status]}
    //             </Badge>
    //         );
    //     },
    // },
    // {
    //     accessorKey: 'cost',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Chi phí" />,
    //     cell: ({ row }) => <div>{row.getValue('cost')?.toLocaleString()} VNĐ</div>,
    // },
    // {
    //     accessorKey: 'quantity',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng" />,
    // },
    {
        accessorKey: 'materialId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Chất liệu" />,
        cell: ({ row }) => <div>{getMaterial(row.getValue('materialId'))}</div>,
    },
    {
        accessorKey: 'usage',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Công dụng" />,
    },
    {
        accessorKey: 'warranty',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Bảo hành (tháng)" />,
    },
    {
        accessorKey: 'sizeUnitId', // Ensure the data exists in the row
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    {
        accessorKey: 'size',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kích thước" />,
        cell: ({ row }) => (
            <div>
                {row.getValue('size')} {getLengthUnit(row.getValue('sizeUnitId'))}
            </div>
        ),
    },
    {
        accessorKey: 'weightUnitId', // Ensure the data exists in the row
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    {
        accessorKey: 'weight',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Khối lượng" />,
        cell: ({ row }) => (
            <div>
                {row.getValue('weight')} {getWeightUnit(row.getValue('weightUnitId'))}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
