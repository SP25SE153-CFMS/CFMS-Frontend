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
import { useState } from 'react';

interface Props<T> {
    row: Row<T>;
}
export function DataTableRowActions<T>({ row }: Props<T>) {
    const [open, setOpen] = useState(false);
    const [selectReceiptId, setSelectReceiptId] = useState<string | null>(null);
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <DotsHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Chi tiết</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Duyệt</DropdownMenuItem>
                    <DropdownMenuItem>Hủy</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
