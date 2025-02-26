'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { ChickenCoop } from '@/utils/schemas/chicken-coop.schema';
import { breedingAreas } from '@/utils/data/table.data';

export const columns: ColumnDef<ChickenCoop>[] = [
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
        accessorKey: 'chickenCoopCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã chuồng" />,
        cell: ({ row }) => <div className="w-[100px]">{row.getValue('chickenCoopCode')}</div>,
        enableSorting: true,
    },
    {
        accessorKey: 'chickenCoopName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên chuồng" />,
    },
    {
        accessorKey: 'capacity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Sức chứa" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('capacity')} con</div>,
    },
    {
        accessorKey: 'location',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Vị trí" />,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const statusLabels: Record<string, string> = {
                AVAILABLE: 'Còn trống',
                OCCUPIED: 'Đang sử dụng',
                UNDER_MAINTENANCE: 'Bảo trì',
            };
            return <div className="w-[150px]">{statusLabels[status]}</div>;
        },
    },
    {
        accessorKey: 'breedingAreaId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Khu vực chăn nuôi" />,
        cell: ({ row }) => (
            <div>
                {breedingAreas.find(
                    (area) => area.breedingAreaId === row.getValue('breedingAreaId'),
                )?.breedingAreaName || '-'}
            </div>
        ),
    },
    // TODO: Uncomment this block when the DataTableRowActions component for ChickenCoop is ready
    // {
    //     id: 'actions',
    //     cell: ({ row }) => <DataTableRowActions row={row} />,
    // },
];
