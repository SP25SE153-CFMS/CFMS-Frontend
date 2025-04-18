'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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
    FormDescription,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Tractor,
    MapPin,
    Phone,
    Globe,
    Home,
    Hash,
    SquareAsterisk,
    Ruler,
    ScaleIcon,
    ImageIcon,
    Check,
    ArrowRight,
    Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CreateFarmSchema, type Farm } from '@/utils/schemas/farm.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFarm } from '@/services/farm.service';
import { useRouter } from 'next/navigation';
import config from '@/configs';
import { CloudinaryImageUpload } from '@/components/cloudinary-image-upload';
import { useMutation } from '@tanstack/react-query';
import { mapEnumToValues } from '@/utils/functions/enum.function';
import { Scale, scaleLabels } from '@/utils/enum/status.enum';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from '@/components/fallback-image';

// Dynamically import the map component with no SSR
const LocationMapWithNoSSR = dynamic(() => import('@/components/map/location-map'), {
    ssr: false,
});

export default function Page() {
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('basic');
    const [formStep, setFormStep] = useState(0);

    // Initialize form
    const form = useForm<Farm>({
        resolver: zodResolver(CreateFarmSchema),
        defaultValues: {
            farmName: '',
            farmCode: '',
            address: '',
            area: 0,
            scale: 0,
            phoneNumber: '',
            website: '',
            imageUrl: '',
            longitude: 0,
            latitude: 0,
        },
    });

    const mutation = useMutation({
        mutationFn: createFarm,
        onSuccess: () => {
            toast.success('Tạo trang trại thành công');
            router.push(config.routes.farm);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message);
        },
    });

    // Form submit handler
    const onSubmit = async (values: Farm) => {
        values.imageUrl = imageUrl;
        mutation.mutate(values);
    };

    // Form error handler
    const onError = (error: any) => {
        console.error(error);
        toast.error('Đã xảy ra lỗi');
    };

    // Handle location selection from map
    const handleLocationSelect = (lat: number, lng: number) => {
        form.setValue('latitude', lat);
        form.setValue('longitude', lng);
        toast.success('Vị trí đã được chọn');
    };

    // Check if coordinates are set
    const hasCoordinates = () => {
        const lat = form.getValues('latitude');
        const lng = form.getValues('longitude');
        return lat !== 0 && lng !== 0;
    };

    // Handle next step
    const handleNextStep = () => {
        if (formStep === 0) {
            form.trigger(['farmName', 'farmCode', 'address', 'area', 'scale']);
            const basicInfoValid =
                form.getFieldState('farmName').invalid === false &&
                form.getFieldState('farmCode').invalid === false &&
                form.getFieldState('address').invalid === false &&
                form.getFieldState('area').invalid === false &&
                form.getFieldState('scale').invalid === false;

            if (basicInfoValid) {
                setFormStep(1);
                setActiveTab('location');
            } else {
                toast.error('Vui lòng điền đầy đủ thông tin cơ bản');
            }
        } else if (formStep === 1) {
            form.trigger(['latitude', 'longitude']);
            const locationValid =
                form.getFieldState('latitude').invalid === false &&
                form.getFieldState('longitude').invalid === false;

            if (locationValid) {
                setFormStep(2);
                setActiveTab('contact');
            } else {
                toast.error('Vui lòng chọn vị trí trang trại');
            }
        }
    };

    // Handle previous step
    const handlePrevStep = () => {
        if (formStep === 1) {
            setFormStep(0);
            setActiveTab('basic');
        } else if (formStep === 2) {
            setFormStep(1);
            setActiveTab('location');
        }
    };

    // Update active tab when form step changes
    useEffect(() => {
        if (formStep === 0) setActiveTab('basic');
        else if (formStep === 1) setActiveTab('location');
        else if (formStep === 2) setActiveTab('contact');
    }, [formStep]);

    return (
        <section className="w-full min-h-screen py-10 px-4 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2 mb-2">
                        <Tractor className="h-8 w-8 text-green-600" />
                        Đăng ký Trang trại Mới
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Điền thông tin chi tiết về trang trại của bạn để đăng ký và quản lý hiệu quả
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2',
                                    formStep >= 0
                                        ? 'bg-green-600 border-green-600 text-white'
                                        : 'border-gray-300 text-gray-400',
                                )}
                            >
                                {formStep > 0 ? <Check className="h-5 w-5" /> : '1'}
                            </div>
                            <span
                                className={cn(
                                    'text-sm font-medium',
                                    formStep >= 0 ? 'text-green-600' : 'text-gray-400',
                                )}
                            >
                                Thông tin cơ bản
                            </span>
                        </div>
                        <div
                            className={cn(
                                'flex-1 h-1 mx-2',
                                formStep >= 1 ? 'bg-green-600' : 'bg-gray-200',
                            )}
                        />
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2',
                                    formStep >= 1
                                        ? 'bg-green-600 border-green-600 text-white'
                                        : 'border-gray-300 text-gray-400',
                                )}
                            >
                                {formStep > 1 ? <Check className="h-5 w-5" /> : '2'}
                            </div>
                            <span
                                className={cn(
                                    'text-sm font-medium',
                                    formStep >= 1 ? 'text-green-600' : 'text-gray-400',
                                )}
                            >
                                Vị trí
                            </span>
                        </div>
                        <div
                            className={cn(
                                'flex-1 h-1 mx-2',
                                formStep >= 2 ? 'bg-green-600' : 'bg-gray-200',
                            )}
                        />
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2',
                                    formStep >= 2
                                        ? 'bg-green-600 border-green-600 text-white'
                                        : 'border-gray-300 text-gray-400',
                                )}
                            >
                                {formStep > 2 ? <Check className="h-5 w-5" /> : '3'}
                            </div>
                            <span
                                className={cn(
                                    'text-sm font-medium',
                                    formStep >= 2 ? 'text-green-600' : 'text-gray-400',
                                )}
                            >
                                Liên hệ & Hình ảnh
                            </span>
                        </div>
                    </div>
                </div>

                <Card className="shadow-lg border-gray-200">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <CardHeader className="pb-4">
                            <TabsList className="grid grid-cols-3 w-full">
                                <TabsTrigger
                                    value="basic"
                                    onClick={() => formStep >= 0 && setFormStep(0)}
                                    disabled={formStep < 0}
                                    className="flex items-center gap-2"
                                >
                                    <SquareAsterisk className="h-4 w-4" />
                                    <span className="hidden sm:inline">Thông tin cơ bản</span>
                                    <span className="sm:hidden">Cơ bản</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="location"
                                    onClick={() => formStep >= 1 && setFormStep(1)}
                                    disabled={formStep < 1}
                                    className="flex items-center gap-2"
                                >
                                    <MapPin className="h-4 w-4" />
                                    <span>Vị trí</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="contact"
                                    onClick={() => formStep >= 2 && setFormStep(2)}
                                    disabled={formStep < 2}
                                    className="flex items-center gap-2"
                                >
                                    <Phone className="h-4 w-4" />
                                    <span className="hidden sm:inline">Liên hệ & Hình ảnh</span>
                                    <span className="sm:hidden">Liên hệ</span>
                                </TabsTrigger>
                            </TabsList>
                        </CardHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                                <CardContent className="space-y-6">
                                    <TabsContent value="basic" className="mt-0 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="farmName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <Home className="h-4 w-4 text-green-600" />
                                                            Tên trang trại
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Nhập tên trang trại"
                                                                {...field}
                                                                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Tên đầy đủ của trang trại
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="farmCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <Hash className="h-4 w-4 text-green-600" />
                                                            Mã trang trại
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Nhập mã trang trại"
                                                                {...field}
                                                                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Mã định danh duy nhất cho trang trại
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="area"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <Ruler className="h-4 w-4 text-green-600" />
                                                            Diện tích (ha)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="Nhập diện tích"
                                                                {...field}
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        Number(e.target.value),
                                                                    )
                                                                }
                                                                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Diện tích trang trại tính bằng hecta
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="scale"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <ScaleIcon className="h-4 w-4 text-green-600" />
                                                            Quy mô
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value.toString()}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="border-gray-300 focus:ring-green-500">
                                                                    <SelectValue placeholder="Chọn quy mô" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {mapEnumToValues(Scale).map(
                                                                    (value) => (
                                                                        <SelectItem
                                                                            key={value}
                                                                            value={value}
                                                                        >
                                                                            {scaleLabels[value]}
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormDescription>
                                                            Quy mô hoạt động của trang trại
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="location" className="mt-0 space-y-6">
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                                            <h3 className="text-lg font-medium text-green-800 flex items-center gap-2 mb-2">
                                                <MapPin className="h-5 w-5" />
                                                Vị trí trang trại
                                            </h3>
                                            <p className="text-green-700 text-sm mb-4">
                                                Chọn vị trí trang trại trên bản đồ hoặc nhập tọa độ
                                                chính xác
                                            </p>

                                            <div className="w-full h-[400px] rounded-md border border-green-300 overflow-hidden mb-6">
                                                <LocationMapWithNoSSR
                                                    onLocationSelect={handleLocationSelect}
                                                    initialLat={
                                                        form.getValues('latitude') || 21.0278
                                                    }
                                                    initialLng={
                                                        form.getValues('longitude') || 105.8342
                                                    }
                                                />
                                            </div>

                                            {hasCoordinates() && (
                                                <div className="bg-white p-3 rounded-md border border-green-200 mb-4">
                                                    <div className="flex items-center">
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-green-100 text-green-800 border-green-300"
                                                        >
                                                            Vị trí đã chọn
                                                        </Badge>
                                                        <span className="ml-2 text-sm text-gray-600">
                                                            {form.getValues('latitude').toFixed(6)},{' '}
                                                            {form.getValues('longitude').toFixed(6)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="latitude"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Vĩ độ</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    step="any"
                                                                    placeholder="Nhập vĩ độ (ví dụ: 21.0278)"
                                                                    {...field}
                                                                    onChange={(e) =>
                                                                        field.onChange(
                                                                            Number(e.target.value),
                                                                        )
                                                                    }
                                                                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Vĩ độ từ -90 đến 90
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="longitude"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Kinh độ</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    step="any"
                                                                    placeholder="Nhập kinh độ (ví dụ: 105.8342)"
                                                                    {...field}
                                                                    onChange={(e) =>
                                                                        field.onChange(
                                                                            Number(e.target.value),
                                                                        )
                                                                    }
                                                                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Kinh độ từ -180 đến 180
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="address"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4 text-green-600" />
                                                                Địa chỉ
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder="Nhập địa chỉ trang trại"
                                                                    {...field}
                                                                    className="border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-[100px]"
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Địa chỉ đầy đủ của trang trại
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="contact" className="mt-0 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="phoneNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <Phone className="h-4 w-4 text-green-600" />
                                                            Số điện thoại
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="tel"
                                                                placeholder="Nhập số điện thoại"
                                                                {...field}
                                                                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Số điện thoại liên hệ của trang trại
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="website"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <Globe className="h-4 w-4 text-green-600" />
                                                            Website
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="url"
                                                                placeholder="https://example.com"
                                                                {...field}
                                                                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Website chính thức của trang trại (nếu
                                                            có)
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Separator className="my-6" />

                                        <FormField
                                            control={form.control}
                                            name="imageUrl"
                                            render={() => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2 text-lg font-medium mb-2">
                                                        <ImageIcon className="h-5 w-5 text-green-600" />
                                                        Hình ảnh trang trại
                                                    </FormLabel>
                                                    <FormDescription className="mb-4">
                                                        Tải lên hình ảnh đại diện cho trang trại của
                                                        bạn
                                                    </FormDescription>
                                                    <FormControl>
                                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                                                            <CloudinaryImageUpload
                                                                onUploadComplete={(url) => {
                                                                    setImageUrl(url);
                                                                    toast.success(
                                                                        'Tải lên hình ảnh thành công',
                                                                    );
                                                                }}
                                                            />

                                                            {imageUrl && (
                                                                <div className="mt-4">
                                                                    <p className="text-sm text-gray-600 mb-2">
                                                                        Hình ảnh đã tải lên:
                                                                    </p>
                                                                    <div className="relative w-full max-w-xs h-40 rounded-md overflow-hidden border border-gray-200">
                                                                        <Image
                                                                            fill
                                                                            src={
                                                                                imageUrl ||
                                                                                '/placeholder.svg'
                                                                            }
                                                                            alt="Farm preview"
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TabsContent>
                                </CardContent>

                                <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                                    {formStep > 0 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handlePrevStep}
                                            className="w-full sm:w-auto order-2 sm:order-1"
                                        >
                                            Quay lại
                                        </Button>
                                    )}

                                    {formStep < 2 ? (
                                        <Button
                                            type="button"
                                            onClick={handleNextStep}
                                            className="w-full sm:w-auto order-1 sm:order-2 bg-green-600 hover:bg-green-700"
                                        >
                                            Tiếp theo
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            className="w-full sm:w-auto order-1 sm:order-2 bg-green-600 hover:bg-green-700"
                                            disabled={mutation.isPending}
                                        >
                                            {mutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                'Đăng ký trang trại'
                                            )}
                                        </Button>
                                    )}
                                </CardFooter>
                            </form>
                        </Form>
                    </Tabs>
                </Card>
            </div>
        </section>
    );
}
