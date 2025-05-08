'use client';

import type React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ChickenSchema, CreateChickenSchema, type Chicken } from '@/utils/schemas/chicken.schema';
import { createChicken, updateChicken } from '@/services/chicken.service';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSubCategoryByCategoryType } from '@/utils/functions/category.function';
import { CategoryType } from '@/utils/enum/category.enum';
import { CommonStatus } from '@/utils/enum/status.enum';
import { generateCode } from '@/utils/functions/generate-code.function';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import useQueryParams from '@/hooks/use-query-params';
import { Card, CardContent } from '@/components/ui/card';
import { WareStockResponse } from '@/utils/types/custom.type';

// interface ChickenDetail {
//     weight: number;
//     quantity: number;
//     gender: number;
// }

interface ChickenFormProps {
    defaultValues?: Partial<Chicken>;
    closeDialog: () => void;
    unitName?: string;
    packageUnitName?: string;
}

export default function ChickenForm({
    defaultValues,
    closeDialog,
    unitName,
    packageUnitName,
}: ChickenFormProps) {
    console.log(defaultValues);

    // Get query params
    const { w: wareId } = useQueryParams();

    // Initialize form
    const form = useForm<Chicken>({
        resolver: zodResolver(defaultValues ? ChickenSchema : CreateChickenSchema),
        defaultValues: {
            chickenId: '',
            chickenCode: '',
            chickenName: '',
            description: '',
            status: CommonStatus.ACTIVE,
            chickenTypeId: '',
            unitId:
                getSubCategoryByCategoryType(CategoryType.C_QUANTITY_UNIT)?.find(
                    (x) => x.subCategoryName === unitName,
                )?.subCategoryId || '',
            packageId:
                getSubCategoryByCategoryType(CategoryType.C_PACKAGE_UNIT)?.find(
                    (x) => x.subCategoryName === packageUnitName,
                )?.subCategoryId || '',
            packageSize: 0,
            wareId: sessionStorage.getItem('wareId') || wareId || '',
            chickenDetails: [],
            ...defaultValues,
        },
    });

    console.log(getSubCategoryByCategoryType(CategoryType.C_PACKAGE_UNIT));
    console.log(getSubCategoryByCategoryType(CategoryType.C_QUANTITY_UNIT));

    // Setup field array for chicken details
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'chickenDetails',
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateChicken : createChicken,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['chickens'] });
            toast.success(
                defaultValues ? 'Cập nhật giống gà thành công' : 'Tạo giống gà thành công',
            );
        },
        onError: (error: any) => {
            console.error(error);
            toast(error?.response?.data?.message, { icon: '⚠️' });
        },
    });

    // Form submit handler
    async function onSubmit(values: Chicken) {
        const newValues = {
            ...values,
            id: values.chickenId,
        };
        console.log("Form: ", newValues);
        mutation.mutate(defaultValues ? newValues : values);
    }

    const handleGenerateCode = (e: React.FocusEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const existingCodes = new Set(
            JSON.parse(sessionStorage.getItem('chickens') || '[]').map(
                (chicken: Chicken) => chicken.chickenCode,
            ),
        );

        let code;
        let index = 1;
        do {
            code = generateCode(input, index);
            index++;
        } while (existingCodes.has(code));

        form.setValue('chickenCode', code);
        form.setValue('chickenName', input);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Chicken Name */}
                    <FormField
                        control={form.control}
                        name="chickenName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên giống gà</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập tên giống gà"
                                        {...field}
                                        onBlur={handleGenerateCode}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Chicken Code */}
                    <FormField
                        control={form.control}
                        name="chickenCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã giống gà</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Nhập mã giống gà"
                                        readOnly
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập mô tả" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Status */}
                    {/* <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trạng thái</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        defaultValue={field.value.toString()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Hoạt động</SelectItem>
                                            <SelectItem value="0">Ngừng hoạt động</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* Chicken Type ID */}
                    <FormField
                        control={form.control}
                        name="chickenTypeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại gà</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn loại gà" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getSubCategoryByCategoryType(CategoryType.CHICKEN).map(
                                                (status) => (
                                                    <SelectItem
                                                        key={status.subCategoryId}
                                                        value={status.subCategoryId}
                                                    >
                                                        {status.subCategoryName}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Unit Select */}
                    <FormField
                        control={form.control}
                        name="unitId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Đơn vị</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn đơn vị" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getSubCategoryByCategoryType(
                                                CategoryType.C_QUANTITY_UNIT,
                                            ).map((u) => (
                                                <SelectItem
                                                    key={u.subCategoryId}
                                                    value={u.subCategoryId}
                                                >
                                                    {u.subCategoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Package Select */}
                    <FormField
                        control={form.control}
                        name="packageId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Đơn vị đóng gói</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn đơn vị đóng gói" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getSubCategoryByCategoryType(
                                                CategoryType.C_PACKAGE_UNIT,
                                            ).map((p) => (
                                                <SelectItem
                                                    key={p.subCategoryId}
                                                    value={p.subCategoryId}
                                                >
                                                    {p.subCategoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Package size */}
                    <FormField
                        control={form.control}
                        name="packageSize"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Quy cách tính</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input
                                                type="number"
                                                min={0}
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(Number(e.target.value))
                                                }
                                                className="bg-background"
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            );
                        }}
                    />

                    {/* Ware */}
                    <FormField
                        control={form.control}
                        name="wareId"
                        render={() => {
                            const wares = JSON.parse(
                                sessionStorage.getItem('wares') || '[]',
                            ) as WareStockResponse[];
                            const wId = sessionStorage.getItem('wareId') || wareId;
                            const ware = wares.find((ware) => ware.wareId === wId);

                            return (
                                <FormItem>
                                    <FormLabel>Kho</FormLabel>
                                    <FormControl>
                                        <Input type="text" value={ware?.warehouseName} disabled />
                                    </FormControl>
                                </FormItem>
                            );
                        }}
                    />
                </div>

                {/* Chicken Details Section */}
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Chi tiết giống gà</h3>

                    {fields.map((field, index) => (
                        <Card key={field.id} className="mb-4">
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Weight */}
                                    <FormField
                                        control={form.control}
                                        name={`chickenDetails.${index}.weight`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Trọng lượng</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        placeholder="0"
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

                                    {/* Quantity */}
                                    <FormField
                                        control={form.control}
                                        name={`chickenDetails.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Số lượng</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        placeholder="0"
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

                                    {/* Gender */}
                                    <FormField
                                        control={form.control}
                                        name={`chickenDetails.${index}.gender`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Giới tính</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={(value) =>
                                                            field.onChange(Number(value))
                                                        }
                                                        defaultValue={field.value.toString()}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn giới tính" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="0">Trống</SelectItem>
                                                            <SelectItem value="1">Mái</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Xóa
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ weight: 0, quantity: 0, gender: 0 })}
                        className="mt-2"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Thêm chi tiết
                    </Button>
                </div>

                <Button type="submit" className="mx-auto mt-6 w-60" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Gửi
                </Button>
            </form>
        </Form>
    );
}
