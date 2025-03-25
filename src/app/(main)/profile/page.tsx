import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Mail, MapPin, Phone, User } from 'lucide-react';

export default function ProfilePage() {
    // This would typically come from an API or context
    const userData = {
        userId: '46a0ba68-69c7-440c-ab29-3a1443449449',
        fullName: 'Duong Truong',
        phoneNumber: '+84 987 654 321',
        mail: 'duongtruong@gmail.com',
        avatar: null,
        dateOfBirth: null,
        startDate: null,
        status: '1',
        address: null,
        cccd: null,
        systemRole: '1',
    };

    // Map status code to readable text
    const statusMap = {
        '1': 'Hoạt Động',
        '0': 'Không Hoạt Động',
    };

    // Map system role to readable text
    const roleMap = {
        '1': 'Quản Trị Viên',
        '2': 'Người Dùng',
        '3': 'Khách',
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Hồ Sơ</h1>
                    {/* <Button>Chỉnh Sửa Hồ Sơ</Button> */}
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Left column - User card */}
                    <Card className="md:col-span-1">
                        <CardHeader className="flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={userData.avatar || ''} alt={userData.fullName} />
                                <AvatarFallback className="text-2xl">
                                    {userData.fullName
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                </AvatarFallback>
                            </Avatar>
                            <CardTitle className="mt-4">{userData.fullName}</CardTitle>
                            <CardDescription>
                                {roleMap[userData.systemRole as keyof typeof roleMap]}
                            </CardDescription>
                            <div className="mt-2 flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                {statusMap[userData.status as keyof typeof statusMap]}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{userData.mail}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{userData.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    {userData.address || 'Chưa cung cấp địa chỉ'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    {userData.dateOfBirth || 'Chưa cung cấp ngày sinh'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    CCCD: {userData.cccd || 'Chưa cung cấp'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right column - Tabs with detailed information */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Thông Tin Tài Khoản</CardTitle>
                            <CardDescription>
                                Xem và quản lý thông tin tài khoản của bạn
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="personal" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="personal">Cá Nhân</TabsTrigger>
                                    <TabsTrigger value="security">Bảo Mật</TabsTrigger>
                                    <TabsTrigger value="activity">Hoạt Động</TabsTrigger>
                                </TabsList>
                                <TabsContent value="personal" className="space-y-6 pt-4">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName">Họ và Tên</Label>
                                                <Input
                                                    id="fullName"
                                                    value={userData.fullName}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" value={userData.mail} readOnly />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Số Điện Thoại</Label>
                                                <Input
                                                    id="phone"
                                                    value={userData.phoneNumber}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dob">Ngày Sinh</Label>
                                                <Input
                                                    id="dob"
                                                    value={userData.dateOfBirth || 'Chưa cung cấp'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="address">Địa Chỉ</Label>
                                                <Input
                                                    id="address"
                                                    value={userData.address || 'Chưa cung cấp'}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="id">Căn Cước Công Dân</Label>
                                                <Input
                                                    id="id"
                                                    value={userData.cccd || 'Chưa cung cấp'}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="security" className="space-y-6 pt-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="userId">Mã Người Dùng</Label>
                                            <Input id="userId" value={userData.userId} readOnly />
                                            <p className="text-xs text-muted-foreground">
                                                Đây là mã định danh duy nhất của bạn trong hệ thống.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="role">Vai Trò Hệ Thống</Label>
                                            <Input
                                                id="role"
                                                value={
                                                    roleMap[
                                                        userData.systemRole as keyof typeof roleMap
                                                    ]
                                                }
                                                readOnly
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Trạng Thái Tài Khoản</Label>
                                            <Input
                                                id="status"
                                                value={
                                                    statusMap[
                                                        userData.status as keyof typeof statusMap
                                                    ]
                                                }
                                                readOnly
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="startDate">Ngày Bắt Đầu</Label>
                                            <Input
                                                id="startDate"
                                                value={userData.startDate || 'Chưa cung cấp'}
                                                readOnly
                                            />
                                        </div>
                                        <Separator className="my-4" />
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Mật Khẩu</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value="••••••••"
                                                    readOnly
                                                />
                                                <Button variant="outline">Thay Đổi</Button>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="activity" className="pt-4">
                                    <div className="rounded-md bg-muted p-4 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            Không có hoạt động gần đây để hiển thị
                                        </p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                        {/* <CardFooter className="flex justify-between">
                            <Button variant="outline">Hủy</Button>
                            <Button>Lưu Thay Đổi</Button>
                        </CardFooter> */}
                    </Card>
                </div>
            </div>
        </div>
    );
}
