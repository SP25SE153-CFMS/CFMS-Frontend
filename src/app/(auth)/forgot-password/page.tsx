'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, CheckCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import config from '@/configs';
import { forgotPassword } from '@/services/auth.service';
import toast from 'react-hot-toast';
import { deleteCookie } from 'cookies-next';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return 'Email không được để trống';
        }
        if (!emailRegex.test(email)) {
            return 'Email không hợp lệ';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Remove data from cookies
        deleteCookie(config.cookies.accessToken);
        deleteCookie(config.cookies.refreshToken);
        deleteCookie(config.cookies.farmId);

        const emailValidationError = validateEmail(email);
        if (emailValidationError) {
            setEmailError(emailValidationError);
            return;
        }

        setEmailError(null);
        setIsLoading(true);

        try {
            const response = await forgotPassword(email);
            sessionStorage.setItem('email', email);
            toast.success(response.message);

            setShowSuccessDialog(true);
            setTimeout(() => {
                setShowSuccessDialog(false);
                router.push(config.routes.inputOTP);
            }, 1000);
        } catch (err: any) {
            console.error(err);
            toast(err?.response?.data?.message, { icon: '⚠️' });
            setErrorMessage(
                err instanceof Error
                    ? err.message
                    : 'Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu',
            );
            setShowErrorDialog(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-screen flex items-center justify-center min-h-screen py-8">
            <Card className="w-full max-w-xl">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => router.push(config.routes.signIn)}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                            <Mail className="h-4 w-4 text-primary-foreground" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Quên mật khẩu</CardTitle>
                    <CardDescription className="text-center">
                        Vui lòng nhập địa chỉ email của bạn để nhận mã OTP.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Nhập địa chỉ email"
                                    className={`pl-10 ${emailError ? 'border-red-500' : ''}`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                'Gửi'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-center text-muted-foreground">
                        Nhớ mật khẩu của bạn?{' '}
                        <Link href="/sign-in" className="text-primary hover:underline">
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </CardFooter>
            </Card>

            {/* Error Dialog */}
            <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            Lỗi
                        </AlertDialogTitle>
                        <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
                            Đóng
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Success Dialog */}
            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            Thành công
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Chúng tôi đã gửi mã OTP đến địa chỉ email của bạn. Vui lòng kiểm tra hộp
                            thư để tiếp tục đặt lại mật khẩu.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
