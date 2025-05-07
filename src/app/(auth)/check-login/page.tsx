'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie, setCookie } from 'cookies-next';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import config from '@/configs';
import { useQueryParams } from '@/hooks';
import toast from 'react-hot-toast';
import Image from '@/components/fallback-image';

export default function CheckLoginPage() {
    const router = useRouter();
    const { token, refreshToken } = useQueryParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (token === undefined && refreshToken === undefined) return;

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

            // Animate progress bar
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 100);

            // Set success status and redirect
            setTimeout(() => {
                setStatus('success');
                clearInterval(interval);
                setProgress(100);
            }, 600);

            // Redirect to farm page after a short delay
            setTimeout(() => {
                router.push(config.routes.farm);
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setStatus('error');
            toast('Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại sau!', { icon: '⚠️' });

            deleteCookie(config.cookies.accessToken);
            deleteCookie(config.cookies.refreshToken);
            // If no tokens are present, redirect to login page
            setTimeout(() => {
                router.push(config.routes.signIn);
            }, 2000);
        }
    }, [refreshToken, router, token]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 mb-4 relative">
                        <Image
                            src="/assets/logo/logo.png"
                            alt="CFMS Logo"
                            width={80}
                            height={80}
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-center text-foreground">
                        Hệ Thống Quản Lý <span className="text-primary">Trang Trại Gà</span>
                    </h1>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="h-2 bg-slate-100 dark:bg-slate-700">
                        <div
                            className="h-full bg-primary transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col items-center text-center">
                            {status === 'loading' && (
                                <>
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full border-4 border-primary/30"></div>
                                        </div>
                                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                                    </div>
                                    <h2 className="text-xl font-bold text-foreground mb-2">
                                        Đang đăng nhập...
                                    </h2>
                                    <p className="text-muted-foreground">
                                        Đang xử lý thông tin đăng nhập của bạn
                                    </p>
                                </>
                            )}

                            {status === 'success' && (
                                <>
                                    <div className="mb-6 text-green-500 dark:text-green-400">
                                        <CheckCircle2 className="h-14 w-14 animate-in zoom-in-50 duration-300" />
                                    </div>
                                    <h2 className="text-xl font-bold text-foreground mb-2">
                                        Đăng nhập thành công!
                                    </h2>
                                    <p className="text-muted-foreground">
                                        Đang chuyển hướng đến trang quản lý trang trại...
                                    </p>
                                </>
                            )}

                            {status === 'error' && (
                                <>
                                    <div className="mb-6 text-red-500 dark:text-red-400">
                                        <AlertCircle className="h-14 w-14 animate-in zoom-in-50 duration-300" />
                                    </div>
                                    <h2 className="text-xl font-bold text-foreground mb-2">
                                        Đăng nhập thất bại
                                    </h2>
                                    <p className="text-muted-foreground">
                                        Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại
                                        sau!
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} CFMS - Chicken Farm Management System</p>
                </div>
            </div>
        </div>
    );
}
