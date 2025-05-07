'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { SubCategory } from '@/utils/schemas/sub-category.schema';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';
import {
    CategoryStatus,
    categoryStatusLabels,
    categoryStatusVariant,
} from '@/utils/enum/status.enum';
import { DataType, dataTypeLabels } from '@/utils/enum';

export const columns: ColumnDef<SubCategory>[] = [
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
        accessorKey: 'subCategoryId',
        header: () => null, // No header
        cell: () => null, // Hidden cell
    },
    {
        accessorKey: 'subCategoryName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên danh mục con" />,
        cell: ({ row }) => <div className="w-[150px]">{row.getValue('subCategoryName')}</div>,
        enableSorting: true,
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
        accessorKey: 'dataType',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kiểu dữ liệu" />,
        cell: ({ row }) => {
            const dataType = row.getValue('dataType') as DataType;
            return <div>{dataTypeLabels[dataType]}</div>;
        },
    },
    {
        accessorKey: 'createdDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
        cell: ({ row }) => (
            <div className="w-[150px]">
                {dayjs(row.getValue('createdDate')).format('DD/MM/YYYY')}
            </div>
        ),
    },
    // {
    //     id: 'actions',
    //     cell: ({ row }) => <DataTableRowActions row={row} />,
    // },
];
