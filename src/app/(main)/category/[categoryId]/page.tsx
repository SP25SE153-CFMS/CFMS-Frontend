'use client';

import { DataTable } from '@/components/table/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import Image from '@/components/fallback-image';
import { useParams } from 'next/navigation';
import SubCategoryForm from '@/components/forms/sub-category-form';
import { downloadCSV } from '@/utils/functions/download-csv.function';
import { getCategoryById } from '@/services/category.service';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';

export default function Page() {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const openModal = () => setOpen(true);
    const onOpenChange = (val: boolean) => setOpen(val);

    const { categoryId }: { categoryId: string } = useParams();

    const { data: category, isLoading } = useQuery({
        queryKey: ['category', categoryId],
        queryFn: () => getCategoryById(categoryId),
    });

    const filteredSubCategories = category?.subCategories?.filter(
        (subCategory) =>
            subCategory.subCategoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subCategory.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[75vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Card className="px-36 py-8">
                    <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                        <Image src="/no-data.jpg" width={300} height={300} alt="Not Found" />
                        <h1 className="text-2xl font-bold">Danh mục không tồn tại</h1>
                        <Button variant="outline" onClick={() => window.history.back()}>
                            Quay lại
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Danh mục <span className="text-primary">{category.categoryName}</span>
                    </h2>
                    <p className="text-muted-foreground">
                        Danh sách tất cả các danh mục con cho danh mục {category.categoryName}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="Tìm kiếm theo tên, mô tả..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64"
                    />
                    <Button
                        variant="outline"
                        className="space-x-1"
                        onClick={() =>
                            downloadCSV(
                                category.subCategories,
                                `${category.categoryType?.toLowerCase()}.csv`,
                            )
                        }
                    >
                        <span>Tải file</span> <Download size={18} />
                    </Button>
                    <Button className="space-x-1" onClick={openModal}>
                        <span>Tạo</span> <Plus size={18} />
                    </Button>
                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Thêm danh mục {category.categoryType}</DialogTitle>
                                <DialogDescription>
                                    Hãy nhập các thông tin dưới đây.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[600px]">
                                <SubCategoryForm
                                    closeDialog={() => setOpen(false)}
                                    categoryName={category.categoryName}
                                />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <DataTable data={filteredSubCategories || []} columns={columns} />
            </div>
        </div>
    );
}
