'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import dayjs from 'dayjs';
import { CoopEquipment } from '@/utils/schemas/equipment.schema';
import { equipments } from '@/utils/data/table.data';
import { Badge } from '@/components/ui/badge';
import { flockStatusLabels, flockStatusVariant } from '@/utils/enum/status.enum';

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
            const equipmentId = row.getValue('equipmentId');
            const equipment = equipments.find((equip) => equip.equipmentId === equipmentId);
            return <div className="w-[150px]">{equipment?.equipmentName}</div>;
        },
    },
    {
        accessorKey: 'quantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue('quantity')}</div>,
    },
    {
        accessorKey: 'assignedDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày phân bổ" />,
        cell: ({ row }) => (
            <div className="w-[150px]">
                {dayjs(row.getValue('assignedDate')).format('DD/MM/YYYY')}
            </div>
        ),
    },
    // {
    //     accessorKey: 'maintainDate',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bảo trì" />,
    //     cell: ({ row }) => {
    //         const maintainDate = new Date(row.getValue('maintainDate'));
    //         return (
    //             <div className="w-[150px]">
    //                 {maintainDate ? dayjs(maintainDate).format('DD/MM/YYYY') : '-'}
    //             </div>
    //         );
    //     },
    // },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return <Badge variant={flockStatusVariant[status]}>{flockStatusLabels[status]}</Badge>;
        },
    },
    // Uncomment this block to show the note column
    // {
    //     accessorKey: 'note',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Ghi chú" />,
    //     cell: ({ row }) => <div className="w-[250px] truncate">{row.getValue('note') || '-'}</div>,
    // },
];
