'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import config from '@/configs';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';
import { signIn } from '@/services/auth.service';
import toast from 'react-hot-toast';

export default function Page() {
    const router = useRouter();

    // TODO: Remove hard-coded
    const form = useForm({
        defaultValues: {
            mail: 'duongtruong@gmail.com',
            password: '1',
        },
    });

    const mutation = useMutation({
        mutationFn: signIn,
        onSuccess: (response) => {
            toast.success(response.message);
            const oldAccessToken = getCookie(config.cookies.accessToken);
            if (oldAccessToken) {
                deleteCookie(config.cookies.accessToken);
            }
            setCookie(config.cookies.accessToken, response.data.accessToken);
            router.push(config.routes.farm);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message);
        },
    });

    const onSubmit = async (data: { mail: string; password: string }) => {
        mutation.mutate(data);
    };

    return (
        <div className="flex size-min items-center justify-center px-[70px] py-[30px]">
            <div className="flex size-min justify-center items-center gap-x-[40px] shrink-0 overflow-hidden">
                <div className="flex flex-col w-1/2 relative items-start self-stretch columns-xl content-center px-[59px] pt-[61px] rounded-[42px] bg-primary">
                    <h2 className="text-center text-[60px] text-white not-italic font-bold leading-[normal]">
                        Hệ Thống Quản Lý Trang Trại Gà Với CFMS
                    </h2>
                    <div className="w-[483px] mt-12">
                        <p className="text-[24px] mb-[56px] text-white font-normal leading-normal">
                            Quản lý trang trại gà của bạn một cách dễ dàng, hiệu quả và nhanh chóng
                        </p>
                        <Image
                            className="absolute left-[150px] bottom-[72px]"
                            alt="Logo"
                            src="/assets/logo/logo.png"
                            width={329}
                            height={329}
                        />
                    </div>
                </div>

                <div className="flex flex-col w-1/2 py-[12px] px-[53px] gap-y-[34px] gap-x-[43px] justify-center items-center content-center self-stretch">
                    <p className="text-[32px] text-center font-bold not-italic leading-[normal] whitespace-nowrap">
                        Hệ Thống Quản Lý <span className="text-primary">Trang Trại Gà</span>
                    </p>
                    <p className="text-center text-[48px] not-italic font-bold leading-[normal]">
                        Mừng quay lại !
                    </p>
                    <p className="text-center text-[24px] font-bold not-italic text-primary-sub-text leading-[normal]">
                        Hãy đăng nhập vào tài khoản của bạn
                    </p>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col items-center gap-y-[34px] w-full"
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
                                                className="w-[531px] h-[80px] bg-slate-100 rounded-[16px] md:text-2xl px-[24px]"
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
                                                className="w-[531px] h-[80px] bg-slate-100 rounded-[16px] md:text-2xl px-[24px]"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-[531px] h-[80px] text-white text-[24px] font-semibold rounded-[16px] bg-primary hover:bg-primary-dark not-italic leading-[normal]"
                            >
                                Đăng nhập
                            </Button>
                        </form>
                    </Form>
                    <div className="w-full flex justify-end">
                        <Button
                            variant="link"
                            className="text-primary-sub-text text-[24px] not-italic font-medium leading-[normal]"
                            onClick={() => router.push(config.routes.forgotPassword)}
                        >
                            Quên mật khẩu?
                        </Button>
                    </div>

                    <div className="flex items-center gap-7 w-full">
                        <span className="flex-1 w-[125px] h-[2px] bg-primary-sub-text" />
                        <p className="text-primary-sub-text text-center text-[24px] not-italic font-medium">
                            Hoặc đăng nhập với
                        </p>
                        <span className="flex-1 w-[125px] h-[2px] bg-primary-sub-text" />
                    </div>
                    <div className="flex gap-[43px]">
                        <Button className="w-[244px] h-[80px] bg-transparent border-2 rounded-[16px] border-primary-sub-text text-[24px] not-italic font-medium leading-[normal] gap-[31px] text-black">
                            <Image
                                alt="Google"
                                src="/assets/logo/google.png"
                                width={34}
                                height={34}
                            />
                            Google
                        </Button>
                        <Button className="w-[244px] h-[80px] bg-transparent border-2 rounded-[16px] border-primary-sub-text text-[24px] not-italic font-medium leading-[normal] gap-[31px] text-black">
                            <Image
                                alt="Facebook"
                                src="/assets/logo/fb.png"
                                width={34}
                                height={34}
                            />
                            Facebook
                        </Button>
                    </div>
                    <p className="text-center text-primary-sub-text text-[24px] not-italic font-bold leading-[normal]">
                        Không có tài khoản? &nbsp;
                        <Link
                            href={config.routes.signUp}
                            className="text-[24px] text-primary font-bold leading-[normal]"
                        >
                            Đăng ký
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
