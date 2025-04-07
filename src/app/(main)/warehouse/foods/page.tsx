'use client';

import { useState } from 'react';
import { DataTable } from '@/components/table/data-table';
import { warehouseProducts } from '@/utils/data/table.data';
import { columns } from './columns';
import Search from '@/components/search';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import WarehouseProductForm from '@/components/forms/warehouse-product-form';


export default function Foods() {
    const [searchValue, setSearchValue] = useState('');
    const [open, setOpen] = useState(false);

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);
    const onOpenChange = (val: boolean) => setOpen(val);

    // const { data: foods, isLoading } = useQuery({
    //     queryKey: ['foods'],
    //     queryFn: () => getFoods(),
    // });

    const filteredFood = warehouseProducts?.filter((food) => {
        return (
            food.productName.toLowerCase().startsWith(searchValue.toLowerCase()) ||
            food.productCode.toLowerCase().includes(searchValue.toLowerCase())
        );
    });

    // if (isLoading) {
    //     return (
    //         <div className="flex items-center justify-center h-full">
    //             <LoadingSpinner />
    //         </div>
    //     );
    // }
    return (
        <div className="flex flex-col gap-y-5">
            <h1 className="text-2xl font-bold tracking-tight">Quản lý kho thức ăn</h1>

            <div className="flex relative gap-x-4 items-center">
                <p className="font-semibold whitespace-nowrap">Tìm kiếm:</p>
                <Search onSearch={setSearchValue} />

                <div className="absolute right-0">
                    <Button onClick={openModal}>
                        <span>Tạo</span> <Plus size={18} />
                    </Button>

                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="font-semibold">Tạo hàng hóa</DialogTitle>
                                <DialogDescription>
                                    Nhập đầy đủ các thông tin dưới.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[600px]">
                                <WarehouseProductForm closeModal={closeModal} />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <DataTable data={filteredFood} columns={columns} />
        </div>
    );
}
