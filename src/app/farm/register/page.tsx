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
import { Tractor } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DangKyTrangTrai() {
    const [, setFarmImage] = useState<File | null>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        toast('Đăng ký thành công');
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                        <Tractor className="mr-2" />
                        Đăng ký Trang trại Mới
                    </CardTitle>
                    <CardDescription>Điền thông tin chi tiết về trang trại của bạn</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="farmName">Tên trang trại</Label>
                                <Input id="farmName" placeholder="Nhập tên trang trại" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="farmCode">Mã trang trại</Label>
                                <Input id="farmCode" placeholder="Nhập mã trang trại" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Loại hình</Label>
                            <Select required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại hình trang trại" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="organic">Hữu cơ</SelectItem>
                                    <SelectItem value="traditional">Truyền thống</SelectItem>
                                    <SelectItem value="mixed">Kết hợp</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Địa chỉ</Label>
                            <Textarea id="address" placeholder="Nhập địa chỉ trang trại" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="area">Diện tích (ha)</Label>
                                <Input
                                    id="area"
                                    type="number"
                                    placeholder="Nhập diện tích"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="scale">Quy mô</Label>
                                <Select required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn quy mô" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="small">Nhỏ</SelectItem>
                                        <SelectItem value="medium">Vừa</SelectItem>
                                        <SelectItem value="large">Lớn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    placeholder="Nhập số điện thoại"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input id="website" type="url" placeholder="https://example.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="farmImage">Hình ảnh trang trại</Label>
                            <Input
                                id="farmImage"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFarmImage(e.target.files?.[0] || null)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Đăng ký trang trại
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
