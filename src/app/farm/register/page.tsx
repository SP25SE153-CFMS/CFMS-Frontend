'use client';
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Tractor } from 'lucide-react';
import toast from 'react-hot-toast';
import { CreateFarmSchema, type Farm } from '@/utils/schemas/farm.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFarm } from '@/services/farm.service';
import { useRouter } from 'next/navigation';
import config from '@/configs';

export default function Page() {
    const router = useRouter();
    const [farmImage, setFarmImage] = useState<File | null>(null);

    // Initialize form
    const form = useForm<Farm>({
        resolver: zodResolver(CreateFarmSchema),
        defaultValues: {
            farmName: '',
            farmCode: '',
            address: '',
            area: 0,
            scale: '',
            phoneNumber: '',
            website: '',
            farmImage: '',
        },
    });

    // Form submit handler
    const onSubmit = async (values: Farm) => {
        if (farmImage) {
            // Handle file upload logic here if needed
            // values.farmImage = ... (URL or path after upload)
        }
        await createFarm(values)
            .then(() => {
                toast.success('Tạo trang trại thành công');
                router.push(config.routes.farm);
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message);
            });
    };

    // Form error handler
    const onError = (error: any) => {
        console.error(error);
        toast.error('Đã xảy ra lỗi');
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center">
            <Card className="min-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                        <Tractor className="mr-2" />
                        Đăng ký Trang trại Mới
                    </CardTitle>
                    <CardDescription>Điền thông tin chi tiết về trang trại của bạn</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="farmName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên trang trại</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nhập tên trang trại"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="farmCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mã trang trại</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nhập mã trang trại"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Loại hình</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn loại hình trang trại" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="organic">Hữu cơ</SelectItem>
                                                <SelectItem value="traditional">
                                                    Truyền thống
                                                </SelectItem>
                                                <SelectItem value="mixed">Kết hợp</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Địa chỉ</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Nhập địa chỉ trang trại"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="area"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Diện tích (ha)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Nhập diện tích"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(Number(e.target.value))
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="scale"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quy mô</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn quy mô" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="small">Nhỏ</SelectItem>
                                                    <SelectItem value="medium">Vừa</SelectItem>
                                                    <SelectItem value="large">Lớn</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Số điện thoại</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder="Nhập số điện thoại"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Website</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="url"
                                                    placeholder="https://example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="farmImage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hình ảnh trang trại</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    setFarmImage(file);
                                                    // You might want to store the file path or handle it differently
                                                    // field.onChange(file ? file.name : '');
                                                    field.onChange(
                                                        file ? URL.createObjectURL(file) : '',
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full">
                                Đăng ký trang trại
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
