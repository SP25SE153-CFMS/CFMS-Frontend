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
import * as z from 'zod';
import { Building2, Phone, MapPin, CreditCard, Save, X } from 'lucide-react';

interface SupplierFormProps {
    closeDialog: () => void;
}

// Form validation schema
const formSchema = z.object({
    supplierName: z.string().min(2, { message: 'Supplier name is required' }),
    supplierCode: z.string().min(1, { message: 'Supplier code is required' }),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
    bankAccount: z.string().optional(),
    status: z.coerce.number(),
});

export default function SupplierForm({ closeDialog }: SupplierFormProps) {
    // Initialize form with react-hook-form and zod validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            supplierName: '',
            supplierCode: '',
            address: '',
            phoneNumber: '',
            bankAccount: '',
            status: 1,
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log('Supplier Data Submitted:', values);
        // Add form submission logic here
        closeDialog();
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Add New Supplier</CardTitle>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                            <Input placeholder="Nhập mã nhà cung cấp" {...field} />
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
                                        <FormLabel className="text-base">Tài khoản ngân hàng</FormLabel>
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
                                            <SelectItem value="1">Active</SelectItem>
                                            <SelectItem value="0">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={closeDialog}>
                            <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                        <Button type="submit">
                            <Save className="mr-2 h-4 w-4" /> Save Supplier
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
