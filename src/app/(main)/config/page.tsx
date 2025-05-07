'use client';

import { DataTable } from '@/components/table/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card } from '@/components/ui/card';
import Image from '@/components/fallback-image';
import { downloadCSV } from '@/utils/functions/download-csv.function';
import { getConfigs } from '@/services/config.service';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function Page() {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: configs, isLoading } = useQuery({
        queryKey: ['configs'],
        queryFn: () => getConfigs(),
    });

    // Filter configs based on the search query
    const filteredConfigs = configs?.filter((config) =>
        config.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Check if configs are loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
            </div>
        );
    }

    // Check if configs data exists
    if (!configs) {
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
                    <h2 className="text-2xl font-bold tracking-tight">
                        Danh sách cấu hình hệ thống
                    </h2>
                    <p className="text-muted-foreground">
                        Danh sách tất cả các cấu hình trong hệ thống
                    </p>
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="Tìm kiếm cấu hình..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64"
                    />
                    <Button
                        variant="outline"
                        className="space-x-1"
                        onClick={() => downloadCSV(configs, 'configs.csv')}
                    >
                        <span>Tải file</span> <Download size={18} />
                    </Button>
                    {/* <Button className="space-x-1" onClick={openModal}>
                        <span>Tạo</span> <Plus size={18} />
                    </Button>
                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo cấu hình mới</DialogTitle>
                                <DialogDescription>
                                    Hãy nhập các thông tin dưới đây.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="max-h-[600px]">
                                <ConfigForm closeDialog={() => setOpen(false)} />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog> */}
                </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <DataTable data={filteredConfigs || []} columns={columns} />
            </div>
        </div>
    );
}
