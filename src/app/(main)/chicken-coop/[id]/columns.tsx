'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import dayjs from 'dayjs';
import { CoopEquipment } from '@/utils/schemas/equipment.schema';
import { chickenCoops, equipments } from '@/utils/data/table.data';

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
    // Uncomment this block to show the coop equipment ID column
    // {
    //     accessorKey: 'coopEquipmentId',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="ID thiết bị" />,
    //     cell: ({ row }) => (
    //         <div className="w-[200px] truncate">{row.getValue('coopEquipmentId')}</div>
    //     ),
    // },
    {
        accessorKey: 'chickenCoopId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Chuồng gà" />,
        cell: ({ row }) => {
            const chickenCoopId = row.getValue('chickenCoopId');
            const chickenCoop = chickenCoops.find((coop) => coop.chickenCoopId === chickenCoopId);
            return <div className="w-[150px]">{chickenCoop?.chickenCoopName}</div>;
        },
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
    {
        accessorKey: 'maintainDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bảo trì" />,
        cell: ({ row }) => {
            const maintainDate = new Date(row.getValue('maintainDate'));
            return (
                <div className="w-[150px]">
                    {maintainDate ? dayjs(maintainDate).format('DD/MM/YYYY') : '-'}
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const statusLabels: Record<string, string> = {
                IN_USE: 'Đang sử dụng',
                BROKEN: 'Hỏng',
                UNDER_MAINTENANCE: 'Bảo trì',
            };
            return <div className="w-[150px]">{statusLabels[status]}</div>;
        },
    },
    // Uncomment this block to show the note column
    // {
    //     accessorKey: 'note',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Ghi chú" />,
    //     cell: ({ row }) => <div className="w-[250px] truncate">{row.getValue('note') || '-'}</div>,
    // },
];
