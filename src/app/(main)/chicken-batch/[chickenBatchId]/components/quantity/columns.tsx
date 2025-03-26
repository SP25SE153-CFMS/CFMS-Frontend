'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { QuantityLog } from '@/utils/schemas/quantity-log.schema';
import { DataTableRowActions } from './data-table-row-actions';
import dayjs from 'dayjs';
import Image from 'next/image';

export const columns: ColumnDef<QuantityLog>[] = [
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
        accessorKey: 'logDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày Nhật Ký" />,
        cell: ({ row }) => <div>{dayjs(row.getValue('logDate')).format('DD/MM/YYYY HH:mm')}</div>,
    },
    {
        accessorKey: 'quantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số Lượng" />,
        cell: ({ row }) => <div>{row.getValue('quantity')}</div>,
    },
    {
        accessorKey: 'logType',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Loại Nhật Ký" />,
        cell: ({ row }) => <div>{row.getValue('logType')}</div>,
    },
    {
        accessorKey: 'notes',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ghi Chú" />,
        cell: ({ row }) => <div>{row.getValue('notes') || 'Không có ghi chú'}</div>,
    },
    {
        accessorKey: 'img',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Hình Ảnh" />,
        cell: ({ row }) => {
            const imgUrl = row.getValue('img') as string | undefined;
            return imgUrl ? (
                <a href={imgUrl} target="_blank" rel="noopener noreferrer">
                    <Image
                        width={40}
                        height={40}
                        src={imgUrl}
                        alt="Hình ảnh"
                        className="h-10 w-10 object-cover"
                    />
                </a>
            ) : (
                'Không có hình ảnh'
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
