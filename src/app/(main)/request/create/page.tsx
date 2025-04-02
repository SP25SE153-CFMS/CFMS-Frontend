'use client';

import type React from 'react';
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ClipboardList, Plus, Trash2 } from 'lucide-react';
import { currentUser } from '@/utils/data/mock.data';
import dayjs from 'dayjs';
import { farms } from '@/utils/data/table.data';

const products = [
    { id: '1', name: 'Gà giống', unit: 'con' },
    { id: '2', name: 'Thức ăn gà', unit: 'kg' },
    { id: '3', name: 'Thuốc', unit: 'lọ' },
];

interface ProductItem {
    productId: string;
    amount: string;
}

export default function CreateRequestPage() {
    const [requestType, setRequestType] = useState('import');
    const [location, setLocation] = useState('');
    const [productItems, setProductItems] = useState<ProductItem[]>([
        { productId: '', amount: '' },
    ]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Form submitted', { requestType, location, productItems });
        // Xử lý gửi form ở đây
    };

    const addProductItem = () => {
        setProductItems([...productItems, { productId: '', amount: '' }]);
    };

    const removeProductItem = (index: number) => {
        const newProductItems = productItems.filter((_, i) => i !== index);
        setProductItems(newProductItems);
    };

    const updateProductItem = (index: number, field: 'productId' | 'amount', value: string) => {
        const newProductItems = [...productItems];
        newProductItems[index][field] = value;
        setProductItems(newProductItems);
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                        <ClipboardList className="mr-2" />
                        Tạo Phiếu Yêu Cầu
                    </CardTitle>
                    <CardDescription>Điền thông tin chi tiết cho phiếu yêu cầu</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="requestType">Loại phiếu</Label>
                                <Select
                                    onValueChange={setRequestType}
                                    required
                                    defaultValue="import"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại phiếu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="export">Xuất kho</SelectItem>
                                        <SelectItem value="import">Nhập kho</SelectItem>
                                        <SelectItem value="maintenance">Bảo trì</SelectItem>
                                        <SelectItem value="cancelMaintenance">
                                            Huỷ bảo trì
                                        </SelectItem>
                                        <SelectItem value="inventory">Kiểm kê</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {['maintenance', 'inventory', 'cancelMaintenance'].includes(
                                requestType,
                            ) && (
                                <div className="space-y-2">
                                    <Label htmlFor="location">Vị trí chuồng/kho</Label>
                                    <Select onValueChange={setLocation} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn vị trí" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {farms.map((farm) => (
                                                <SelectItem key={farm.farmId} value={farm.farmId}>
                                                    Kho {farm.farmName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {['export', 'import'].includes(requestType) && (
                                <div className="space-y-2">
                                    <Label htmlFor="storageLocation">Vị trí kho</Label>
                                    <Select onValueChange={setLocation} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn vị trí kho" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {farms.map((farm) => (
                                                <SelectItem key={farm.farmId} value={farm.farmId}>
                                                    Kho {farm.farmName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="createdAt">Ngày tạo</Label>
                                <Input
                                    id="createdAt"
                                    type="date"
                                    value={dayjs(new Date()).format('YYYY-MM-DD')}
                                    disabled
                                    className="bg-gray-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="createdBy">Người tạo</Label>
                                <Input
                                    id="createdBy"
                                    value={currentUser.fullName}
                                    disabled
                                    className="bg-gray-200"
                                />
                            </div>
                        </div>

                        {['export', 'import'].includes(requestType) && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4">Danh sách sản phẩm</h3>
                                {productItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md mb-4"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor={`product-${index}`}>Sản phẩm</Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    updateProductItem(index, 'productId', value)
                                                }
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn sản phẩm" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map((sp) => (
                                                        <SelectItem key={sp.id} value={sp.id}>
                                                            {sp.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`amount-${index}`}>Số lượng</Label>
                                            <Input
                                                id={`amount-${index}`}
                                                type="number"
                                                min={0}
                                                placeholder="Nhập số lượng"
                                                required
                                                value={item.amount}
                                                onChange={(e) =>
                                                    updateProductItem(
                                                        index,
                                                        'amount',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        {index > 0 && (
                                            <div className="md:col-span-2 flex justify-end">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => removeProductItem(index)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Xóa sản phẩm
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <Button type="button" variant="outline" onClick={addProductItem}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm sản phẩm
                                </Button>
                            </div>
                        )}

                        <div className="mt-6 space-y-2">
                            <Label htmlFor="note">Ghi chú</Label>
                            <Textarea id="note" placeholder="Nhập ghi chú (nếu có)" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="mx-auto">
                            Tạo phiếu yêu cầu
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
