import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';

interface Props<T> {
    row: Row<T>;
}

// eslint-disable-next-line no-unused-vars
export function DataTableRowActions<T>({ row }: Props<T>) {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="ghost">
                        <DotsHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Tạo phiếu</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Chi tiết</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Duyệt</DropdownMenuItem>
                    <DropdownMenuItem>Hủy</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
