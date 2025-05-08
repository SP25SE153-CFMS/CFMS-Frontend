import { CreateMedicine, CreateMedicineSchema, Medicine } from '@/utils/schemas/medicine.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMedicine } from '@/services/medicine.service';
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { generateCode } from '@/utils/functions/generate-code.function';
import { Loader2 } from 'lucide-react';
import { onError } from '@/utils/functions/form.function';
import { getSubCategoryByCategoryType } from '@/utils/functions/category.function';
import { CategoryType } from '@/utils/enum/category.enum';

interface CreateMedicineProps {
    closeDialog: () => void;
}

export default function CreateMedicineForm({ closeDialog }: CreateMedicineProps) {
    const form = useForm<CreateMedicine>({
        resolver: zodResolver(CreateMedicineSchema),
        defaultValues: {
            medicineCode: '',
            medicineName: '',
            usage: '',
            dosageForm: '',
            storageCondition: '',
            diseaseId: '',
            productionDate: dayjs().format('YYYY-MM-DD'),
            expiryDate: dayjs().format('YYYY-MM-DD'),
            unitId: '',
            packageId: '',
            packageSize: 0,
            wareId: sessionStorage.getItem('wareId') ?? '',
        },
        mode: 'onChange',
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createMedicine,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['medicines'] });
            toast.success('Tạo thuốc thành công');
        },
        onError: (error: any) => {
            console.error(error);
            toast(error?.response?.data?.message || 'Có lỗi xảy ra', { icon: '⚠️' });
        },
    });

    const onSubmit = async (values: CreateMedicine) => {
        const formattedData = {
            ...values,
            productionDate: dayjs(values.productionDate).format('YYYY-MM-DD'),
            expiryDate: dayjs(values.expiryDate).format('YYYY-MM-DD'),
        };

        await mutation.mutateAsync(formattedData);
    };

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

                    {/* Medicine name */}
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

                    {/* Disease */}
                    <FormField
                        control={form.control}
                        name="diseaseId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại bệnh</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn loại" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getSubCategoryByCategoryType(
                                                CategoryType.DISEASE,
                                            )?.map((d) => (
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

                    {/* Storage condition */}
                    <FormField
                        control={form.control}
                        name="storageCondition"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Điều kiện bảo quản</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input
                                            placeholder="Nhập điều kiện bảo quản..."
                                            {...field}
                                        />
                                    </div>
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
                                <FormLabel>Cách sử dụng</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input placeholder="Nhập cách sử dụng..." {...field} />
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
                                <FormLabel>Liều lượng</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input placeholder="Vd: 1 lần/khu vực" {...field} />
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

                    <div className="flex space-x-8">
                        {/* Unit Select */}
                        <FormField
                            control={form.control}
                            name="unitId"
                            render={({ field }) => (
                                <FormItem className="mt-8">
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
                                                    CategoryType.M_QUANTITY_UNIT,
                                                )?.map((u) => (
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
                                <FormItem className="mt-8">
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
                                                    CategoryType.M_PACKAGE_UNIT,
                                                )?.map((p) => (
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
                    </div>

                    {/* Ware */}
                    <FormField
                        control={form.control}
                        name="wareId"
                        render={() => {
                            // useEffect(() => {
                            //     field.onChange(wId);
                            // }, [wId, field]);
                            return (
                                <FormItem>
                                    <FormLabel>Kho</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input
                                                value={
                                                    sessionStorage.getItem('warehouseName') || ''
                                                }
                                                disabled
                                                className="bg-background"
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            );
                        }}
                    />
                </div>

                <Button
                    type="submit"
                    className="ml-auto mt-6 w-40 flex"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Tạo
                </Button>
            </form>
        </Form>
    );
}
