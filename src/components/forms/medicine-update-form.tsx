import { updateMedicine } from '@/services/medicine.service';
import { Medicine, MedicineSchema } from '@/utils/schemas/medicine.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SubCategory } from '@/utils/schemas/sub-category.schema';
import { getSubDisease } from '@/services/category.service';
import { generateCode } from '@/utils/functions/generate-code.function';
import { Loader2 } from 'lucide-react';

interface UpdateMedicineProps {
    medicine: Medicine;
    closeModal: () => void;
}

export default function UpdateMedicineForm({ medicine, closeModal }: UpdateMedicineProps) {
    const formattedDefaults = {
        ...medicine,
        expiryDate: medicine.expiryDate
            ? dayjs(medicine.expiryDate).format('YYYY-MM-DD')
            : dayjs().format('YYYY-MM-DD'),
        productionDate: medicine.productionDate
            ? dayjs(medicine.productionDate).format('YYYY-MM-DD')
            : dayjs().format('YYYY-MM-DD'),
    };

    const form = useForm<Medicine>({
        resolver: zodResolver(MedicineSchema),
        defaultValues: formattedDefaults,
        mode: 'onChange',
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updateMedicine,
        onSuccess: () => {
            closeModal();
            queryClient.invalidateQueries({ queryKey: ['medicines'] });
            toast.success('Cập nhật thực phẩm thành công');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
        },
    });

    const onSubmit = async (values: Medicine) => {
        const formattedData = {
            ...values,
            expiryDate: dayjs(values.expiryDate).format('YYYY-MM-DD'),
            productionDate: dayjs(values.productionDate).format('YYYY-MM-DD'),
        };

        console.log('Medicine update submit: ', formattedData);
        await mutation.mutateAsync(formattedData);
    };

    const onError = (error: any) => {
        console.error(error);
    };

    const { data: subDisease = [] } = useQuery<SubCategory[]>({
        queryKey: ['subDisease'],
        queryFn: () => getSubDisease(),
    });

    const handleGenerateCode = (e: React.FocusEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const existingCodes = new Set(
            JSON.parse(sessionStorage.getItem('medicines') || '[]').map(
                (medicine: Medicine) => medicine.medicineCode,
            ),
        );

        let code;
        let index = 1;
        do {
            code = generateCode(input, index);
            index++;
        } while (existingCodes.has(code));

        form.setValue('medicineCode', code);
        form.setValue('medicineName', input);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Hidden foodId field */}
                    <input type="hidden" {...form.register('medicineId')} />

                    {/* Medicine name */}
                    <FormField
                        control={form.control}
                        name="medicineName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên thuốc</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input
                                            placeholder="Nhập tên thuốc..."
                                            {...field}
                                            onBlur={handleGenerateCode}
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Medicine code */}
                    <FormField
                        control={form.control}
                        name="medicineCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã thuốc</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input placeholder="Nhập mã thuốc..." readOnly {...field} />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Disease Id */}
                    <FormField
                        control={form.control}
                        name="diseaseId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chất liệu</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    subDisease.find(
                                                        (d) => d.subCategoryId === field.value,
                                                    )?.subCategoryName || 'Chọn chất liệu'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subDisease.map((d) => (
                                                <SelectItem
                                                    key={d.subCategoryId}
                                                    value={d.subCategoryId}
                                                >
                                                    {d.subCategoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Usage */}
                    <FormField
                        control={form.control}
                        name="usage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ghi chú</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input placeholder="Ghi chú..." {...field} />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Dosage Form */}
                    <FormField
                        control={form.control}
                        name="dosageForm"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ghi chú</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input placeholder="Ghi chú..." {...field} />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Storage condition */}
                    <FormField
                        control={form.control}
                        name="storageCondition"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ghi chú</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input placeholder="Ghi chú..." {...field} />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Production date */}
                    <FormField
                        control={form.control}
                        name="productionDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày sản xuất</FormLabel>
                                <FormControl>
                                    <Input placeholder="DD-MM-YYYY" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Expiry date */}
                    <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hạn sử dụng</FormLabel>
                                <FormControl>
                                    <Input placeholder="DD-MM-YYYY" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    className="ml-auto mt-6 w-40 flex"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Cập nhật
                </Button>
            </form>
        </Form>
    );
}
