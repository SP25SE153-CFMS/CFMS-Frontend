'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { Loader2 } from 'lucide-react';
import config from '@/configs';
import { useQueryParams } from '@/hooks';
import toast from 'react-hot-toast';

export default function CheckLoginPage() {
    const router = useRouter();
    const { token, refreshToken } = useQueryParams();

    useEffect(() => {
        if (token && refreshToken) {
            // Set cookies
            setCookie(config.cookies.accessToken, token, {
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            });

            setCookie(config.cookies.refreshToken, refreshToken, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
            });

            // Redirect to farm page after a short delay
            setTimeout(() => {
                router.push(config.routes.farm);
            }, 1000);
        } else {
            toast('Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại sau!', { icon: '⚠️' });
            // If no tokens are present, redirect to login page
            router.push(config.routes.signIn);
        }
    }, [router, token, refreshToken]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center gap-4 p-8 rounded-lg bg-white dark:bg-slate-900 shadow-lg">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <h1 className="text-2xl font-bold text-foreground">Đang đăng nhập...</h1>
                <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
            </div>
        </div>
    );
}
