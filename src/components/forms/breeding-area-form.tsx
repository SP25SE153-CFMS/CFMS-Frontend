'use client';

import type from 'react';

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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBreedingArea, updateBreedingArea } from '@/services/breeding-area.service';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, X } from 'lucide-react';
import { useState } from 'react';

interface BreedingAreaFormProps {
    defaultValues?: Partial<BreedingArea>;
    closeDialog: () => void;
}

export default function BreedingAreaForm({ defaultValues, closeDialog }: BreedingAreaFormProps) {
    const queryClient = useQueryClient();
    const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.image || null);
    const [isUploading, setIsUploading] = useState(false);

    // Initialize form
    const form = useForm<BreedingArea>({
        resolver: zodResolver(defaultValues ? BreedingAreaSchema : CreateBreedingAreaSchema),
        defaultValues: {
            breedingAreaCode: '',
            breedingAreaName: '',
            mealsPerDay: 0,
            area: 0,
            image: '',
            notes: '',
            farmId: sessionStorage.getItem('farmId') || '',
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

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        // Create a preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setImagePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Simulate upload - in a real app, you would upload to a server/cloud storage
        setTimeout(() => {
            // For demo purposes, we're just setting the image URL to the file name
            // In a real app, this would be the URL returned from your upload service
            const imageUrl = `https://example.com/images/${file.name}`;
            form.setValue('image', imageUrl);
            setIsUploading(false);
        }, 1000);
    };

    const removeImage = () => {
        setImagePreview(null);
        form.setValue('image', '');
    };

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

                                {/* Meals Per Day */}
                                <FormField
                                    control={form.control}
                                    name="mealsPerDay"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Số bữa ăn mỗi ngày</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Nhập số bữa ăn mỗi ngày"
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
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hình ảnh khu nuôi</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col items-center">
                                                {imagePreview ? (
                                                    <div className="relative w-full h-40 mb-4">
                                                        <img
                                                            src={imagePreview || '/placeholder.svg'}
                                                            alt="Preview"
                                                            className="w-full h-full object-contain rounded-md"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute top-2 right-2"
                                                            onClick={removeImage}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="border-2 border-dashed border-gray-300 rounded-md p-6 w-full h-40 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                                                        onClick={() =>
                                                            document
                                                                .getElementById('image-upload')
                                                                ?.click()
                                                        }
                                                    >
                                                        <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                                                        <p className="text-sm text-gray-500">
                                                            Kéo thả hoặc nhấp để tải lên
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            PNG, JPG, GIF (tối đa 5MB)
                                                        </p>
                                                    </div>
                                                )}
                                                <Input
                                                    id="image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                    disabled={isUploading}
                                                />
                                                <Input type="hidden" {...field} />
                                            </div>
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
