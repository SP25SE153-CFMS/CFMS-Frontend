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
import { CategoryType } from '@/utils/enum/category.enum';
import { SelectNative } from '../ui/select-native';
import { getSubCategoryByCategoryType } from '@/utils/functions/category.function';
import { generateCode } from '@/utils/functions/generate-code.function';
import { Loader2 } from 'lucide-react';
import { onError } from '@/utils/functions/form.function';

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
            areaUnitId: getSubCategoryByCategoryType(CategoryType.AREA_UNIT)?.[0]?.subCategoryId,
            imageUrl: '',
            notes: '',
            status: 1,
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
            toast(err?.response?.data?.message, { icon: '⚠️' });
        },
    });

    // Form submit handler
    const onSubmit = async (values: BreedingArea) => {
        mutation.mutate(values);
    };

    const { data: farms } = useQuery({
        queryKey: ['farms'],
        queryFn: () => getFarmsForCurrentUser(),
    });

    const handleGenerateCode = (e: React.FocusEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const existingCodes = new Set(
            JSON.parse(sessionStorage.getItem('breedingAreas') || '[]').map(
                (breedingArea: BreedingArea) => breedingArea.breedingAreaCode,
            ),
        );

        let code;
        let index = 1;
        do {
            code = generateCode(input, index);
            index++;
        } while (existingCodes.has(code));

        form.setValue('breedingAreaCode', code);
        form.setValue('breedingAreaName', input);
    };

    // const remainingArea = useMemo(() => {
    //     const breedingAreas = queryClient.getQueryData<BreedingArea[]>(['breedingAreas']);
    //     const currentFarm = farms?.find((farm) => farm.farmId === form.getValues('farmId'));
    //     const currentAreaUnitId = form.getValues('areaUnitId');

    //     if (!breedingAreas || !currentFarm || !currentAreaUnitId) return 0;

    //     // Calculate total area used by breeding areas
    //     const totalAreaForBreedingAreas = breedingAreas.reduce((acc, brArea) => {
    //         if (brArea.areaUnitId === currentAreaUnitId) {
    //             return acc + brArea.area;
    //         }
    //         const convertedArea = convertArea(brArea.area, brArea.areaUnitId, currentAreaUnitId);
    //         return acc + convertedArea;
    //     }, 0);

    //     // Convert farm's total area to current unit
    //     const convertedFarmArea = convertArea(
    //         currentFarm.area,
    //         currentFarm.areaUnitId,
    //         currentAreaUnitId,
    //     );

    //     const totalAreaForWarehouse = 0;

    //     return convertedFarmArea - totalAreaForBreedingAreas - totalAreaForWarehouse;
    // }, [farms, form, queryClient]);

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
                                {/* Breeding Area Name */}
                                <FormField
                                    control={form.control}
                                    name="breedingAreaName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên khu nuôi</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nhập tên khu nuôi"
                                                    {...field}
                                                    onBlur={
                                                        defaultValues
                                                            ? undefined // Don't generate code if editing
                                                            : handleGenerateCode // Generate code if creating
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

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

                                {/* Area */}
                                <FormField
                                    control={form.control}
                                    name="area"
                                    render={({ field }) => (
                                        <FormItem className="mt-[6px]">
                                            <FormLabel className="flex items-center">
                                                Diện tích
                                            </FormLabel>
                                            <div className="flex rounded-md shadow-sm">
                                                <Input
                                                    className="rounded-e-none h-10"
                                                    placeholder="Nhập số lượng"
                                                    type="number"
                                                    min={0}
                                                    {...field}
                                                    onChange={(e) => {
                                                        const value = Number(e.target.value);
                                                        field.onChange(value);

                                                        // if (value > remainingArea) {
                                                        //     const currentFarm = farms?.find(
                                                        //         (farm) =>
                                                        //             farm.farmId ===
                                                        //             form.getValues('farmId'),
                                                        //     );
                                                        //     if (currentFarm) {
                                                        //         form.setError('area', {
                                                        //             message: `Diện tích khu nuôi phải nhỏ hơn ${remainingArea} ${getAreaUnit(currentFarm.areaUnitId)}`,
                                                        //         });
                                                        //     }
                                                        // } else {
                                                        //     form.clearErrors('area');
                                                        // }
                                                    }}
                                                />
                                                <SelectNative
                                                    className="text-muted-foreground hover:text-foreground w-fit rounded-s-none h-10 bg-muted/50"
                                                    onChange={(e) => {
                                                        form.setValue('areaUnitId', e.target.value);
                                                    }}
                                                    defaultValue={form.getValues('areaUnitId')}
                                                >
                                                    {getSubCategoryByCategoryType(
                                                        CategoryType.AREA_UNIT,
                                                    )?.map((unit) => (
                                                        <option
                                                            key={unit.subCategoryId}
                                                            value={unit.subCategoryId}
                                                        >
                                                            {unit.subCategoryName}
                                                        </option>
                                                    ))}
                                                </SelectNative>
                                            </div>
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
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Hình ảnh khu nuôi</FormLabel>
                                        <FormControl>
                                            <CloudinaryImageUpload
                                                onUploadComplete={(url) =>
                                                    form.setValue('imageUrl', url)
                                                }
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
                        {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {defaultValues ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
