'use client';
import { DataTable } from '@/components/table/data-table';
import { warehouseProduct } from '@/utils/data/table.data';
import { columns } from './columns';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Search from '@/components/search/search';

export default function Foods() {
    const [searchValue, setSearchValue] = useState('');

    const filteredData = warehouseProduct.filter(
        (product) =>
            product.productName.toLowerCase().startsWith(searchValue.toLowerCase()) ||
            product.productCode.toLowerCase().includes(searchValue.toLowerCase()),
    );
    return (
        <div className="flex flex-col gap-y-[20px]">
            <h1 className="text-2xl font-bold tracking-tight">Quản lý kho thức ăn</h1>
            <div className="flex gap-x-[10px] justify-start items-center">
                <p className="font-semibold whitespace-nowrap">Tìm kiếm: </p>
                <Search onSearch={setSearchValue} />
            </div>
            <div>
                <DataTable data={filteredData} columns={columns} />
            </div>
        </div>
    );
}
