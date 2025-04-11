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
import {
    CreateChickenCoopSchema,
    type ChickenCoop,
    ChickenCoopSchema,
} from '@/utils/schemas/chicken-coop.schema';
import { createChickenCoop, updateChickenCoop } from '@/services/chicken-coop.service';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Textarea } from '../ui/textarea';
import { SelectNative } from '../ui/select-native';
import { getSubCategoryByCategoryType } from '@/utils/functions/category.function';
import { CategoryType } from '@/utils/enum/category.enum';
import useQueryParams from '@/hooks/use-query-params';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '../ui/select';
import { generateCode } from '@/utils/functions/generate-code.function';

interface ChickenCoopFormProps {
    defaultValues?: Partial<ChickenCoop>;
    closeDialog: () => void;
}

export default function ChickenCoopForm({ defaultValues, closeDialog }: ChickenCoopFormProps) {
    const { breedingAreaId } = useQueryParams();

    // Initialize form
    const form = useForm<ChickenCoop>({
        resolver: zodResolver(defaultValues ? ChickenCoopSchema : CreateChickenCoopSchema),
        defaultValues: {
            chickenCoopId: '',
            chickenCoopCode: '',
            chickenCoopName: '',
            maxQuantity: 0,
            status: 0,
            breedingAreaId: breedingAreaId || sessionStorage.getItem('breedingAreaId') || '',
            area: 0,
            // currentQuantity: 0,
            description: '',
            // TODO: Change to default value
            purposeId: getSubCategoryByCategoryType(CategoryType.PURPOSE)?.[0].subCategoryId,
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
            queryClient.invalidateQueries({ queryKey: ['chickenCoops', breedingAreaId] });
            toast.success(
                defaultValues ? 'Cập nhật chuồng gà thành công' : 'Tạo chuồng gà thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message);
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
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
                                        onBlur={handleGenerateCode}
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
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập mã chuồng gà"
                                        readOnly
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Sức chứa */}
                    <FormField
                        control={form.control}
                        name="maxQuantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sức chứa</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Nhập sức chứa"
                                        min={0}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                            const maxQuantity = Number(e.target.value);
                                            if (maxQuantity === 0) {
                                                form.setValue('density', 0);
                                            } else {
                                                const density =
                                                    maxQuantity / form.getValues('area');
                                                form.setValue('density', density);
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Trạng thái */}
                    {/* <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trạng thái</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="0">Không hoạt động</SelectItem>
                                        <SelectItem value="1">Đang hoạt động</SelectItem>
                                        <SelectItem value="2">Bảo trì</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Diện tích */}
                    <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                            <FormItem className="mt-[6px]">
                                <FormLabel className="flex items-center">Diện tích</FormLabel>
                                <div className="flex rounded-md shadow-sm">
                                    <Input
                                        className="rounded-e-none h-10"
                                        placeholder="Nhập số lượng"
                                        type="number"
                                        min={0}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                            const area = Number(e.target.value);
                                            form.setValue(
                                                'density',
                                                form.getValues('maxQuantity') / area,
                                            );
                                        }}
                                    />
                                    <SelectNative
                                        className="text-muted-foreground hover:text-foreground w-fit rounded-s-none h-10 bg-muted/50"
                                        disabled
                                        value={form.getValues('areaUnitId')}
                                    >
                                        {getSubCategoryByCategoryType(CategoryType.AREA_UNIT)?.map(
                                            (unit) => (
                                                <option
                                                    key={unit.subCategoryId}
                                                    value={unit.subCategoryId}
                                                >
                                                    {unit.subCategoryName}
                                                </option>
                                            ),
                                        )}
                                    </SelectNative>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Số lượng hiện tại */}
                    {/* <FormField
                        control={form.control}
                        name="currentQuantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số lượng hiện tại</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Nhập số lượng hiện tại"
                                        min={0}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

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
                                        placeholder="Nhập số lượng"
                                        type="number"
                                        disabled
                                        {...field}
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

                    {/* Khu vực chăn nuôi */}
                    {/* <FormField
                        control={form.control}
                        name="breedingAreaId"
                        render={({ field }) => (
                            <FormItem className="mt-[-6px]">
                                <FormLabel>Khu vực chăn nuôi</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập khu vực chăn nuôi"
                                        {...field}
                                        value={
                                            JSON.parse(
                                                sessionStorage.getItem('breedingAreas') || '[]',
                                            ).find(
                                                (area: any) => area.breedingAreaId === field.value,
                                            )?.breedingAreaName
                                        }
                                        disabled
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Mục đích */}
                    <FormField
                        control={form.control}
                        name="purposeId"
                        render={({ field }) => (
                            <FormItem className="mt-[-8px]">
                                <FormLabel>Loại gà</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại gà" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {getSubCategoryByCategoryType(
                                                CategoryType.CHICKEN,
                                            )?.map((chicken) => (
                                                <SelectItem
                                                    key={chicken.subCategoryId}
                                                    value={chicken.subCategoryId}
                                                >
                                                    {chicken.subCategoryName}
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
                            <FormItem className="col-span-2">
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Nhập mô tả" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="mx-auto mt-6 w-60">
                    Gửi
                </Button>
            </form>
        </Form>
    );
}
