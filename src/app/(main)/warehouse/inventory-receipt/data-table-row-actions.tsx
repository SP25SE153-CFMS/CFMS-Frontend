import { Button } from '@/components/ui/button';
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
import { inventoryReceiptDetails, inventoryReceipts } from '@/utils/data/table.data';
import { useRouter } from 'next/navigation';
import config from '@/configs';
import { useQuery } from '@tanstack/react-query';
import { getReceipts } from '@/services/request.service';

interface Props<T> {
    row: Row<T>;
}
export function DataTableRowActions<T>({ row }: Props<T>) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const { data: receipts, isLoading } = useQuery({
        queryKey: ['receipts'],
        queryFn: () => getReceipts(),
    });

    const inventoryReceiptDetail = row.original as InventoryReceiptDetail;
    const receipt = inventoryReceiptDetails.find(
        (receipt) => receipt.inventoryReceiptId === inventoryReceiptDetail.inventoryReceiptId,
    );

    console.log("Receipt: ", receipt);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <DotsHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    {/* Chi tiết */}
                    <DropdownMenuItem onClick={() => setOpen(true)}>Chi tiết</DropdownMenuItem>

                    {/* <DropdownMenuItem>Duyệt</DropdownMenuItem>
                    <DropdownMenuItem>Hủy</DropdownMenuItem>
                    <DropdownMenuSeparator /> */}

                    {/* Tạo phiếu đưa qua request */}
                    {/* <DropdownMenuItem
                        disabled={status === 0 || status == 1}
                        onClick={() => router.push(config.routes.createReceipt)}
                    >
                        Tạo phiếu
                    </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Chi tiết phiếu */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chi tiết phiếu</DialogTitle>
                    </DialogHeader>
                    <ScrollArea>
                        <ReceiptDetail receiptId={inventoryReceiptDetail.inventoryReceiptId} />
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}
