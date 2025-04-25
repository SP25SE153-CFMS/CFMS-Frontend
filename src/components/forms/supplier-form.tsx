'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Phone, MapPin, CreditCard, Save, X } from 'lucide-react';
import {
    CreateSupplier,
    CreateSupplierSchema,
    type Supplier,
    SupplierSchema,
} from '@/utils/schemas/supplier.schema';
import { createSupplier, updateSupplier } from '@/services/supplier.service';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateCode } from '@/utils/functions/generate-code.function';
import { Loader2 } from 'lucide-react';

interface SupplierFormProps {
    defaultValues?: Partial<Supplier>;
    closeDialog: () => void;
}

export default function SupplierForm({ defaultValues, closeDialog }: SupplierFormProps) {
    // Get active farm từ sessionStorage
    const activeFarm = JSON.parse(sessionStorage.getItem('activeFarm') || '{}');
    // console.log('Active farm: ', activeFarm);
    // Get farm id từ active farm
    const farmId = activeFarm?.farmId ?? '';
    // console.log('Farm ID form: ', farmId);

    const isUpdate = !!defaultValues?.supplierId;

    const form = useForm<Supplier>({
        resolver: zodResolver(isUpdate ? SupplierSchema : CreateSupplierSchema),
        defaultValues: {
            supplierName: '',
            supplierCode: '',
            address: '',
            phoneNumber: '',
            bankAccount: '',
            status: 1,
            ...(isUpdate ? defaultValues : { farmId, ...defaultValues }),
        },
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: defaultValues ? updateSupplier : createSupplier,
        onSuccess: () => {
            closeDialog();
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            toast.success(
                defaultValues ? 'Cập nhật nhà cung cấp thành công' : 'Tạo nhà cung cấp thành công',
            );
        },
        onError: (error: any) => {
            console.error('Lỗi API:', error); // Log toàn bộ error object
            toast.error(error?.response?.data?.message || error?.message || 'Lỗi không xác định');
        },
    });

    // Form submit handler
    async function onSubmit(values: Supplier) {
        console.log('Dữ liệu gửi lên API:', values);
        mutation.mutate(values);
    }

    // Form error handler
    const onError = (error: any) => {
        console.error(error);
    };

    const handleGenerateCode = (e: React.FocusEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const existingCodes = new Set(
            JSON.parse(sessionStorage.getItem('suppliers') || '[]').map(
                (supplier: Supplier) => supplier.supplierCode,
            ),
        );

        let code;
        let index = 1;
        do {
            code = generateCode(input, index);
            index++;
        } while (existingCodes.has(code));

        form.setValue('supplierCode', code);
        form.setValue('supplierName', input);
    };
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    {defaultValues?.supplierId ? 'Cập nhật nhà cung cấp' : 'Thêm nhà cung cấp mới'}
                </CardTitle>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Supplier Name */}
                            <FormField
                                control={form.control}
                                name="supplierName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Nhà cung cấp</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Nhập tên nhà cung cấp"
                                                    className="pl-10"
                                                    {...field}
                                                    onBlur={handleGenerateCode}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Supplier Code */}
                            <FormField
                                control={form.control}
                                name="supplierCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Mã nhà cung cấp</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nhập mã nhà cung cấp"
                                                readOnly
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Phone Number */}
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Số điện thoại</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Nhập số điện thoại"
                                                    className="pl-10"
                                                    {...field}
                                                    onChange={(e) => {
                                                        // Loại bỏ khoảng trắng khi người dùng nhập
                                                        const value = e.target.value.replace(
                                                            /\s+/g,
                                                            '',
                                                        );
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Bank Account */}
                            <FormField
                                control={form.control}
                                name="bankAccount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            Tài khoản ngân hàng
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Nhập tài khoản ngân hàng"
                                                    className="pl-10"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Address */}
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Địa chỉ</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Nhập địa chỉ"
                                                className="pl-10"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Trạng thái</FormLabel>
                                    <Select
                                        onValueChange={(value) =>
                                            field.onChange(Number.parseInt(value))
                                        }
                                        defaultValue={field.value.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">Đang hoạt động</SelectItem>
                                            <SelectItem value="0">Ngừng hoạt động</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={closeDialog}>
                            <X className="mr-2 h-4 w-4" /> Hủy
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            <Save className="mr-2 h-4 w-4" /> Lưu
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
