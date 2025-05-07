'use client';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteStockReceipt } from '@/services/stock-receipt.service';
import { StockReceiptResponse } from '@/utils/types/custom.type';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props<T> {
    row: Row<T>;
}

export function DataTableRowActions<T>({ row }: Props<T>) {
    const [openDelete, setOpenDelete] = useState(false);

    const queryClient = useQueryClient();

    const handleDelete = async () => {
        const id = (row.original as StockReceiptResponse).stockReceiptId;
        await deleteStockReceipt(id);
        toast.success('Đã xóa');

        queryClient.invalidateQueries({ queryKey: ['stock-receipts'] });

        setOpenDelete(false);
    };

    // const handleClickResource = () => {
    //     router.push(config.routes.stockReceipt + '/' + (row.original as StockReceipt).receiptId);
    // };

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
                    {/* <DropdownMenuItem onClick={handleClickResource}>Chi tiết</DropdownMenuItem>
                    <DropdownMenuSeparator /> */}

                    {/* Xóa */}
                    <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-red-600">
                        Xóa <Trash size={16} />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Xóa */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn muốn xóa phiếu nhập kho này?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setOpenDelete(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Xóa
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
