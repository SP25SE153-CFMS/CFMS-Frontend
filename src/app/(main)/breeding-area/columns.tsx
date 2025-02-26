'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { BreedingArea } from '@/utils/schemas/breeding-area.schema';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { DataTableRowActions } from '@/components/table/data-table-row-actions';

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
        accessorKey: 'breedingAreaCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('breedingAreaCode')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'breedingAreaName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên khu nuôi" />,
    },
    {
        accessorKey: 'humidity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Độ ẩm" />,
    },
    {
        accessorKey: 'mealsPerDay',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Bữa ăn/ngày" />,
    },
    {
        accessorKey: 'temperature',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nhiệt độ" />,
    },
    {
        accessorKey: 'width',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Chiều rộng" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('width')}m</div>,
    },
    {
        accessorKey: 'height',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Chiều cao" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('height')}m</div>,
    },
    {
        accessorKey: 'covered',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mái che" />,
        cell: ({ row }) => (
            <div className="w-[80px]">{row.getValue('covered') ? 'Có' : 'Không'}</div>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
