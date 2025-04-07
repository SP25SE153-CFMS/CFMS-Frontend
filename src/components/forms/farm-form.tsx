'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
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
import { MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { CreateFarmSchema, FarmSchema, type Farm } from '@/utils/schemas/farm.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFarm, updateFarm } from '@/services/farm.service';
import { useRouter } from 'next/navigation';
import config from '@/configs';
import { CloudinaryImageUpload } from '@/components/cloudinary-image-upload';
import { useMutation } from '@tanstack/react-query';
import { mapEnumToValues } from '@/utils/functions/enum.function';
import { Scale, scaleLabels } from '@/utils/enum/status.enum';
import { getAddress } from '@/services/map.service';
import { PhoneInput } from '@/components/ui/phone-input';

// Dynamically import the map component with no SSR
const LocationMapWithNoSSR = dynamic(() => import('../map/location-map'), { ssr: false });

interface FarmFormProps {
    defaultValues?: Farm;
}

const FarmForm = ({ defaultValues }: FarmFormProps) => {
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState<string>('');
    const [mapVisible, setMapVisible] = useState(false);

    // Initialize form
    const form = useForm<Farm>({
        resolver: zodResolver(defaultValues ? FarmSchema : CreateFarmSchema),
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
            ...defaultValues,
        },
    });

    const mutation = useMutation({
        mutationFn: defaultValues ? updateFarm : createFarm,
        onSuccess: () => {
            if (defaultValues) {
                toast.success('Cập nhật trang trại thành công');
                router.push(config.routes.farm);
            } else {
                toast.success('Tạo trang trại thành công');
            }
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
    const handleLocationSelect = async (lat: number, lng: number) => {
        form.setValue('latitude', lat);
        form.setValue('longitude', lng);
        const address = await getAddress(lat, lng);
        form.setValue('address', address);
        setMapVisible(false);
        toast.success('Vị trí đã được chọn');
    };

    return (
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
                                        <Input placeholder="Nhập tên trang trại" {...field} />
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
                                        <Input placeholder="Nhập mã trang trại" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

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
                                            min={0}
                                            placeholder="Nhập diện tích"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
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
                                        defaultValue={field.value.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số điện thoại</FormLabel>
                                    <FormControl>
                                        <PhoneInput
                                            countryCallingCodeEditable={false}
                                            defaultCountry="VN"
                                            international={true}
                                            onChange={field.onChange}
                                            value={field.value}
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

                    {/* Location Fields */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Vị trí trang trại</h3>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setMapVisible(!mapVisible)}
                                className="flex items-center gap-2"
                            >
                                <MapPin className="h-4 w-4" />
                                {mapVisible ? 'Ẩn bản đồ' : 'Chọn trên bản đồ'}
                            </Button>
                        </div>

                        {mapVisible && (
                            <div className="w-full h-[400px] rounded-md border overflow-hidden mb-4">
                                <LocationMapWithNoSSR
                                    onLocationSelect={handleLocationSelect}
                                    initialLat={form.getValues('latitude') || 21.0278}
                                    initialLng={form.getValues('longitude') || 105.8342}
                                />
                            </div>
                        )}

                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                        disabled={
                                                            form.getValues('latitude') === 0 ||
                                                            form.getValues('longitude') === 0
                                                        }
                                                        placeholder="Nhập vĩ độ (ví dụ: 21.0278)"
                                                        {...field}
                                                        onChange={async (e) => {
                                                            field.onChange(Number(e.target.value));
                                                            const address = await getAddress(
                                                                Number(e.target.value),
                                                                form.getValues('longitude'),
                                                            );
                                                            form.setValue('address', address);
                                                        }}
                                                    />
                                                </FormControl>
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
                                                        disabled={
                                                            form.getValues('latitude') === 0 ||
                                                            form.getValues('longitude') === 0
                                                        }
                                                        placeholder="Nhập kinh độ (ví dụ: 105.8342)"
                                                        {...field}
                                                        onChange={async (e) => {
                                                            field.onChange(Number(e.target.value));
                                                            const address = await getAddress(
                                                                form.getValues('latitude'),
                                                                Number(e.target.value),
                                                            );
                                                            form.setValue('address', address);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div> */}
                    </div>

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Địa chỉ</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Nhập địa chỉ trang trại" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={() => (
                            <FormItem>
                                <FormLabel>Hình ảnh trang trại</FormLabel>
                                <FormControl>
                                    <CloudinaryImageUpload
                                        onUploadComplete={(url) => setImageUrl(url)}
                                        defaultImage={defaultValues?.imageUrl}
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
    );
};

export default FarmForm;
