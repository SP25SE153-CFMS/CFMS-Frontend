'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import config from '@/configs';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { ArrowLeftRight, Package, Clipboard, User, ArrowLeft, Save } from 'lucide-react';

// Data giả bên request
const requestData = {
    inventoryRequestId: 'req-001',
    requestType: 'export',
    ware: 'Kho A',
    createBy: 'Ngọc Anh',
    productItems: [
        { id: '1', name: 'Cám A1', quantity: '100', unit: 'Bao' },
        { id: '2', name: 'Thóc B1', quantity: '500', unit: 'Bao' },
    ],
};

export default function CreateReceipt() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        requestType: requestData.requestType,
        ware: requestData.ware,
        createBy: requestData.createBy,
        productItems: requestData.productItems,
        note: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            // console.log('Form submitted:', formData);
            setIsSubmitting(false);
            // TODO: Khi có API, gọi API tại đây
            router.push(config.routes.inventoryReceipt);
        }, 1000);
    };

    return (
        <div className="container mx-auto p-4 py-8">
            <Card className="max-w-4xl mx-auto shadow-lg border-t-4 border-t-primary">
                <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Clipboard className="h-5 w-5" />
                                Tạo phiếu {formData.requestType === 'import' ? 'nhập' : 'xuất'}
                                <Badge
                                    variant={
                                        formData.requestType === 'import' ? 'default' : 'secondary'
                                    }
                                    className="ml-2"
                                >
                                    {formData.requestType === 'import' ? 'Nhập kho' : 'Xuất kho'}
                                </Badge>
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Mã phiếu: {requestData.inventoryRequestId}
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="px-3 py-1 text-sm font-normal">
                            {new Date().toLocaleDateString('vi-VN')}
                        </Badge>
                    </div>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="bg-muted/40 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Loại phiếu */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <ArrowLeftRight className="h-4 w-4" />
                                        Loại phiếu
                                    </Label>
                                    <Input
                                        value={formData.requestType === 'import' ? 'Nhập' : 'Xuất'}
                                        disabled
                                        className="bg-background"
                                    />
                                </div>

                                {/* Kho */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        Kho
                                    </Label>
                                    <Input
                                        value={formData.ware}
                                        disabled
                                        className="bg-background"
                                    />
                                </div>

                                {/* Tạo bởi */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Người tạo
                                    </Label>
                                    <Input
                                        value={formData.createBy}
                                        disabled
                                        className="bg-background"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div className="w-full">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Danh sách sản phẩm
                            </h3>
                            <Separator className="mb-4" />

                            <div className="grid grid-cols-1 gap-4">
                                {formData.productItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="border p-4 rounded-lg hover:border-primary transition-colors bg-card"
                                    >
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="flex-1 space-y-2">
                                                <Label>Tên sản phẩm</Label>
                                                <Input
                                                    value={item.name}
                                                    disabled
                                                    className="bg-background"
                                                />
                                            </div>
                                            <div className="md:w-1/4 space-y-2">
                                                <Label>Số lượng</Label>
                                                <Input
                                                    value={item.quantity}
                                                    disabled
                                                    className="bg-background"
                                                />
                                            </div>
                                            <div className="md:w-1/4 space-y-2">
                                                <Label>Đơn vị</Label>
                                                <Input
                                                    value={item.unit}
                                                    disabled
                                                    className="bg-background"
                                                />
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="mt-3">
                                            Sản phẩm {index + 1}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ghi chú */}
                        <div className="pt-2">
                            <Label htmlFor="note" className="flex items-center gap-2 mb-2">
                                <Clipboard className="h-4 w-4" />
                                Ghi chú
                            </Label>
                            <Textarea
                                id="note"
                                name="note"
                                placeholder="Nhập ghi chú (nếu có)"
                                onChange={handleChange}
                                className="min-h-[100px]"
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="border-t pt-6 flex flex-col sm:flex-row sm:justify-between gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push(config.routes.inventoryReceipt)}
                            className="w-full sm:w-auto"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Trở về
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                            <Save className="mr-2 h-4 w-4" />
                            {isSubmitting
                                ? 'Đang xử lý...'
                                : `Tạo phiếu ${formData.requestType === 'import' ? 'nhập' : 'xuất'}`}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
