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
import BreedingAreaForm from '@/components/forms/breeding-area-form';
import { BreedingArea } from '@/utils/schemas/breeding-area.schema';
import { deleteBreedingArea } from '@/services/breeding-area.service';
import toast from 'react-hot-toast';
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

    const breedingArea = row.original as BreedingArea;

    const mutation = useMutation({
        mutationFn: deleteBreedingArea,
        onSuccess: () => {
            toast.success('Đã xóa khu nuôi');
            queryClient.invalidateQueries({ queryKey: ['breedingAreas'] });
            setOpenDelete(false);
        },
        onError: (error: any) => {
            console.error(error);
            toast(error?.response?.data?.message, { icon: '⚠️' });
        },
    });

    const handleDelete = async () => {
        mutation.mutate(breedingArea.breedingAreaId);
    };

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-6 w-6 p-0">
                        <DotsHorizontalIcon className="h-2 w-2" />
                        <span className="sr-only">Mở menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                        onClick={() => {
                            router.push(
                                // `${config.routes.chickenCoop}?breedingAreaId=${row.getValue('breedingAreaId')}`,
                                config.routes.chickenCoop,
                            );
                            sessionStorage.setItem(
                                'breedingAreaId',
                                row.getValue('breedingAreaId'),
                            );
                        }}
                    >
                        Xem chi tiết
                    </DropdownMenuItem>
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
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Cập nhật khu nuôi</DialogTitle>
                        <DialogDescription>Hãy nhập các thông tin dưới đây.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[600px]">
                        <BreedingAreaForm
                            closeDialog={() => setOpenUpdate(false)}
                            defaultValues={row.original as BreedingArea}
                        />
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                open={openDelete}
                setOpen={setOpenDelete}
                handleDelete={handleDelete}
                confirmValue={breedingArea.breedingAreaCode}
                label="Mã khu nuôi"
                isPending={mutation.isPending}
            />
        </>
    );
}
