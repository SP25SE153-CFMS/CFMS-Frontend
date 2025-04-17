'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import config from '@/configs';
import Image from 'next/image';
import Link from 'next/link';
import { FieldErrors, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { setCookie, deleteCookie } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';
import { signIn, signInGoogle } from '@/services/auth.service';
import toast from 'react-hot-toast';
import { IoLogoGoogle } from 'react-icons/io5';
import { Loader2 } from 'lucide-react';
import { SignInRequest, SignInRequestSchema } from '@/utils/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Page() {
    const router = useRouter();

    // TODO: Remove hard-coded
    const form = useForm<SignInRequest>({
        resolver: zodResolver(SignInRequestSchema),
        defaultValues: {
            mail: 'duongtruong@gmail.com',
            password: '1',
        },
    });

    const mutation = useMutation({
        mutationFn: signIn,
        onSuccess: (response) => {
            // Show success message
            toast.success(response.message);
            // Remove old access token, refresh token
            deleteCookie(config.cookies.accessToken);
            deleteCookie(config.cookies.refreshToken);
            // Set new access token, refresh token
            setCookie(config.cookies.accessToken, response.data.accessToken);
            setCookie(config.cookies.refreshToken, response.data.refreshToken);
            // Redirect to farm page
            router.push(config.routes.farm);
        },
        onError: (err: any) => {
            // Show error message
            toast.error(err?.response?.data?.message);
        },
    });

    const onSubmit = async (data: SignInRequest) => {
        mutation.mutate(data);
    };

    const onError = (errors: FieldErrors<SignInRequest>) => {
        toast.error(
            errors.mail?.message || errors.password?.message || 'Có lỗi xảy ra, vui lòng thử lại',
        );
    };

    return (
        <div className="flex items-center justify-center px-[56px] py-[24px] min-h-screen bg-background transition-colors duration-300">
            <div className="flex size-min justify-center items-center gap-x-[32px] shrink-0 overflow-hidden">
                <div className="flex flex-col w-1/2 relative items-start self-stretch columns-xl content-center px-[47px] pt-[49px] rounded-[34px] bg-primary dark:bg-primary/90">
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

                <div className="flex flex-col w-1/2 py-[10px] px-[42px] gap-y-[27px] gap-x-[34px] justify-center items-center content-center self-stretch bg-background dark:bg-background">
                    <p className="text-[26px] text-center font-bold not-italic leading-[normal] whitespace-nowrap text-foreground">
                        Hệ Thống Quản Lý <span className="text-primary">Trang Trại Gà</span>
                    </p>
                    <p className="text-center text-[38px] not-italic font-bold leading-[normal] text-foreground">
                        Mừng quay lại !
                    </p>
                    <p className="text-center text-[19px] font-bold not-italic text-primary-sub-text dark:text-primary-sub-text/90 leading-[normal]">
                        Hãy đăng nhập vào tài khoản của bạn
                    </p>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit, onError)}
                            className="flex flex-col items-center gap-y-[27px] w-full"
                        >
                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="mail"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="Email"
                                                className="w-[425px] h-[64px] bg-slate-100 dark:bg-slate-800 rounded-[13px] md:text-xl px-[19px]"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="Mật khẩu"
                                                className="w-[425px] h-[64px] bg-slate-100 dark:bg-slate-800 rounded-[13px] md:text-xl px-[19px]"
                                            />
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
                                Đăng nhập
                            </Button>
                        </form>
                    </Form>
                    <div className="w-full flex justify-end">
                        <Button
                            variant="link"
                            className="text-primary-sub-text dark:text-primary-sub-text/90 text-[19px] not-italic font-medium leading-[normal]"
                            onClick={() => router.push(config.routes.forgotPassword)}
                        >
                            Quên mật khẩu?
                        </Button>
                    </div>

                    <div className="flex items-center gap-6 w-full">
                        <span className="flex-1 w-[100px] h-[2px] bg-primary-sub-text dark:bg-primary-sub-text/70" />
                        <p className="text-primary-sub-text dark:text-primary-sub-text/90 text-center text-[19px] not-italic font-medium">
                            Hoặc đăng nhập với
                        </p>
                        <span className="flex-1 w-[100px] h-[2px] bg-primary-sub-text dark:bg-primary-sub-text/70" />
                    </div>
                    <div className="flex gap-[34px]">
                        <Button
                            onClick={signInGoogle}
                            className="w-[195px] h-[64px] bg-transparent border-2 rounded-[13px] border-primary-sub-text dark:border-primary-sub-text/70 text-[19px] not-italic font-medium leading-[normal] gap-[25px] text-foreground hover:text-white"
                        >
                            <IoLogoGoogle />
                            Google
                        </Button>
                        {/* <Button className="w-[195px] h-[64px] bg-transparent border-2 rounded-[13px] border-primary-sub-text dark:border-primary-sub-text/70 text-[19px] not-italic font-medium leading-[normal] gap-[25px] text-foreground">
                            <Image
                                alt="Facebook"
                                src="/assets/logo/fb.png"
                                width={27}
                                height={27}
                            />
                            Facebook
                        </Button> */}
                    </div>
                    <p className="text-center text-primary-sub-text dark:text-primary-sub-text/90 text-[19px] not-italic font-bold leading-[normal]">
                        Không có tài khoản? &nbsp;
                        <Link
                            href={config.routes.signUp}
                            className="text-[19px] text-primary font-bold leading-[normal]"
                        >
                            Đăng ký
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
