import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import toast from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import config from '@/configs';
import { breedingAreaSchema } from '@/utils/schemas/breeding-area.schema';

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
    const breadingArea = breedingAreaSchema.parse(row.original);

    const router = useRouter();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                    <DotsHorizontalIcon className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem
                    onClick={() => {
                        router.push(config.routes.chickenCoop);
                    }}
                >
                    Xem khu nuôi
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        toast.success(`Đã chọn ${breadingArea.breedingAreaName}`);
                    }}
                >
                    Cập nhật
                </DropdownMenuItem>
                <DropdownMenuItem disabled>Yêu thích</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        toast.success(`Đã xóa ${breadingArea.breedingAreaName} khỏi danh sách`);
                    }}
                >
                    Xóa
                    <DropdownMenuShortcut>
                        <Trash size={16} />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
