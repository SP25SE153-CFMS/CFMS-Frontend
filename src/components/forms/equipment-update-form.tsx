import { Equipment, EquipmentSchema } from '@/utils/schemas/equipment.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { updateEquipment } from '@/services/equipment.service';
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SubCategory } from '@/utils/schemas/sub-category.schema';
import { getSubMaterial, getSubSize, getSubWeight } from '@/services/category.service';
import { Button } from '../ui/button';
import { generateCode } from '@/utils/functions/generate-code.function';

interface UpdateEquipmentProps {
    equipment: Equipment;
    closeDialog: () => void;
}

export default function UpdateEquipmentForm({ equipment, closeDialog }: UpdateEquipmentProps) {
    const formattedDefaults = {
        ...equipment,
        purchaseDate: equipment.purchaseDate
            ? dayjs(equipment.purchaseDate).format('YYYY-MM-DD')
            : dayjs().format('YYYY-MM-DD'),
    };

    const form = useForm<Equipment>({
        resolver: zodResolver(EquipmentSchema),
        defaultValues: formattedDefaults,
        mode: 'onChange',
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updateEquipment,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['equipments'] });
            toast.success('Cập nhật thực phẩm thành công');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
        },
    });

    const onSubmit = async (values: Equipment) => {
        const formattedData = {
            ...values,
            purchaseDate: dayjs(values.purchaseDate).format('YYYY-MM-DD'),
        };
        console.log('Cập nhật: ', formattedData);
        await mutation.mutateAsync(formattedData);
    };

    const onError = (error: any) => {
        console.error(error);
    };

    // Gọi sub size
    const { data: subSize = [] } = useQuery<SubCategory[]>({
        queryKey: ['subSize'],
        queryFn: () => getSubSize(),
    });

    // Gọi sub weight
    const { data: subWeight = [] } = useQuery<SubCategory[]>({
        queryKey: ['subWeight'],
        queryFn: () => getSubWeight(),
    });

    // Gọi sub material
    const { data: subMaterial = [] } = useQuery<SubCategory[]>({
        queryKey: ['subMaterial'],
        queryFn: () => getSubMaterial(),
    });

    const handleGenerateCode = (e: React.FocusEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const existingCodes = new Set(
            JSON.parse(sessionStorage.getItem('equipments') || '[]').map(
                (equipment: Equipment) => equipment.equipmentCode,
            ),
        );

        let code;
        let index = 1;
        do {
            code = generateCode(input, index);
            index++;
        } while (existingCodes.has(code));

        form.setValue('equipmentCode', code);
        form.setValue('equipmentName', input);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                    {/* Hidden foodId field */}
                    <FormField
                        control={form.control}
                        name="equipmentId"
                        render={({ field }) => <input type="hidden" {...field} />}
                    />

                    {/* Equipment name */}
                    <FormField
                        control={form.control}
                        name="equipmentName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên thiết bị</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input
                                            placeholder="Nhập tên thiết bị..."
                                            {...field}
                                            onBlur={handleGenerateCode}
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Equipment code */}
                    <FormField
                        control={form.control}
                        name="equipmentCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã thiết bị</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input
                                            placeholder="Nhập mã thiết bị..."
                                            readOnly
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Material */}
                    <FormField
                        control={form.control}
                        name="materialId"
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
                                                    subMaterial.find(
                                                        (m) => m.subCategoryId === field.value,
                                                    )?.subCategoryName || 'Chọn chất liệu'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subMaterial.map((m) => (
                                                <SelectItem
                                                    key={m.subCategoryId}
                                                    value={m.subCategoryId}
                                                >
                                                    {m.subCategoryName}
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
                                <FormLabel>Cách sử dụng</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input placeholder="Nhập cách sử dụng..." {...field} />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Purchase date */}
                    <FormField
                        control={form.control}
                        name="purchaseDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày mua</FormLabel>
                                <FormControl>
                                    <Input placeholder="DD-MM-YYYY" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Warranty */}
                    <FormField
                        control={form.control}
                        name="warranty"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Bảo hành</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input
                                                type="number"
                                                value={field.value ?? ''}
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

                    {/* Size */}
                    <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Kích thước</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input
                                                type="number"
                                                value={field.value ?? ''}
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

                    {/* Size Unit */}
                    <FormField
                        control={form.control}
                        name="sizeUnitId"
                        render={({ field }) => (
                            <FormItem className="mt-8">
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    subSize.find(
                                                        (s) => s.subCategoryId === field.value,
                                                    )?.subCategoryName || 'Chọn đơn vị kích thước'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subSize.map((s) => (
                                                <SelectItem
                                                    key={s.subCategoryId}
                                                    value={s.subCategoryId}
                                                >
                                                    {s.subCategoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Weight */}
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Khối lượng</FormLabel>
                                    <FormControl>
                                        <div>
                                            <Input
                                                type="number"
                                                value={field.value ?? ''}
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

                    {/* Weight Unit */}
                    <FormField
                        control={form.control}
                        name="weightUnitId"
                        render={({ field }) => (
                            <FormItem className="mt-8">
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    subWeight.find(
                                                        (w) => w.subCategoryId === field.value,
                                                    )?.subCategoryName || 'Chọn đơn vị khối lượng'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subWeight.map((w) => (
                                                <SelectItem
                                                    key={w.subCategoryId}
                                                    value={w.subCategoryId}
                                                >
                                                    {w.subCategoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="ml-auto mt-6 w-40 flex">
                    Cập nhật
                </Button>
            </form>
        </Form>
    );
}
