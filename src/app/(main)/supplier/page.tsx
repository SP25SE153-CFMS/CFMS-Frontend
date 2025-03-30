'use client';

import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { columns } from './columns';
import { suppliers } from '@/utils/data/table.data';
import { ScrollArea } from '@/components/ui/scroll-area';
import SupplierForm from '@/components/forms/supplier-form';
import { useState } from 'react';

export default function Supplier() {
    const [openDialog, setOpenDialog] = useState(false);

    const open = () => setOpenDialog(true);
    const closeDialog = () => setOpenDialog(false);
    const onOpenChange = (val: boolean) => setOpenDialog(val);

    // const { data: suppliers, isLoading } = useQuery({
    //     queryKey: ['suppliers'],
    //     queryFn: () => getSuppliers(),
    // });

    // if (isLoading) {
    //     return (
    //         <div className="flex items-center justify-center h-full">
    //             <LoadingSpinner />
    //         </div>
    //     );
    // }

    // if (!suppliers) {
    return (
        <div className="flex flex-col gap-y-5">
            <h1 className="text-2xl font-bold tracking-tight">Danh sách nhà cung cấp</h1>

            <div className="flex relative gap-x-4 items-center">
                <div className="absolute right-0 mb-3">
                    <Button onClick={open}>
                        <span>Tạo</span> <Plus size={18} />
                    </Button>

                    <Dialog open={openDialog} onOpenChange={onOpenChange}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="font-semibold">
                                    Thêm nhà cung cấp
                                </DialogTitle>
                                <DialogDescription>Nhập đầy đủ thông tin dưới.</DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[600px]">
                                <SupplierForm closeDialog={closeDialog} />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <DataTable data={suppliers} columns={columns} />
        </div>
    );
}
// }
