'use client';

import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import config from '@/configs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import useQueryParams from '@/hooks/use-query-params';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from '@/components/fallback-image';
import { getFarmById } from '@/services/farm.service';
import Link from 'next/link';

export default function Dashboard() {
    const { farmCode } = useQueryParams();

    const {
        data: farmData,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['farmData', farmCode],
        queryFn: () => getFarmById(getCookie(config.cookies.farmId) as string),
    });

    useEffect(() => {
        if (farmCode) {
            refetch();
        }
    }, [farmCode, refetch]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[75vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!farmData) {
        return <h1>Không tìm thấy dữ liệu</h1>;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <section className="container mx-auto px-4 py-12 md:py-24">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-6">
                        <div className="inline-block bg-primary/10 px-4 py-1 rounded-full font-medium text-sm">
                            Hệ thống quản lý trang trại gà
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold">
                            Chào mừng đến với{' '}
                            <span className="text-primary">{farmData.farmName}</span>
                        </h2>
                        <p className="text-lg">
                            Giải pháp toàn diện giúp bạn quản lý trang trại gà hiệu quả, tăng năng
                            suất và tối ưu hóa lợi nhuận.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href={config.routes.breadingArea}>
                                <Button className="bg-primary hover:opacity-90 text-white px-8 py-6 text-lg">
                                    Bắt đầu ngay
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href={config.routes.settings}>
                                <Button
                                    variant="outline"
                                    className="border-primary/30 hover:bg-primary/10 px-8 py-6 text-lg"
                                >
                                    Cài đặt trang trại
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1">
                        <Image
                            width={400}
                            height={400}
                            src={farmData.imageUrl || 'no-data.jpg'}
                            alt={farmData.farmName}
                            className="rounded-lg shadow-lg object-cover h-[400px] w-full"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
