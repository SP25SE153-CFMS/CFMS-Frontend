import {
    getSubEquipmentUnit,
    getSubMaterial,
    getSubPackage,
    getSubSize,
    getSubWeight,
} from '@/services/category.service';
import { getWareById } from '@/services/warehouse.service';
import {
    CreateEquipment,
    CreateEquipmentSchema,
    Equipment,
} from '@/utils/schemas/equipment.schema';
import { SubCategory } from '@/utils/schemas/sub-category.schema';
import { Warehouse } from '@/utils/schemas/warehouse.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { createEquipmentInWare } from '@/services/equipment.service';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { generateCode } from '@/utils/functions/generate-code.function';
import { Loader2 } from 'lucide-react';
import { onError } from '@/utils/functions/form.function';
interface CreateEquipmentProps {
    closeDialog: () => void;
}

export default function CreateEquipmentForm({ closeDialog }: CreateEquipmentProps) {
    const [wId, setWId] = useState('');

    const form = useForm<CreateEquipment>({
        resolver: zodResolver(CreateEquipmentSchema),
        defaultValues: {
            equipmentCode: '',
            equipmentName: '',
            materialId: '',
            usage: '',
            warranty: 0,
            size: 0,
            sizeUnitId: '',
            weight: 0,
            weightUnitId: '',
            purchaseDate: dayjs().format('YYYY-MM-DD'),
            unitId: '',
            packageId: '',
            packageSize: 0,
            wareId: '',
        },
        mode: 'onChange',
    });

    // Add this new useEffect to update the form value when wId changes
    useEffect(() => {
        if (wId) {
            form.setValue('wareId', wId);
        }
    }, [wId, form]);

    useEffect(() => {
        const storedWId = sessionStorage.getItem('wareId') ?? '';
        setWId(storedWId);
        form.setValue('wareId', storedWId);
    }, [form]);

    // Gọi data ware để lấy id và tên kho
    const { data: ware } = useQuery<Warehouse>({
        queryKey: ['ware', wId],
        queryFn: () => getWareById(wId),
        enabled: !!wId,
    });

    // Gọi sub package
    const { data: subPack = [] } = useQuery<SubCategory[]>({
        queryKey: ['subPack'],
        queryFn: () => getSubPackage(),
    });

    // Gọi sub unit
    const { data: subUnit = [] } = useQuery<SubCategory[]>({
        queryKey: ['subUnit'],
        queryFn: () => getSubEquipmentUnit(),
    });

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

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createEquipmentInWare,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['equipments'] });
            toast.success('Tạo thiết bị thành công');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
        },
    });

    const onSubmit = async (values: CreateEquipment) => {
        const formattedData = {
            ...values,
            purchaseDate: dayjs(values.purchaseDate).format('YYYY-MM-DD'),
        };

        await mutation.mutateAsync(formattedData);
    };

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
                                            <SelectValue placeholder="Chọn chất liệu" />
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
                                                value={ware?.warehouseName || ''}
                                                disabled
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
                                                {...field}
                                                value="0"
                                                disabled
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
                                            <SelectValue placeholder="Chọn đơn vị độ dài" />
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
                                                {...field}
                                                value="0"
                                                disabled
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
                                            <SelectValue placeholder="Chọn đơn vị khối lượng" />
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
                                                {...field}
                                                value="0"
                                                disabled
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
                                                {subUnit.map((u) => (
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
                                                {subPack.map((p) => (
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
                                                {...field}
                                                value="0"
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
