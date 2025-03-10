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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CreateFlockSchema, Flock, FlockSchema } from '@/utils/schemas/flock.schema';
import { createFlock, updateFlock } from '@/services/flock.service';
import toast from 'react-hot-toast';

interface FlockFormProps {
    defaultValues?: Partial<Flock>;
    closeDialog: () => void;
}

export default function FlockForm({ defaultValues, closeDialog }: FlockFormProps) {
    // Initialize form
    const form = useForm<Flock>({
        resolver: zodResolver(defaultValues ? FlockSchema : CreateFlockSchema),
        defaultValues: {
            flockId: '',
            quantity: 0,
            name: '',
            startDate: new Date().toISOString(),
            status: 'in_farm',
            description: '',
            endDate: null,
            avgWeight: 0,
            mortalityRate: 0,
            lastHealthCheck: null,
            gender: 'mixed',
            purposeId: 1,
            breedId: 1,
            housingId: 1,
            ...defaultValues,
        },
    });

    // Form submit handler
    async function onSubmit(values: Flock) {
        if (defaultValues) {
            await updateFlock(values);
            toast.success('Cập nhật đàn thành công');
        } else {
            await createFlock(values);
            toast.success('Tạo đàn thành công');
        }
        closeDialog();
    }

    // Form error handler
    const onError = (error: any) => {
        console.error(error);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
                <div className="grid grid-cols-1 gap-6 mx-1">
                    {/* Tên đàn */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên đàn</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Nhập tên đàn" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Số lượng */}
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số lượng</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Nhập số lượng"
                                        min={0}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Trạng thái */}
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trạng thái</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="in_farm">
                                                Trong trang trại
                                            </SelectItem>
                                            <SelectItem value="sold">Đã bán</SelectItem>
                                            <SelectItem value="removed">Đã loại bỏ</SelectItem>
                                            <SelectItem value="dead">Đã chết</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Trọng lượng trung bình */}
                    <FormField
                        control={form.control}
                        name="avgWeight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trọng lượng trung bình (kg)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Nhập trọng lượng trung bình"
                                        min={0}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tỷ lệ tử vong */}
                    <FormField
                        control={form.control}
                        name="mortalityRate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tỷ lệ tử vong (%)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Nhập tỷ lệ tử vong"
                                        min={0}
                                        {...field}
                                    />
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
