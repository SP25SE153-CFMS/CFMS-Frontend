'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import dayjs from 'dayjs';
import { CoopEquipment } from '@/utils/schemas/coop-equipment.schema';
import { Badge } from '@/components/ui/badge';
import { equipmentStatusLabels, equipmentStatusVariant } from '@/utils/enum/status.enum';
import { Equipment } from '@/utils/schemas/equipment.schema';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<CoopEquipment>[] = [
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
        accessorKey: 'equipmentId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Thiết bị" />,
        cell: ({ row }) => {
            const equipments: Equipment[] = JSON.parse(
                sessionStorage.getItem('equipments') || '[]',
            );
            const equipmentId = row.getValue('equipmentId');
            const equipment = equipments.find((equip) => equip.equipmentId === equipmentId);
            return <div className="w-[150px]">{equipment?.equipmentName}</div>;
        },
    },
    {
        accessorKey: 'quantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="S.lượng" />,
        cell: ({ row }) => <div>{row.getValue('quantity')}</div>,
    },
    {
        accessorKey: 'assignedDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày lắp đặt" />,
        cell: ({ row }) => <div>{dayjs(row.getValue('assignedDate')).format('DD/MM/YYYY')}</div>,
    },
    {
        accessorKey: 'nextMaintenanceDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bảo trì" />,
        cell: ({ row }) => {
            const maintainDate = new Date(row.getValue('nextMaintenanceDate'));
            return <div>{maintainDate ? dayjs(maintainDate).format('DD/MM/YYYY') : '-'}</div>;
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <Badge variant={equipmentStatusVariant[status]}>
                    {equipmentStatusLabels[status]}
                </Badge>
            );
        },
    },
    // Uncomment this block to show the note column
    // {
    //     accessorKey: 'note',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Ghi chú" />,
    //     cell: ({ row }) => <div className="w-[250px] truncate">{row.getValue('note') || '-'}</div>,
    // },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
