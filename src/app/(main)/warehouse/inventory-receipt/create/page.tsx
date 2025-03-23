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
import config from '@/configs';
import { currentUser } from '@/utils/data/mock.data';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Data giả bên request
const requestData = {
    inventoryRequestId: 'req-001',
    requestType: 'export',
    wareFrom: 'Kho A',
    wareTo: 'Kho B',
    createBy: 'Ngọc Anh',
    productItems: [
        { id: '1', name: 'Cám A1', quantity: '100', unit: 'Bao' },
        { id: '2', name: 'Thóc B1', quantity: '500', unit: 'Bao' },
    ],
};

export default function CreateReceipt() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        requestType: requestData.requestType,
        wareFrom: requestData.wareFrom,
        wareTo: requestData.wareTo,
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
        console.log('Form submitted:', formData);
        // TODO: Khi có API, gọi API tại đây
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-4xl mx-auto">
                <CardHeader className="text-2xl flex items-center">
                    <CardTitle className="mr-2">
                        Tạo phiếu {formData.requestType === 'import' ? 'nhập' : 'xuất'}
                    </CardTitle>
                    <CardDescription>Điền thông tin chi tiết cho phiếu</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Loại phiếu */}
                            <div className="space-y-2">
                                <Label>Loại phiếu</Label>
                                <Input
                                    value={formData.requestType === 'import' ? 'Nhập' : 'Xuất'}
                                    disabled
                                />
                            </div>

                            {/* Kho xuất */}
                            {formData.requestType === 'export' && (
                                <div className="space-y-2">
                                    <Label>Kho xuất</Label>
                                    <Input value={formData.wareFrom} disabled />
                                </div>
                            )}

                            {/* Kho nhập */}
                            <div className="space-y-2">
                                <Label>Kho nhập</Label>
                                <Input value={formData.wareTo} disabled />
                            </div>

                            {/* Tạo bởi */}
                            <div className="space-y-2">
                                <Label>Người tạo</Label>
                                <Input value={formData.createBy} disabled />
                            </div>

                            {/* Danh sách sản phẩm */}
                            <div className="col-span-2 w-full mt-6">
                                <h3 className="text-lg font-semibold mb-4">Danh sách sản phẩm</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {formData.productItems.map((item) => (
                                        <div key={item.id} className="border p-4 rounded-md">
                                            <div className="space-y-2">
                                                <Label>Tên</Label>
                                                <Input value={item.name} disabled />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Số lượng</Label>
                                                <Input value={item.quantity} disabled />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Đơn vị</Label>
                                                <Input value={item.unit} disabled />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ghi chú */}
                            <div className="col-span-2">
                                <Label htmlFor="note">Ghi chú</Label>
                                <Textarea
                                    id="note"
                                    name="note"
                                    placeholder="Nhập ghi chú (nếu có)"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="ml-auto flex gap-3">
                            {/* Back tạm thời về receipt để test */}
                            <Button
                                variant="outline"
                                onClick={() => router.push(config.routes.inventoryReceipt)}
                            >
                                Trở về
                            </Button>
                            <Button type="submit">
                                Tạo phiếu {formData.requestType === 'import' ? 'nhập' : 'xuất'}
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
