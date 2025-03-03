'use client';
import { DataTable } from '@/components/table/data-table';
import { warehouseProduct } from '@/utils/data/table.data';
import { columns } from './columns';

export default function Foods() {
    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight pb-[20px]">Quản lý kho thức ăn</h1>
            <div>
                <DataTable data={warehouseProduct} columns={columns} />
            </div>
        </div>
    );
}
