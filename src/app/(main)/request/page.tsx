'use client';

import { DataTable } from '@/components/table/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { getRequests } from '@/services/request.service';
import Link from 'next/link';
import config from '@/configs';
import { downloadCSV } from '@/utils/functions/download-csv.function';

export default function Page() {
    const { data: requests, isLoading } = useQuery({
        queryKey: ['requests'],
        queryFn: () => getRequests(),
    });

    // Check if requests are loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner />;
            </div>
        );
    }

    // Check if requests data exists
    if (!requests) {
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
                        Danh sách các phiếu yêu cầu
                    </h2>
                    <p className="text-muted-foreground">
                        Danh sách tất cả các phiếu yêu cầu trong hệ thống
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="space-x-1"
                        onClick={() => downloadCSV(requests, 'requests.csv')}
                    >
                        <span>Tải file</span> <Download size={18} />
                    </Button>
                    <Link href={config.routes.createRequest}>
                        <Button className="space-x-1">
                            <span>Tạo phiếu yêu cầu</span> <Plus size={18} />
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <DataTable data={requests} columns={columns} />
            </div>
        </div>
    );
}
