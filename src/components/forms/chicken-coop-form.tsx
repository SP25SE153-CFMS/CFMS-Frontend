'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ChickenCoop, CreateChickenCoopSchema } from '@/utils/schemas/chicken-coop.schema';
import { BreedingArea } from '@/utils/schemas/breeding-area.schema';
import { createChickenCoop, updateChickenCoop } from '@/services/chicken-coop.service';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBreedingAreasByFarmId } from '@/services/breeding-area.service';
import { ChickenCoopStatus, chickenCoopStatusLabels } from '@/utils/enum/status.enum';
import { mapEnumToValues } from '@/utils/functions/enum.function';
import AutoForm from '../ui/auto-form';
import { subCategories } from '@/utils/data/table.data';
import { getCookie } from 'cookies-next';
import config from '@/configs';

interface ChickenCoopFormProps {
    defaultValues?: Partial<ChickenCoop>;
    closeDialog: () => void;
}

export default function ChickenCoopForm({ defaultValues, closeDialog }: ChickenCoopFormProps) {
    const { data: breedingAreas } = useQuery({
        queryKey: ['breedingAreas'],
        queryFn: () => getBreedingAreasByFarmId(getCookie(config.cookies.farmId) ?? ''),
    });

    // Query client
    const queryClient = useQueryClient();

    // Mutations for creating and updating
    const mutation = useMutation({
        mutationFn: defaultValues ? updateChickenCoop : createChickenCoop,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['chicken-coops'] });
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
    async function onSubmit(values: any) {
        mutation.mutate(values);
    }

    return (
        <AutoForm
            values={defaultValues}
            onSubmit={onSubmit}
            formSchema={CreateChickenCoopSchema}
            fieldConfig={{
                status: {
                    fieldType: ({ field }) => (
                        <FormItem>
                            <FormLabel>Trạng thái</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mapEnumToValues(ChickenCoopStatus).map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {chickenCoopStatusLabels[status]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    ),
                },
                description: {
                    label: 'Mô tả',
                    fieldType: 'textarea',
                },
                area: {
                    label: 'Diện tích',
                },
                capacity: {
                    label: 'Sức chứa',
                },
                currentQuantity: {
                    label: 'Số lượng hiện tại',
                },
                purposeId: {
                    fieldType: ({ field }) => (
                        <FormItem>
                            <FormLabel>Mục đích nuôi</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn mục đích nuôi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subCategories?.map((subCategory) => (
                                            <SelectItem
                                                key={subCategory.subCategoryId}
                                                value={subCategory.subCategoryId}
                                            >
                                                {subCategory.subCategoryName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    ),
                },
                breedingAreaId: {
                    fieldType: ({ field }) => (
                        <FormItem>
                            <FormLabel>Khu vực chăn nuôi</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn khu vực" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {breedingAreas?.map((area: BreedingArea) => (
                                            <SelectItem
                                                key={area.breedingAreaId}
                                                value={area.breedingAreaId}
                                            >
                                                {area.breedingAreaName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    ),
                },
            }}
        >
            <Button type="submit" className="mx-auto w-60">
                Gửi
            </Button>
        </AutoForm>
    );
}
