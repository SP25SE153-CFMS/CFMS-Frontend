'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import config from '@/configs';
import Image from '@/components/fallback-image';
import Link from 'next/link';
import { type FieldErrors, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { type SignUpRequest, SignUpRequestSchema } from '@/utils/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { signUp } from '@/services/auth.service';
import { setCookie, deleteCookie } from 'cookies-next';
import { Loader2, User, Phone, Mail, KeyRound, KeySquare } from 'lucide-react';

export default function SignUp() {
    const router = useRouter();
    const form = useForm<SignUpRequest>({
        resolver: zodResolver(SignUpRequestSchema),
        defaultValues: {
            fullname: '',
            phoneNumber: '',
            mail: '',
            password: '',
            confirmPassword: '',
        },
    });

    const mutation = useMutation({
        mutationFn: signUp,
        onSuccess: (response) => {
            // Show success message
            toast.success(response.message);
            // Set new access token, refresh token
            setCookie(config.cookies.accessToken, response.data.accessToken);
            setCookie(config.cookies.refreshToken, response.data.refreshToken);
            // Redirect to farm page
            router.push(config.routes.farm);
        },
        onError: (error: any) => {
            toast(error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại', {
                icon: '⚠️',
            });
        },
    });
    const onSubmit = (data: SignUpRequest) => {
        if (data.password !== data.confirmPassword) {
            toast('Mật khẩu không khớp', { icon: '⚠️' });
            return;
        }
        // Remove old access token, refresh token
        deleteCookie(config.cookies.accessToken);
        deleteCookie(config.cookies.refreshToken);
        // Call signUp API
        mutation.mutate(data);
    };

    const onError = (errors: FieldErrors<SignUpRequest>) => {
        console.log('Errors: ', errors);
        toast(
            errors.fullname?.message ||
                errors.phoneNumber?.message ||
                errors.mail?.message ||
                errors.password?.message ||
                'Có lỗi xảy ra, vui lòng thử lại',
            { icon: '⚠️' },
        );
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-[56px] py-[25px] bg-background transition-colors duration-300">
            <div className="flex w-[1040px] h-[720px] justify-center items-center content-center gap-[32px] shrink-0 overflow-hidden">
                {/* Left Panel */}
                <div className="flex flex-col w-full lg:w-1/2 relative items-center self-stretch columns-xl px-[42px] py-[10px] gap-y-[27px] gap-x-[34px] bg-background">
                    <p className="text-center text-[26px] not-italic font-bold leading-[normal] whitespace-nowrap text-foreground">
                        Hệ Thống Quản Lý <span className="text-primary">Trang Trại Gà</span>
                    </p>

                    <p className="text-center text-[38px] not-italic font-bold leading-[normal] text-foreground">
                        Mừng quay lại !
                    </p>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit, onError)}
                            className="flex flex-col items-center gap-y-[27px] w-full"
                        >
                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="fullname"
                                render={({ field }) => (
                                    <FormItem className="w-full relative">
                                        <div className="relative group">
                                            <User className="absolute left-[19px] top-1/2 transform -translate-y-1/2 text-primary-sub-text dark:text-primary-sub-text/90 h-5 w-5 group-hover:text-primary transition-colors duration-200" />
                                            <Input
                                                {...field}
                                                type="text"
                                                placeholder="Họ và tên"
                                                className="w-[425px] h-[64px] bg-slate-100 dark:bg-slate-800 rounded-[13px] md:text-xl pl-[50px] pr-[19px]"
                                            />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {/* Phone number */}
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem className="w-full relative">
                                        <div className="relative group">
                                            <Phone className="absolute left-[19px] top-1/2 transform -translate-y-1/2 text-primary-sub-text dark:text-primary-sub-text/90 h-5 w-5 group-hover:text-primary transition-colors duration-200" />
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="Số điện thoại"
                                                className="w-[425px] h-[64px] bg-slate-100 dark:bg-slate-800 rounded-[13px] md:text-xl pl-[50px] pr-[19px]"
                                            />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="mail"
                                render={({ field }) => (
                                    <FormItem className="w-full relative">
                                        <FormControl>
                                            <div className="relative group">
                                                <Mail className="absolute left-[19px] top-1/2 transform -translate-y-1/2 text-primary-sub-text dark:text-primary-sub-text/90 h-5 w-5 group-hover:text-primary transition-colors duration-200" />
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="Email"
                                                    className="w-[425px] h-[64px] bg-slate-100 dark:bg-slate-800 rounded-[13px] md:text-xl pl-[50px] pr-[19px]"
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="w-full relative">
                                        <FormControl>
                                            <div className="relative group">
                                                <KeyRound className="absolute left-[19px] top-1/2 transform -translate-y-1/2 text-primary-sub-text dark:text-primary-sub-text/90 h-5 w-5 group-hover:text-primary transition-colors duration-200" />
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="Mật khẩu"
                                                    className="w-[425px] h-[64px] bg-slate-100 dark:bg-slate-800 rounded-[13px] md:text-xl pl-[50px] pr-[19px]"
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Confirm Password */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="w-full relative">
                                        <FormControl>
                                            <div className="relative group">
                                                <KeySquare className="absolute left-[19px] top-1/2 transform -translate-y-1/2 text-primary-sub-text dark:text-primary-sub-text/90 h-5 w-5 group-hover:text-primary transition-colors duration-200" />
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="Nhập lại mật khẩu"
                                                    className="w-[425px] h-[64px] bg-slate-100 dark:bg-slate-800 rounded-[13px] md:text-xl pl-[50px] pr-[19px]"
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-[425px] h-[64px] text-white text-[19px] font-semibold rounded-[13px] bg-primary hover:bg-primary-dark dark:bg-primary/90 dark:hover:bg-primary not-italic leading-[normal]"
                            >
                                {mutation.isPending && (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                )}
                                Đăng ký
                            </Button>
                        </form>
                    </Form>

                    <p className="text-center text-[19px] text-primary-sub-text dark:text-primary-sub-text/90 not-italic font-bold leading-[normal]">
                        Đã có tài khoản? &nbsp;
                        <Link
                            href={config.routes.signIn}
                            className="text-[19px] text-primary not-italic font-bold leading-[normal]"
                        >
                            Đăng nhập
                        </Link>
                    </p>
                </div>
                {/* Right Panel */}
                <div className="hidden lg:flex flex-col w-1/2 relative items-start self-stretch columns-xl px-[47px] py-[49px] rounded-[34px] bg-primary dark:bg-primary/90">
                    <h2 className="text-center text-[48px] text-white not-italic font-bold leading-[normal]">
                        Hệ Thống Quản Lý Trang Trại Gà Với CFMS
                    </h2>
                    <div className="w-[386px] mt-10">
                        <p className="text-[19px] mb-[45px] text-white font-normal leading-normal">
                            Quản lý trang trại gà của bạn một cách dễ dàng, hiệu quả và nhanh chóng
                        </p>
                        <Image
                            className="absolute left-[120px] bottom-[58px]"
                            alt="Logo"
                            src="/assets/logo/logo.png"
                            width={263}
                            height={263}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
