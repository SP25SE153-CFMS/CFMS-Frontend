import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { Vaccine } from '@/utils/schemas/vaccine.schema';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Vaccine>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên vắc-xin" />,
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'batchNumber',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lô" />,
        cell: ({ row }) => <div>{row.getValue('batchNumber')}</div>,
    },
    {
        accessorKey: 'expiryDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Hạn sử dụng" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('expiryDate'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
    },
    {
        accessorKey: 'supplierId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nhà cung cấp" />,
        cell: ({ row }) => <div>{row.getValue('supplierId') ? 'Nhà cung cấp THD' : '-'}</div>,
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
