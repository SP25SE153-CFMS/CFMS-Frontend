'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useForm } from 'react-hook-form';

export default function Page() {
    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: any) => {
        console.log('Data: ', data);
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-[70px] py-[62px]">
            <div className="flex w-[1300px] h-[900px] justify-center items-center gap-[40px] shrink-0 overflow-hidden">
                <div className="flex flex-col w-1/2 h-auto relative items-start self-stretch columns-xl px-[59px] py-[61px] rounded-[42px] bg-primary-bg">
                    <h2 className="font-[Inter] text-center text-[60px] text-primary-text not-italic font-bold leading-[normal]">
                        Chicken Farm Management System
                    </h2>
                    <div className="w-[483px] mt-12">
                        <p className="font-[Inter] text-[24px] mb-[56px] text-primary-text font-normal leading-normal">
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

                <div className="flex flex-wrap w-1/2 h-auto py-[12px] px-[53px] gap-y-[34px] gap-x-[43px] justify-center items-center content-center self-stretch">
                    <p className="text-[32px] text-center font-bold not-italic leading-[normal]">
                        <span className="text-primary">Chicken Farm</span> Management System
                    </p>
                    <p className="text-center text-[48px] not-italic font-bold leading-[norrmal]">
                        Mừng quay lại !
                    </p>
                    <p className="text-center text-[24px] font-bold not-italic text-primary-sub-text leading-[normal]">
                        Hãy đăng nhập vào tài khoản của bạn
                    </p>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col items-center gap-5 w-full"
                        >
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
                                                className="w-[531px] h-[80px] bg-secondary-bg rounded-[16px]"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

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
                                                className="w-[531px] h-[80px] bg-secondary-bg rounded-[16px]"
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
                                className="w-[531px] h-[80px] text-xl font-bold rounded-lg bg-primary hover:bg-primary-dark transition duration-300"
                            >
                                Đăng nhập
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
