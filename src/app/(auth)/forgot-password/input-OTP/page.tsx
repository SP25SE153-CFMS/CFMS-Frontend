'use client';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle, KeyRound, Loader2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import config from '@/configs';
import { useQueryParams } from '@/hooks';
import { forgotPassword, resetPassword } from '@/services/auth.service';
import toast from 'react-hot-toast';

const FormSchema = z.object({
    otp: z.string().min(6, { message: 'Mã OTP phải có 6 số' }),
});

export default function InputOTPForm() {
    const router = useRouter();
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const { otp, email } = useQueryParams();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            otp: '',
        },
    });

    // Timer for OTP expiration
    useEffect(() => {
        if (timeLeft <= 0) {
            setIsResendDisabled(false);
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    useEffect(() => {
        if (otp) {
            form.setValue('otp', otp);
            form.handleSubmit(onSubmit)();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp, form, router, email]);

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Resend OTP function
    const handleResendOTP = async () => {
        try {
            const email = sessionStorage.getItem('email') || '';
            const response = await forgotPassword(email);
            setTimeLeft(60);
            setIsResendDisabled(true);
            toast.success(response.message || 'Yêu cầu gửi lại mã OTP thành công');
        } catch (error: any) {
            console.error('Error resending OTP:', error);
            toast(
                error?.response?.data?.message ||
                    'Có lỗi xảy ra khi gửi lại mã OTP, vui lòng thử lại',
                { icon: '⚠️' },
            );
        }
    };

    // Hàm submit
    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        setIsLoading(true);
        try {
            const response = await resetPassword({
                email: sessionStorage.getItem('email') || '',
                otp: values.otp,
            });
            sessionStorage.setItem('otp', values.otp);
            sessionStorage.setItem('email', sessionStorage.getItem('email') || '');
            toast.success(response.message || 'Xác thực thành công');

            setShowSuccessDialog(true);

            setTimeout(() => {
                setShowSuccessDialog(false);
                // console.log('Chuyển đến trang đổi mật khẩu');
                router.push(config.routes.resetPassword);
            }, 1000);
        } catch (error: any) {
            console.error(error);
            setErrorMessage(
                error?.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu',
            );
            setShowErrorDialog(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-screen flex flex-col items-center justify-center min-h-screen py-8">
            <Card className="w-full max-w-md mx-auto shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 rounded-full bg-primary/10">
                            <KeyRound className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Xác thực OTP</CardTitle>
                    <CardDescription>
                        Vui lòng nhập mã OTP đã được gửi đến điện thoại của bạn
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormControl>
                                            <div className="flex justify-center w-full">
                                                <InputOTP maxLength={6} {...field}>
                                                    <div className="flex justify-center w-full">
                                                        <InputOTPGroup className="gap-2">
                                                            <InputOTPSlot
                                                                index={0}
                                                                className="h-12 w-12 text-lg"
                                                            />
                                                            <InputOTPSlot
                                                                index={1}
                                                                className="h-12 w-12 text-lg"
                                                            />
                                                            <InputOTPSlot
                                                                index={2}
                                                                className="h-12 w-12 text-lg"
                                                            />
                                                            <InputOTPSlot
                                                                index={3}
                                                                className="h-12 w-12 text-lg"
                                                            />
                                                            <InputOTPSlot
                                                                index={4}
                                                                className="h-12 w-12 text-lg"
                                                            />
                                                            <InputOTPSlot
                                                                index={5}
                                                                className="h-12 w-12 text-lg"
                                                                onKeyDown={() => {
                                                                    console.log('a');

                                                                    form.handleSubmit(onSubmit)();
                                                                }}
                                                            />
                                                        </InputOTPGroup>
                                                    </div>
                                                </InputOTP>
                                            </div>
                                        </FormControl>
                                        <FormDescription className="text-center">
                                            Mã OTP sẽ hết hạn sau {formatTime(timeLeft)}
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                Xác nhận
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-center text-sm text-muted-foreground">
                        Không nhận được mã?
                    </div>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleResendOTP}
                        disabled={isResendDisabled}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {isResendDisabled ? `Gửi lại sau (${timeLeft}s)` : 'Gửi lại mã OTP'}
                    </Button>
                </CardFooter>
            </Card>

            {/* Thành công */}
            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            Xác thực thành công
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Đang chuyển đến trang đổi mật khẩu...
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>

            {/* Lỗi */}
            <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            Lỗi xác thực
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
        </div>
    );
}
