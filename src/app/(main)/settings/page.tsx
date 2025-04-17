'use client';

import FarmForm from '@/components/forms/farm-form';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import config from '@/configs';
import { getFarmById } from '@/services/farm.service';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

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

    return <FarmForm defaultValues={farm} />;
}
