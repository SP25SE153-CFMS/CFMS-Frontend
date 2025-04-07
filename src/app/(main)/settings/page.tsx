'use client';

import FarmForm from '@/components/forms/farm-form';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import config from '@/configs';
import { getFarmById } from '@/services/farm.service';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { Tractor } from 'lucide-react';

export default function SettingsPage() {
    const farmId = getCookie(config.cookies.farmId) ?? '';

    const { data: farm, isLoading } = useQuery({
        queryKey: ['farm', farmId],
        queryFn: () => getFarmById(farmId),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                    <Tractor className="mr-2" />
                    Cài đặt trang trại
                </CardTitle>
                <CardDescription>Điền thông tin chi tiết về trang trại của bạn</CardDescription>
            </CardHeader>
            <FarmForm defaultValues={farm} />
        </Card>
    );
}
