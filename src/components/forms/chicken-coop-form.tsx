'use client';

import type React from 'react';

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
import {
    CreateChickenCoopSchema,
    type ChickenCoop,
    ChickenCoopSchema,
} from '@/utils/schemas/chicken-coop.schema';
import { createChickenCoop, updateChickenCoop } from '@/services/chicken-coop.service';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SelectNative } from '../ui/select-native';
import { getSubCategoryByCategoryType } from '@/utils/functions/category.function';
import { CategoryType } from '@/utils/enum/category.enum';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '../ui/select';
import { generateCode } from '@/utils/functions/generate-code.function';
import { Cog, Home, Loader2, RefreshCw, Ruler, SquareMenu } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChickenCoopStatus } from '@/utils/enum/status.enum';

interface ChickenCoopFormProps {
    defaultValues?: Partial<ChickenCoop>;
    closeDialog: () => void;
}

export default function ChickenCoopForm({ defaultValues, closeDialog }: ChickenCoopFormProps) {
    // Initialize form
    const form = useForm<ChickenCoop>({
        resolver: zodResolver(defaultValues ? ChickenCoopSchema : CreateChickenCoopSchema),
        defaultValues: {
            chickenCoopId: '',
            chickenCoopCode: '',
            chickenCoopName: '',
            maxQuantity: 0,
            status: 0,
            breedingAreaId: sessionStorage.getItem('breedingAreaId') || '',
            area: 0,
            description: '',
            purposeId: getSubCategoryByCategoryType(CategoryType.PURPOSE)?.[0]?.subCategoryId,
            density: 0,
            densityUnitId: getSubCategoryByCategoryType(CategoryType.DENSITY_UNIT)?.find(
                (cate) => cate.subCategoryName === 'con/m²',
            )?.subCategoryId,
            areaUnitId: getSubCategoryByCategoryType(CategoryType.AREA_UNIT)?.find(
                (cate) => cate.subCategoryName === 'm²',
            )?.subCategoryId,
            ...defaultValues,
        },
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateChickenCoop : createChickenCoop,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({
                queryKey: ['chickenCoops', sessionStorage.getItem('breedingAreaId')],
            });
            if (defaultValues) {
                queryClient.invalidateQueries({
                    queryKey: ['chickenCoop', defaultValues.chickenCoopId],
                });
            }

            toast.success(
                defaultValues ? 'Cập nhật chuồng gà thành công' : 'Tạo chuồng gà thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast(error?.response?.data?.message, { icon: '⚠️' });
        },
    });

    // Form submit handler
    async function onSubmit(values: ChickenCoop) {
        mutation.mutate(values);
    }

    // Form error handler
    const onError = (error: any) => {
        console.error(error);
    };

    const handleGenerateCode = (e: React.FocusEvent<HTMLInputElement>) => {
        const input = e.target.value;
        if (!input) return;

        const existingCodes = new Set(
            JSON.parse(sessionStorage.getItem('chickenCoops') || '[]').map(
                (chickenCoop: ChickenCoop) => chickenCoop.chickenCoopCode,
            ),
        );

        let code;
        let index = 1;
        do {
            code = generateCode(input, index);
            index++;
        } while (existingCodes.has(code));

        form.setValue('chickenCoopCode', code);
        form.setValue('chickenCoopName', input);
    };

    const regenerateCode = () => {
        const input = form.getValues('chickenCoopName');
        if (!input) {
            toast('Vui lòng nhập tên chuồng gà trước', { icon: '⚠️' });
            return;
        }

        const existingCodes = new Set(
            JSON.parse(sessionStorage.getItem('chickenCoops') || '[]').map(
                (chickenCoop: ChickenCoop) => chickenCoop.chickenCoopCode,
            ),
        );

        let code;
        let index = 1;
        do {
            code = generateCode(input, index);
            index++;
        } while (existingCodes.has(code));

        form.setValue('chickenCoopCode', code);
    };

    const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Set area
        const area = Number(e.target.value);
        form.setValue('area', area);

        // Calculate max quantity based on area and density
        const result = area * form.getValues('density');
        const maxQuantity = Math.round(result);
        form.setValue('maxQuantity', maxQuantity);
    };

    const handleDensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Set density
        const density = Number(e.target.value);
        form.setValue('density', density);

        // Calculate max quantity
        if (density === 0) {
            form.setValue('maxQuantity', 0);
        } else {
            const result = form.getValues('area') * density;
            const maxQuantity = Math.round(result);
            form.setValue('maxQuantity', maxQuantity);
        }
    };

    const handleMaxQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maxQuantity = Number(e.target.value);
        form.setValue('maxQuantity', maxQuantity);

        // Calculate area based on max quantity and density
        if (form.getValues('density') === 0) {
            form.setValue('area', 0);
        } else {
            const result = maxQuantity / form.getValues('density');
            const area = Math.round(result);
            form.setValue('area', area);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="flex flex-col space-y-6"
            >
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center mb-4">
                            <Home className="mr-2 h-5 w-5 text-primary" />
                            <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
                        </div>
                        <Separator className="mb-5" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Tên chuồng gà */}
                            <FormField
                                control={form.control}
                                name="chickenCoopName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên chuồng gà</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Nhập tên chuồng gà"
                                                {...field}
                                                onBlur={
                                                    defaultValues
                                                        ? undefined // Do not generate code if editing
                                                        : handleGenerateCode // Generate code if creating
                                                }
                                                className="h-10"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Mã chuồng gà */}
                            <FormField
                                control={form.control}
                                name="chickenCoopCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mã chuồng gà</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Mã chuồng gà"
                                                    readOnly
                                                    {...field}
                                                    className="h-10 bg-muted/50"
                                                />
                                            </FormControl>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={regenerateCode}
                                                            className="h-10 w-10 flex-shrink-0"
                                                        >
                                                            <RefreshCw className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Tạo mã mới</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Loại gà */}
                            <FormField
                                control={form.control}
                                name="purposeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Loại gà</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-10">
                                                        <SelectValue placeholder="Chọn loại gà" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {getSubCategoryByCategoryType(
                                                        CategoryType.CHICKEN,
                                                    ).map((status) => (
                                                        <SelectItem
                                                            key={status.subCategoryId}
                                                            value={status.subCategoryId}
                                                        >
                                                            {status.subCategoryName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Mô tả */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nhập mô tả về chuồng gà"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center mb-4">
                            <Ruler className="mr-2 h-5 w-5 text-primary" />
                            <h3 className="text-lg font-medium">Kích thước và sức chứa</h3>
                        </div>
                        <Separator className="mb-5" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Diện tích */}
                            <FormField
                                control={form.control}
                                name="area"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center">
                                            Diện tích
                                        </FormLabel>
                                        <div className="flex rounded-md shadow-sm">
                                            <Input
                                                className="rounded-e-none h-10"
                                                placeholder="Nhập diện tích"
                                                type="number"
                                                min={0}
                                                {...field}
                                                onChange={handleAreaChange}
                                                disabled={
                                                    defaultValues?.status ===
                                                    ChickenCoopStatus.OCCUPIED
                                                }
                                            />
                                            <SelectNative
                                                className="text-muted-foreground hover:text-foreground w-fit rounded-s-none h-10 bg-muted/50"
                                                disabled
                                                value={form.getValues('areaUnitId')}
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

                            {/* Mật độ */}
                            <FormField
                                control={form.control}
                                name="density"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center">Mật độ</FormLabel>
                                        <div className="flex rounded-md shadow-sm">
                                            <Input
                                                className="rounded-e-none h-10"
                                                placeholder="Nhập mật độ"
                                                type="number"
                                                min={0}
                                                step="any"
                                                {...field}
                                                onChange={handleDensityChange}
                                            />
                                            <SelectNative
                                                className="text-muted-foreground hover:text-foreground w-fit rounded-s-none h-10 bg-muted/50"
                                                disabled
                                                value={form.getValues('densityUnitId')}
                                            >
                                                {getSubCategoryByCategoryType(
                                                    CategoryType.DENSITY_UNIT,
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

                            {/* Sức chứa */}
                            <FormField
                                control={form.control}
                                name="maxQuantity"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Sức chứa tối đa</FormLabel>
                                            {/* <div className="text-xs text-muted-foreground">
                                                Tự động tính từ diện tích và mật độ
                                            </div> */}
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <SquareMenu className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Sức chứa tối đa"
                                                    min={0}
                                                    // disabled
                                                    className="h-10 pl-10 font-medium"
                                                    {...field}
                                                    onChange={handleMaxQuantityChange}
                                                />
                                            </FormControl>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <span className="text-sm text-muted-foreground">
                                                    con gà
                                                </span>
                                            </div>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mt-4 p-3 bg-muted/30 rounded-md border border-dashed flex items-center">
                            <Cog className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                                Công thức tính:{' '}
                                <span className="font-medium">Sức chứa = Diện tích × Mật độ</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center pt-2">
                    <Button
                        type="submit"
                        size="lg"
                        className="min-w-[200px]"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {defaultValues ? 'Cập nhật chuồng gà' : 'Tạo chuồng gà mới'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
