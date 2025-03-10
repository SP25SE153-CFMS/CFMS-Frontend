'use client';

import { useState } from 'react';
import { DataTable } from '@/components/table/data-table';
import { warehouseProduct } from '@/utils/data/table.data';
import { columns } from './columns';
import Search from '@/components/search';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Foods() {
    const [searchValue, setSearchValue] = useState('');
    const [selectedArea, setSelectedArea] = useState('all');
    const [open, setOpen] = useState(false);

    const openModal = () => setOpen(true);

    const uniqueAreas = Array.from(new Set(warehouseProduct.map((product) => product.area)));

    const filteredData = warehouseProduct.filter((product) => {
        const matchesSearch =
            product.productName.toLowerCase().startsWith(searchValue.toLowerCase()) ||
            product.productCode.toLowerCase().includes(searchValue.toLowerCase()) ||
            product.supplier.toLowerCase().includes(searchValue.toLowerCase());

        const matchesArea = selectedArea === 'all' || product.area === selectedArea; // all lấy hết

        return matchesSearch && matchesArea;
    });

    return (
        <div className="flex flex-col gap-y-5">
            <h1 className="text-2xl font-bold tracking-tight">Quản lý kho thức ăn</h1>

            <div className="flex relative gap-x-4 items-center">
                <p className="font-semibold whitespace-nowrap">Tìm kiếm:</p>
                <Search onSearch={setSearchValue} />

                <p className="font-semibold">Chọn khu:</p>
                <Select onValueChange={setSelectedArea} value={selectedArea}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Tất cả khu vực" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {uniqueAreas.map((area) => (
                            <SelectItem key={area} value={area}>
                                {area}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="absolute right-0">
                    <Button onClick={openModal}>Add product</Button>

                    <Dialog open={open}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo hàng hóa</DialogTitle>
                                <DialogDescription>
                                    Nhập đầy đủ các thông tin dưới.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className='max-h-[600px]'>
                                
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <DataTable data={filteredData} columns={columns} />
        </div>
    );
}
