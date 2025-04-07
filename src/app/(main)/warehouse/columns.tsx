import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { wareStatusLabels, wareStatusVariant } from '@/utils/enum/status.enum';
import { Warehouse } from '@/utils/schemas/warehouse.schema';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Warehouse>[] = [
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
        accessorKey: 'wareId',
        header: () => null,
        cell: () => null,
    },
    {
        accessorKey: 'warehouseName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên kho" />,
        cell: ({ row }) => (
            <div 
                className="cursor-pointer " 
                onClick={() => {
                    console.log({
                        wareId: row.original.wareId,
                        resourceTypeId: row.original.resourceTypeId
                    });
                }}
            >
                {row.getValue('warehouseName')}
            </div>
        ),
    },
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Miêu tả" />,
        cell: ({ row }) => <div>{row.getValue('description')}</div>,
    },
    {
        accessorKey: 'maxQuantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng tối đa" />,
        cell: ({ row }) => <div>{row.getValue('maxQuantity')}</div>,
    },
    {
        accessorKey: 'currentQuantity',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số lượng tồn kho" />,
        cell: ({ row }) => <div>{row.getValue('currentQuantity')}</div>,
    },
    {
        accessorKey: 'maxWeight',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Khối lượng tối đa" />,
        cell: ({ row }) => <div>{row.getValue('maxWeight')}</div>,
    },
    {
        accessorKey: 'currentWeight',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Khối lượng tồn kho" />
        ),
        cell: ({ row }) => <div>{row.getValue('currentWeight')}</div>,
    },
    {
         accessorKey: 'status',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
                cell: ({ row }) => {
                    const status = row.getValue('status') as string;
                    return (
                        <Badge
                            variant={wareStatusVariant[status]}
                            className="px-2 py-1 text-xs min-w-fit overflow-hidden text-ellipsis whitespace-nowrap"
                        >
                            {wareStatusLabels[status]}
                        </Badge>
                    );
                },
    }
];
