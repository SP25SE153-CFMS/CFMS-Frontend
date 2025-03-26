'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import dayjs from 'dayjs';
import { Food } from '@/utils/schemas/food.schema';

export const columns: ColumnDef<Food>[] = [
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
        accessorKey: 'foodCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã Thức Ăn" />,
        cell: ({ row }) => <div>{row.getValue('foodCode')}</div>,
    },
    {
        accessorKey: 'foodName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên Thức Ăn" />,
        cell: ({ row }) => <div>{row.getValue('foodName')}</div>,
    },
    {
        accessorKey: 'productionDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày Sản Xuất" />,
        cell: ({ row }) => {
            const productionDate = row.getValue('productionDate') as string;
            return (
                <div>
                    {productionDate
                        ? dayjs(productionDate).format('DD/MM/YYYY')
                        : 'Không có ngày sản xuất'}
                </div>
            );
        },
    },
    {
        accessorKey: 'expiryDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày Hết Hạn" />,
        cell: ({ row }) => {
            const expiryDate = row.getValue('expiryDate') as string;
            return (
                <div>
                    {expiryDate ? dayjs(expiryDate).format('DD/MM/YYYY') : 'Không có hạn sử dụng'}
                </div>
            );
        },
    },
    {
        accessorKey: 'note',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ghi Chú" />,
        cell: ({ row }) => <div>{row.getValue('note') || 'Không có ghi chú'}</div>,
    },
];
