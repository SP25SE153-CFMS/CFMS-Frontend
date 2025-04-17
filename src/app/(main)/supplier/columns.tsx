import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supplierStatusLabels, supplierStatusVariant } from '@/utils/enum/status.enum';
import { Supplier } from '@/utils/schemas/supplier.schema';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Supplier>[] = [
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
        accessorKey: 'supplierId',
        header: () => null,
        cell: () => null,
    },
    {
        accessorKey: 'supplierCode',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mã nhà cung cấp" />,
        cell: ({ row }) => <div>{row.getValue('supplierCode')}</div>,
    },
    {
        accessorKey: 'supplierName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên nhà cung cấp" />,
        cell: ({ row }) => <div>{row.getValue('supplierName')}</div>,
    },
    {
        accessorKey: 'address',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Địa chỉ" />,
        cell: ({ row }) => <div>{row.getValue('address')}</div>,
    },
    {
        accessorKey: 'phoneNumber',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số điện thoại" />,
        cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
    },
    {
        accessorKey: 'bankAccount',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số ngân hàng" />,
        cell: ({ row }) => <div>{row.getValue('bankAccount')}</div>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <Badge
                    variant={supplierStatusVariant[status]}
                    className="px-2 py-1 text-xs min-w-fit overflow-hidden text-ellipsis whitespace-nowrap"
                >
                    {supplierStatusLabels[status]}
                </Badge>
            );
        },
    },
    {
        id: 'action',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
