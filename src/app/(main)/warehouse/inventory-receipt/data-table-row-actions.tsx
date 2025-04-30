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

    const inventoryReceiptId = (row.original as InventoryReceiptDetail).inventoryReceiptId;

    const handleReceiptDetail = () => {
        router.push(config.routes.inventoryReceipt + '/' + inventoryReceiptId);
    };

    // const { data: receipts } = useQuery({
    //     queryKey: ['receipts'],
    //     queryFn: async () => {
    //         const receipts = await getReceipts();
    //         sessionStorage.setItem('receiptDetail', JSON.stringify(receipts));
    //         return receipts;
    //     },
    // });

    // const receipt = receipts?.find(
    //     (r) => r.inventoryReceiptId === inventoryReceiptDetail.inventoryReceiptId,
    // );

    // console.log("Receipt: ", receipt);

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
                    <DropdownMenuItem onClick={handleReceiptDetail}>Chi tiết</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
