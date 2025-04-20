import { useState } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import config from '@/configs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChickenCoop } from '@/utils/schemas/chicken-coop.schema';
import { deleteChickenCoop } from '@/services/chicken-coop.service';
import toast from 'react-hot-toast';
import ChickenCoopForm from '@/components/forms/chicken-coop-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DeleteConfirmDialog from '@/components/delete-confirm-dialog';

interface Props<T> {
    row: Row<T>;
}

export function DataTableRowActions<T>({ row }: Props<T>) {
    const router = useRouter();
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const queryClient = useQueryClient();

    const chickenCoop = row.original as ChickenCoop;

    const mutation = useMutation({
        mutationFn: deleteChickenCoop,
        onSuccess: () => {
            toast.success('Đã xóa chuồng nuôi');
            const breedingAreaId = sessionStorage.getItem('breedingAreaId');
            queryClient.invalidateQueries({ queryKey: ['chickenCoops', breedingAreaId] });
            setOpenDelete(false);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
        },
    });

    const handleDelete = async () => {
        mutation.mutate(chickenCoop.chickenCoopId);
    };

    const handleClickDetail = () => {
        router.push(config.routes.chickenCoop + '/' + chickenCoop.chickenCoopId);
        // const chickenCoops = row.getAllCells().map((cell) => cell.row.original);
        sessionStorage.setItem('currentCoop', JSON.stringify(chickenCoop));
    };

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-6 w-6 p-0">
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Mở menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={handleClickDetail}>Xem chi tiết</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
                        Cập nhật
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-red-600">
                        Xóa <Trash size={16} className="ml-auto" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Update Dialog */}
            <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Cập nhật chuồng nuôi</DialogTitle>
                        <DialogDescription>Hãy nhập các thông tin dưới đây.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[600px]">
                        <ChickenCoopForm
                            closeDialog={() => setOpenUpdate(false)}
                            defaultValues={chickenCoop}
                        />
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                open={openDelete}
                setOpen={setOpenDelete}
                handleDelete={handleDelete}
                confirmValue={chickenCoop.chickenCoopCode}
                label="Mã chuồng nuôi"
                isPending={mutation.isPending}
            />
        </>
    );
}
