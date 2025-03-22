import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';
import ReceiptDetail from './inventory-receipt-detail';
import { InventoryReceiptDetail } from '@/utils/schemas/inventory-receipt-detail.schema';
import { inventoryReceipts } from '@/utils/data/table.data';

interface Props<T> {
    row: Row<T>;
}
export function DataTableRowActions<T>({ row }: Props<T>) {
    const [open, setOpen] = useState(false);

    const inventoryReceiptDetail = row.original as InventoryReceiptDetail;
    const receipt = inventoryReceipts.find(
        (receipt) => receipt.inventoryReceiptId === inventoryReceiptDetail.inventoryReceiptId,
    );

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <DotsHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setOpen(true)}>Chi tiết</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Duyệt</DropdownMenuItem>
                    <DropdownMenuItem>Hủy</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Chi tiết phiếu */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chi tiết phiếu {receipt?.subcategoryName}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea>
                        <ReceiptDetail receiptId={inventoryReceiptDetail.inventoryReceiptId} />
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}
