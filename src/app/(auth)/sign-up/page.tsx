'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useForm } from 'react-hook-form';

export default function SignUp() {
    const form = useForm({
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: any) => {
        console.log('Data: ', data);
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-[70px] py-[62px]">
            <div className="flex w-[1300px] h-[900px] justify-center items-center content-center gap-[40px] shrink-0 overflow-hidden">
                <div className="flex flex-col w-1/2 relative items-center self-stretch columns-xl px-[53px] py-[12px] gap-y-[34px] gap-x-[43px]">
                    <p className="text-center text-[32px] not-italic font-bold leading-[normal] whitespace-nowrap">
                        <span className="text-primary">Chicken Farm</span> Management System
                    </p>

                    <p className="text-center text-[48px] not-italic font-bold leading-[normal]">
                        Mừng quay lại !
                    </p>

                    <p className="text-center text-[24px] text-primary-sub-text not-italic font-bold leading-[normal]">
                        Hãy đăng ký vào tài khoản của bạn
                    </p>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col items-center gap-y-[34px] w-full"
                        >
                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Họ và tên"
                                            className="w-[531px] h-[80px] bg-secondary-bg rounded-[16px] md:text-2xl px-[24px]"
                                        />
                                    </FormItem>
                                )}
                            />

                            {/* Phone number */}
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="Số điện thoại"
                                            className="w-[531px] h-[80px] bg-secondary-bg rounded-[16px] md:text-2xl px-[24px]"
                                        />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="Email"
                                                className="w-[531px] h-[80px] bg-secondary-bg rounded-[16px] md:text-2xl px-[24px]"
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
                                                className="w-[531px] h-[80px] bg-secondary-bg rounded-[16px] md:text-2xl px-[24px]"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <p className="w-[531px] text-primary-sub-text text-right text-[24px] not-italic font-medium leading-[normal]">
                                Quên mật khẩu?
                            </p>

                            <Button
                                type="submit"
                                className="w-[531px] h-[80px] text-primary-text text-[24px] font-semibold rounded-[16px] bg-primary hover:bg-primary-dark not-italic leading-[normal]"
                            >
                                Đăng ký
                            </Button>
                        </form>
                    </Form>

                    <p className="text-center text-[24px] text-primary-sub-text not-italic font-bold leading-[normal]">
                        Đã có tài khoản? &nbsp;
                        <span className="text-[24px] text-secondary-sub-text not-italic font-bold leading-[normal]">
                            Đăng nhập
                        </span>
                    </p>
                </div>
                <div className="flex flex-col w-1/2 relative items-start self-stretch columns-xl px-[59px] py-[61px] rounded-[42px] bg-primary-bg">
                    <h2 className="font-[Inter] text-center text-[60px] text-primary-text not-italic font-bold leading-[normal]">
                        Chicken Farm Management System
                    </h2>
                    <div className="w-[483px] mt-12">
                        <p className="text-[24px] mb-[56px] text-primary-text font-normal leading-normal">
                            Pass đồ và thuê đồ một cách dễ dàng và tiện lợi hơn với EcoClothé
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
            </div>
        </div>
    );
}
