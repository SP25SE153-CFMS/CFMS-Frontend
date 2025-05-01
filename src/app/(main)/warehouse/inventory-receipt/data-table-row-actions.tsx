import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { InventoryReceiptDetail } from '@/utils/schemas/inventory-receipt-detail.schema';
import { useRouter } from 'next/navigation';
import config from '@/configs';


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
