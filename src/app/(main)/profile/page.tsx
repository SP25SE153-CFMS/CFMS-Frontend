'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Check, Loader2, Mail, MapPin, Phone, Upload, User, X } from 'lucide-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import toast from 'react-hot-toast';
import { userStatusLabels } from '@/utils/enum/status.enum';
import { getCurrentUser } from '@/services/auth.service';
import { uploadAvatar } from '@/services/user.service';
import { convertToThumbnailUrl } from '@/utils/functions';
import { onError } from '@/utils/functions/form.function';

// Define the user profile schema
const profileSchema = z.object({
    fullName: z.string().min(2, { message: 'Họ và tên phải có ít nhất 2 ký tự' }),
    phoneNumber: z.string().regex(/^[0-9]{10}$/, { message: 'Số điện thoại không hợp lệ' }),
    address: z.string().optional(),
    dateOfBirth: z.string().optional(),
    cccd: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// API function to update user profile
async function updateUserProfile(data: ProfileFormValues) {
    // In a real app, this would be a fetch call to your API
    const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    }

    return response.json();
}

export default function ProfilePage() {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: currentUser } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => getCurrentUser(),
    });

    // Map system role to readable text
    const roleMap = {
        '1': 'Quản Trị Viên',
        '2': 'Người Dùng',
        '3': 'Khách',
    };

    // Initialize form with current user data
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: currentUser?.fullName || '',
            phoneNumber: currentUser?.phoneNumber || '',
            address: currentUser?.address || '',
            dateOfBirth: currentUser?.dateOfBirth || '',
            cccd: currentUser?.cccd || '',
        },
    });

    // Setup mutation for updating profile
    const mutation = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: (data) => {
            // Update the cache with the new user data
            queryClient.setQueryData(['currentUser'], data);
            setIsEditing(false);
            toast.success('Thông tin cá nhân đã được cập nhật.');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message);
        },
    });

    // Handle avatar click to open file dialog
    function handleAvatarClick() {
        fileInputRef.current?.click();
    }

    // Handle file selection
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn một tệp hình ảnh.');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Kích thước tệp không được vượt quá 5MB.');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    }

    // Setup mutation for avatar upload
    const avatarMutation = useMutation({
        mutationFn: uploadAvatar,
        onSuccess: () => {
            // // Update the cache with the new user data including the avatar
            // queryClient.setQueryData(['currentUser'], (oldData: any) => ({
            //     ...oldData,
            //     avatar: data.avatarUrl,
            // }));

            queryClient.invalidateQueries({ queryKey: ['currentUser'] });

            // Reset the avatar preview
            setAvatarPreview(null);
            toast.success('Ảnh đại diện đã được cập nhật.');
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật ảnh đại diện.',
            );
            setAvatarPreview(null);
        },
        onSettled: () => {
            setIsUploading(false);
        },
    });

    // Upload avatar
    function uploadAvatarFile() {
        const file = fileInputRef.current?.files?.[0];
        if (!file) return;

        setIsUploading(true);
        avatarMutation.mutate(file);
    }

    // Cancel avatar upload
    function cancelAvatarUpload() {
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    // Handle form submission
    function onSubmit(data: ProfileFormValues) {
        mutation.mutate(data);
    }

    // Cancel editing
    function cancelEdit() {
        form.reset();
        setIsEditing(false);
    }

    if (!currentUser) {
        return (
            <Avatar className="h-24 w-24">
                {/* <AvatarImage src={currentUser.avatar || ''} alt={currentUser.fullName} /> */}
                <AvatarFallback className="text-2xl">N/A</AvatarFallback>
            </Avatar>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Hồ Sơ</h1>
                    {/* TODO: Add edit button */}
                    {/* {!isEditing && (
                        <Button onClick={() => setIsEditing(true)}>Chỉnh Sửa Hồ Sơ</Button>
                    )} */}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left column - User card */}
                    <Card className="md:col-span-1">
                        <CardHeader className="flex flex-col items-center text-center">
                            <div className="relative">
                                <Avatar
                                    className="h-24 w-24 cursor-pointer border-2 border-primary/20 transition-all hover:border-primary/50"
                                    onClick={handleAvatarClick}
                                >
                                    <AvatarImage
                                        src={
                                            avatarPreview ||
                                            convertToThumbnailUrl(currentUser.avatar || '') ||
                                            ''
                                        }
                                        alt={currentUser.fullName}
                                    />
                                    <AvatarFallback className="text-2xl">
                                        {currentUser.fullName
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1 shadow-sm">
                                    <div className="rounded-full bg-primary p-1">
                                        <Upload className="h-3 w-3 text-primary-foreground" />
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {avatarPreview && (
                                <div className="mt-4 flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={uploadAvatarFile}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                        ) : (
                                            <Check className="mr-2 h-3 w-3" />
                                        )}
                                        Lưu
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={cancelAvatarUpload}
                                        disabled={isUploading}
                                    >
                                        <X className="mr-2 h-3 w-3" />
                                        Hủy
                                    </Button>
                                </div>
                            )}
                            <CardTitle className="mt-4">{currentUser.fullName}</CardTitle>
                            <CardDescription>
                                {roleMap[currentUser.systemRole as keyof typeof roleMap]}
                            </CardDescription>
                            <div className="mt-2 flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                {userStatusLabels[currentUser.status]}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{currentUser.mail}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{form.getValues('phoneNumber')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    {form.getValues('address') || 'Chưa cung cấp địa chỉ'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    {form.getValues('dateOfBirth') || 'Chưa cung cấp ngày sinh'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    CCCD: {form.getValues('cccd') || 'Chưa cung cấp'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right column - Tabs with detailed information */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Thông Tin Tài Khoản</CardTitle>
                            <CardDescription>
                                {isEditing
                                    ? 'Chỉnh sửa thông tin cá nhân của bạn'
                                    : 'Xem và quản lý thông tin tài khoản của bạn'}
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
                                    {isEditing ? (
                                        <Form {...form}>
                                            <form
                                                onSubmit={form.handleSubmit(onSubmit, onError)}
                                                className="space-y-4"
                                            >
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="fullName"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Họ và Tên</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email">Email</Label>
                                                        <Input
                                                            id="email"
                                                            value={currentUser.mail}
                                                            readOnly
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="phoneNumber"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Số Điện Thoại</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="dateOfBirth"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Ngày Sinh</FormLabel>
                                                                <FormControl>
                                                                    <Input type="date" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <FormField
                                                        control={form.control}
                                                        name="address"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Địa Chỉ</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="cccd"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>
                                                                    Căn Cước Công Dân
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </form>
                                        </Form>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="fullName">Họ và Tên</Label>
                                                    <Input
                                                        id="fullName"
                                                        value={form.getValues('fullName')}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input
                                                        id="email"
                                                        value={currentUser.mail}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Số Điện Thoại</Label>
                                                    <Input
                                                        id="phone"
                                                        value={form.getValues('phoneNumber')}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="dob">Ngày Sinh</Label>
                                                    <Input
                                                        id="dob"
                                                        value={
                                                            form.getValues('dateOfBirth') ||
                                                            'Chưa cung cấp'
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="address">Địa Chỉ</Label>
                                                    <Input
                                                        id="address"
                                                        value={
                                                            form.getValues('address') ||
                                                            'Chưa cung cấp'
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="id">Căn Cước Công Dân</Label>
                                                    <Input
                                                        id="id"
                                                        value={
                                                            form.getValues('cccd') ||
                                                            'Chưa cung cấp'
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>
                                <TabsContent value="security" className="space-y-6 pt-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="userId">Mã Người Dùng</Label>
                                            <Input
                                                id="userId"
                                                value={currentUser.userId}
                                                readOnly
                                            />
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
                                                        currentUser.systemRole as keyof typeof roleMap
                                                    ]
                                                }
                                                readOnly
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Trạng Thái Tài Khoản</Label>
                                            <Input
                                                id="status"
                                                value={userStatusLabels[currentUser.status]}
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
                        {isEditing && (
                            <CardFooter className="flex justify-end gap-4">
                                <Button variant="outline" onClick={cancelEdit}>
                                    Hủy
                                </Button>
                                <Button
                                    onClick={form.handleSubmit(onSubmit)}
                                    disabled={mutation.isPending}
                                >
                                    {mutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Lưu Thay Đổi
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
