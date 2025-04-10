import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { WareStockResponse } from '@/utils/types/custom.type';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<WareStockResponse>[] = [
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
        accessorKey: 'medicineId',
        header: () => null,
        cell: () => null,
    },
    {
        accessorKey: 'medicineCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã thuốc" />,
        cell: ({ row }) => <div>{row.getValue('medicineCode')}</div>,
    },
    {
        accessorKey: 'medicineName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên thuốc" />,
        cell: ({ row }) => <div>{row.getValue('medicineName')}</div>,
    },
    {
        accessorKey: 'usage',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cách sử dụng" />,
        cell: ({ row }) => <div>{row.getValue('usage')}</div>,
    },
    {
        accessorKey: 'dosageForm',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Liều lượng" />,
        cell: ({ row }) => <div>{row.getValue('dosageForm')}</div>,
    },
    {
        accessorKey: 'storageCondition',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Điều kiện bảo quản" />
        ),
        cell: ({ row }) => <div>{row.getValue('storageCondition')}</div>,
    },
    {
        accessorKey: 'disease',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Bệnh" />,
        cell: ({ row }) => <div>{row.getValue('disease')}</div>,
    },
    {
        accessorKey: 'productionDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày sản xuất" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('productionDate'));
            return <div>{dayjs(date).format('DD/MM/YYYY')}</div>;
        },
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
        accessorKey: 'specQuantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng" />,
        cell: ({ row }) => <div>{row.getValue('specQuantity')}</div>,
    },
    {
        accessorKey: 'unitSpecification',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Quy cách tính" />,
        cell: ({ row }) => <div>{row.getValue('unitSpecification')}</div>,
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
