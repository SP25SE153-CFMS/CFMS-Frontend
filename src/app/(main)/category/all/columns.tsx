'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Category } from '@/utils/schemas/category.schema';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { DataTableRowActions } from './data-table-row-actions';
import {
    CategoryStatus,
    categoryStatusLabels,
    categoryStatusVariant,
} from '@/utils/enum/status.enum';

export const columns: ColumnDef<Category>[] = [
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
        accessorKey: 'categoryId',
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    {
        accessorKey: 'categoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên danh mục" />,
        cell: ({ row }) => (
            <Link href={`/category/${row.getValue('categoryId')}`}>
                {row.getValue('categoryName')}
            </Link>
        ),
    },
    {
        accessorKey: 'categoryType',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Loại danh mục" />,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mô tả" />,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as CategoryStatus;
            return (
                <Badge variant={categoryStatusVariant[status]}>
                    {categoryStatusLabels[status]}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
