'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
            <div className="mb-6 rounded-full bg-orange-50 p-4">
                <AlertTriangle className="h-10 w-10 text-orange-500" aria-hidden="true" />
            </div>

            <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">Không tìm thấy</h2>

            <p className="mb-6 max-w-md text-gray-500">
                Chúng tôi xin lỗi vì sự bất tiện này. Đã xảy ra sự cố không mong muốn.
                {error.digest && (
                    <span className="mt-2 block text-sm text-gray-400">Mã lỗi: {error.digest}</span>
                )}
            </p>

            <Button onClick={() => reset()} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Thử lại
            </Button>
        </div>
    );
}
