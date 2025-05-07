'use client';

import type React from 'react';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {
    CardContent,
    CardFooter,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
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
import {
    Loader2,
    MapPin,
    TractorIcon as Farm,
    Phone,
    Globe,
    Ruler,
    ScaleIcon,
    Code,
    ImageIcon,
    Map,
    LocateFixed,
    ChevronLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CreateFarmSchema, FarmSchema, type Farm as FarmType } from '@/utils/schemas/farm.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFarm, updateFarm } from '@/services/farm.service';
import { useRouter } from 'next/navigation';
import config from '@/configs';
import { CloudinaryImageUpload } from '@/components/cloudinary-image-upload';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mapEnumToValues } from '@/utils/functions/enum.function';
import { Scale, scaleLabels } from '@/utils/enum/status.enum';
import { getAddress } from '@/services/map.service';
import { PhoneInput } from '@/components/ui/phone-input';
import { SelectNative } from '../ui/select-native';
import { CategoryType } from '@/utils/enum/category.enum';
import { getSubCategoriesByType } from '@/services/category.service';
import { generateCode } from '@/utils/functions/generate-code.function';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { onError } from '@/utils/functions/form.function';

// Dynamically import the map component with no SSR
const LocationMapWithNoSSR = dynamic(() => import('../map/location-map'), { ssr: false });

interface FarmFormProps {
    defaultValues?: FarmType;
}

