'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { VaccinationLog } from '@/utils/schemas/vaccine.schema';
import { vaccines } from '@/utils/data/table.data';
import { DataTableRowActions } from './data-table-row-actions';
import {
    VaccinationLogStatus,
    vaccinationLogStatusLabels,
    vaccinationLogStatusVariant,
} from '@/utils/enum/status.enum';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<VaccinationLog>[] = [
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
    //     accessorKey: 'flockId',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Đàn gà" />,
    //     cell: ({ row }) => {
    //         const flockId = row.getValue('flockId');
    //         const flock = flocks.find((flock) => flock.flockId === flockId);
    //         return <div>{flock?.name || 'Không xác định'}</div>;
    //     },
    // },
    {
        accessorKey: 'vaccineId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Vắc-xin" />,
        cell: ({ row }) => {
            const vaccineId = row.getValue('vaccineId');
            const vaccine = vaccines.find((vaccine) => vaccine.vaccineId === vaccineId);
            return <div>{vaccine?.name || 'Không xác định'}</div>;
        },
    },
    {
        accessorKey: 'dosage',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Liều lượng" />,
        cell: ({ row }) => <div>{row.getValue('dosage')}</div>,
    },
    {
        accessorKey: 'quantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng" />,
        cell: ({ row }) => <div>{row.getValue('quantity')}</div>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as VaccinationLogStatus;
            return (
                <Badge variant={vaccinationLogStatusVariant[status]}>
                    {vaccinationLogStatusLabels[status]}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'reaction',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Phản ứng" />,
        cell: ({ row }) => <div>{row.getValue('reaction') || 'Không có'}</div>,
    },
    // {
    //     accessorKey: 'createdAt',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
    //     cell: ({ row }) => <div>{dayjs(row.getValue('createdAt')).format('DD/MM/YYYY HH:mm')}</div>,
    // },
    // {
    //     accessorKey: 'updatedAt',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày cập nhật" />,
    //     cell: ({ row }) => <div>{dayjs(row.getValue('updatedAt')).format('DD/MM/YYYY HH:mm')}</div>,
    // },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
