'use client';

import { DataTable } from '@/components/table/data-table';
import { columns } from '../columns';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Image from '@/components/fallback-image';
import { getCategories } from '@/services/category.service';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { downloadCSV } from '@/utils/functions/download-csv.function';
import { CategoryType } from '@/utils/enum/category.enum';

export default function Page() {
    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories(),
    });

    const filterCategories = categories?.filter((category) =>
        category.categoryType.endsWith(CategoryType.UNIT),
    );

    // Check if categories is loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
            </div>
        );
    }

    // Check if categories is not null, undefined
    if (!categories) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Card className="px-36 py-8">
                    <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                        <Image src="/no-data.jpg" width={300} height={300} alt="Not Found" />
                        <h1 className="text-2xl font-bold">Danh sách không tồn tại</h1>
                        <Button variant="outline" onClick={() => window.history.back()}>
                            Quay lại
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Return the page
    return (
        <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Danh sách danh mục đơn vị</h2>
                    <p className="text-muted-foreground">
                        Danh sách tất cả các danh mục đơn vị trong trang trại
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="space-x-1"
                        onClick={() => downloadCSV(categories, 'categories.csv')}
                    >
                        <span>Tải file</span> <Download size={18} />
                    </Button>
                </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <DataTable data={filterCategories ?? []} columns={columns} />
            </div>
        </div>
    );
}