const FarmForm = ({ defaultValues }: FarmFormProps) => {
    const router = useRouter();
    const [mapVisible, setMapVisible] = useState(false);

    const { data: areaUnits, isLoading: isLoadingAreaUnits } = useQuery({
        queryKey: ['area-units'],
        queryFn: () => getSubCategoriesByType(CategoryType.AREA_UNIT),
    });

    // Initialize form
    const form = useForm<FarmType>({
        resolver: zodResolver(defaultValues ? FarmSchema : CreateFarmSchema),
        defaultValues: {
            farmName: '',
            farmCode: '',
            address: '',
            area: 0,
            areaUnitId: areaUnits?.[0]?.subCategoryId || '',
            scale: 0,
            phoneNumber: '',
            website: '',
            imageUrl: '',
            longitude: 0,
            latitude: 0,
            ...defaultValues,
        },
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: defaultValues ? updateFarm : createFarm,
        onSuccess: () => {
            if (defaultValues) {
                toast.success('Cập nhật trang trại thành công');
                queryClient.invalidateQueries({ queryKey: ['farms'] });
            } else {
                toast.success('Tạo trang trại thành công');
                router.push(config.routes.farm);
            }
        },
        onError: (err: any) => {
            toast(err?.response?.data?.message, { icon: '⚠️' });
        },
    });

    // Form submit handler
    const onSubmit = async (values: FarmType) => {
        mutation.mutate(values);
    };
    // Handle location selection from map
    const handleLocationSelect = async (lat: number, lng: number) => {
        form.setValue('latitude', lat);
        form.setValue('longitude', lng);
        const address = await getAddress(lat, lng);
        form.setValue('address', address);
        setMapVisible(false);
        toast.success('Vị trí đã được chọn');
    };

    const handleGenerateCode = (e: React.FocusEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const existingCodes = new Set(
            JSON.parse(sessionStorage.getItem('farms') || '[]').map(
                (farm: FarmType) => farm.farmCode,
            ),
        );

        let code;
        let index = 1;
        do {
            code = generateCode(input, index);
            index++;
        } while (existingCodes.has(code));

        form.setValue('farmCode', code);
        form.setValue('farmName', input);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-md">
            <Link href={config.routes.farm}>
                <Button variant="ghost" className="mt-4">
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Quay lại
                </Button>
            </Link>
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <div className="flex items-center gap-2">
                    <Farm className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl font-bold text-primary">
                        {defaultValues ? 'Cập nhật trang trại' : 'Đăng ký trang trại'}
                    </CardTitle>
                </div>
                <CardDescription className="text-primary">
                    Nhập thông tin chi tiết về trang trại gà của bạn
                </CardDescription>
            </CardHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="farmName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                            <Farm className="h-4 w-4" />
                                            Tên trang trại
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nhập tên trang trại"
                                                className="border-primary/50 focus-visible:ring-primary/75"
                                                {...field}
                                                onBlur={handleGenerateCode}
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
                                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                            <Code className="h-4 w-4" />
                                            Mã trang trại
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Mã trang trại"
                                                className="bg-muted/50"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="area"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                            <Ruler className="h-4 w-4" />
                                            Diện tích
                                        </FormLabel>
                                        <div className="flex rounded-md shadow-sm">
                                            <Input
                                                className="rounded-e-none h-10 border-primary/50 focus-visible:ring-primary/75"
                                                placeholder="Nhập số lượng"
                                                type="number"
                                                min={0}
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(Number(e.target.value))
                                                }
                                            />
                                            <SelectNative
                                                className="text-muted-foreground hover:text-foreground w-fit rounded-s-none h-10 bg-primary/5 border-primary/50"
                                                defaultValue={
                                                    form.getValues('areaUnitId') ||
                                                    areaUnits?.[0]?.subCategoryId
                                                }
                                                onChange={(e) =>
                                                    form.setValue('areaUnitId', e.target.value)
                                                }
                                            >
                                                {isLoadingAreaUnits ? (
                                                    <option>Đang tải...</option>
                                                ) : (
                                                    areaUnits?.map((unit) => (
                                                        <option
                                                            key={unit.subCategoryId}
                                                            value={unit.subCategoryId}
                                                        >
                                                            {unit.subCategoryName}
                                                        </option>
                                                    ))
                                                )}
                                            </SelectNative>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="scale"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                            <ScaleIcon className="h-4 w-4" />
                                            Quy mô
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="border-primary/50 focus-visible:ring-primary/75">
                                                    <SelectValue placeholder="Chọn quy mô" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {mapEnumToValues(Scale).map((value) => (
                                                    <SelectItem key={value} value={value}>
                                                        {scaleLabels[value]}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                            <Phone className="h-4 w-4" />
                                            Số điện thoại
                                        </FormLabel>
                                        <FormControl>
                                            <PhoneInput
                                                countryCallingCodeEditable={false}
                                                defaultCountry="VN"
                                                international={true}
                                                onChange={field.onChange}
                                                value={field.value}
                                                maxLength={20}
                                                className="border-primary/50 focus-visible:ring-primary/75"
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
                                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                            <Globe className="h-4 w-4" />
                                            Website
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="url"
                                                placeholder="https://example.com"
                                                className="border-primary/50 focus-visible:ring-primary/75"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                                <Map className="h-5 w-5" />
                                Vị trí trang trại
                            </h3>
                            <Button
                                type="button"
                                variant={mapVisible ? 'default' : 'outline'}
                                onClick={() => setMapVisible(!mapVisible)}
                                className="flex items-center gap-2 border-primary/30 hover:bg-primary/10"
                            >
                                <LocateFixed className="h-4 w-4" />
                                {mapVisible ? 'Ẩn bản đồ' : 'Chọn trên bản đồ'}
                            </Button>
                        </div>

                        {mapVisible && (
                            <div className="w-full h-[400px] rounded-md border border-primary/50 overflow-hidden mb-4 shadow-sm">
                                <LocationMapWithNoSSR
                                    onLocationSelect={handleLocationSelect}
                                    initialLat={form.getValues('latitude') || 21.0278}
                                    initialLng={form.getValues('longitude') || 105.8342}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            {form.getValues('latitude') !== 0 &&
                                form.getValues('longitude') !== 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <Badge
                                            variant="outline"
                                            className="bg-primary/5 text-primary border-primary/25"
                                        >
                                            Vĩ độ: {form.getValues('latitude').toFixed(6)}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="bg-primary/5 text-primary border-primary/25"
                                        >
                                            Kinh độ: {form.getValues('longitude').toFixed(6)}
                                        </Badge>
                                    </div>
                                )}

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                            <MapPin className="h-4 w-4" />
                                            Địa chỉ chi tiết
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Nhập địa chỉ trang trại"
                                                className="min-h-[120px] border-primary/50 focus-visible:ring-primary/75"
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
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                        <ImageIcon className="h-4 w-4" />
                                        Hình ảnh trang trại
                                    </FormLabel>
                                    <FormControl>
                                        <CloudinaryImageUpload
                                            onUploadComplete={(url) => {
                                                field.onChange(url);
                                            }}
                                            defaultImage={defaultValues?.imageUrl}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>

                    <CardFooter className="flex justify-between gap-4 p-6 border-t bg-primary/5/50">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push(config.routes.farm)}
                            className="border-primary/30 hover:bg-primary/10"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-white"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            {defaultValues ? 'Cập nhật trang trại' : 'Đăng ký trang trại'}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
};

export default FarmForm;
