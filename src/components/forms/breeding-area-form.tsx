'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    type BreedingArea,
    BreedingAreaSchema,
    CreateBreedingAreaSchema,
} from '@/utils/schemas/breeding-area.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBreedingArea, updateBreedingArea } from '@/services/breeding-area.service';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/card';
import { CloudinaryImageUpload } from '../cloudinary-image-upload';
import { getFarmsForCurrentUser } from '@/services/farm.service';
import { getCookie } from 'cookies-next';
import config from '@/configs';
interface BreedingAreaFormProps {
    defaultValues?: Partial<BreedingArea>;
    closeDialog: () => void;
}

export default function BreedingAreaForm({ defaultValues, closeDialog }: BreedingAreaFormProps) {
    const queryClient = useQueryClient();

    // Initialize form
    const form = useForm<BreedingArea>({
        resolver: zodResolver(defaultValues ? BreedingAreaSchema : CreateBreedingAreaSchema),
        defaultValues: {
            breedingAreaCode: '',
            breedingAreaName: '',
            area: 0,
            imageUrl: '',
            notes: '',
            status: '1',
            farmId: getCookie(config.cookies.farmId) || '',
            ...defaultValues,
        },
    });

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateBreedingArea : createBreedingArea,
        onSuccess: ({ message }) => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['breedingAreas'] });
            toast.success(message);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message);
        },
    });

    // Form submit handler
    const onSubmit = async (values: BreedingArea) => {
        mutation.mutate(values);
    };

    // Form error handler
    const onError = (error: any) => {
        console.error(error);
    };

    const { data: farms } = useQuery({
        queryKey: ['farms'],
        queryFn: () => getFarmsForCurrentUser(),
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="col-span-1 md:col-span-2 overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-primary">
                                    Thông tin cơ bản
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Breeding Area Code */}
                                <FormField
                                    control={form.control}
                                    name="breedingAreaCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mã khu nuôi</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập mã khu nuôi" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Breeding Area Name */}
                                <FormField
                                    control={form.control}
                                    name="breedingAreaName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên khu nuôi</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập tên khu nuôi" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Area */}
                                <FormField
                                    control={form.control}
                                    name="area"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Diện tích (m²)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Nhập diện tích"
                                                    min={0}
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

                                {/* Trang trại */}
                                <FormField
                                    control={form.control}
                                    name="farmId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Trang trại</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled
                                                    value={
                                                        farms?.find(
                                                            (farm) => farm.farmId === field.value,
                                                        )?.farmName ?? ''
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Image Upload */}
                    <Card className="col-span-1">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-primary">Hình ảnh</h3>
                            </div>

                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hình ảnh khu nuôi</FormLabel>
                                        <FormControl>
                                            <CloudinaryImageUpload
                                                onUploadComplete={(url) => field.onChange(url)}
                                                defaultImage={defaultValues?.imageUrl}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card className="col-span-1">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-primary">Ghi chú</h3>
                            </div>

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ghi chú</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Nhập ghi chú về khu nuôi"
                                                className="min-h-[180px] resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={closeDialog}>
                        Hủy
                    </Button>
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending
                            ? 'Đang xử lý...'
                            : defaultValues
                              ? 'Cập nhật'
                              : 'Tạo mới'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
