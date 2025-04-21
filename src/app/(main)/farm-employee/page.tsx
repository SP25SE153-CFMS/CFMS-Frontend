'use client';

import { useState } from 'react';
import { DataTable } from '@/components/table/data-table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { Download, Plus, Search, UserCheck, UserRoundPlusIcon, Users, UserX } from 'lucide-react';
import FarmEmployeeForm from '@/components/forms/farm-employee-form';
import { downloadCSV } from '@/utils/functions/download-csv.function';
import { useQuery } from '@tanstack/react-query';
import { getEmployeesByFarmId } from '@/services/farm.service';
import { getCookie } from 'cookies-next';
import config from '@/configs';
import Image from '@/components/fallback-image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function Page() {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const openModal = () => setOpen(true);
    const onOpenChange = (val: boolean) => setOpen(val);

    const { data: farmEmployees, isLoading } = useQuery({
        queryKey: ['farmEmployees'],
        queryFn: () => getEmployeesByFarmId(getCookie(config.cookies.farmId) ?? ''),
        enabled: !!getCookie(config.cookies.farmId),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[75vh] gap-4">
                <div>
                    <LoadingSpinner className="w-12 h-12" />
                </div>
                <p className="text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!farmEmployees) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Card className="px-8 py-8 sm:px-16 md:px-24 lg:px-36">
                    <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                        <Image
                            src="/no-data.jpg"
                            width={300}
                            height={300}
                            alt="Not Found"
                            className="rounded-lg shadow-md"
                        />
                        <h1 className="text-2xl font-bold">Dữ liệu không tồn tại</h1>
                        <p className="text-muted-foreground text-center mb-2">
                            Không tìm thấy nhân công nào trong chuồng nuôi này
                        </p>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => window.history.back()}>
                                Quay lại
                            </Button>
                            <Button onClick={openModal}>
                                <Plus size={18} className="mr-2" /> Thêm nhân công
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    // Calculate statistics
    const totalEmployees = farmEmployees.length;
    const activeEmployees = farmEmployees.filter(
        (emp: any) => emp.status.toString() === '1',
    ).length;
    const inactiveEmployees = totalEmployees - activeEmployees;

    // Filter employees based on search query
    const filteredEmployees = farmEmployees.filter((farmEmployee) => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();
        const user = farmEmployee.user;
        // Adjust these fields based on your actual employee data structure
        return (
            (user.fullName && user.fullName.toLowerCase().includes(query)) ||
            (user.mail && user.mail.toLowerCase().includes(query)) ||
            (user.phoneNumber && user.phoneNumber.toLowerCase().includes(query)) ||
            (user.address && user.address.toLowerCase().includes(query))
        );
    });

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-x-4 space-y-2 mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Danh sách nhân công</h2>
                    <p className="text-muted-foreground">
                        Quản lý tất cả các nhân công trong chuồng nuôi
                    </p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-black">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            Tổng nhân công
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalEmployees}</div>
                        <CardDescription>Tổng số nhân công đã đăng ký</CardDescription>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <UserCheck className="mr-2 h-4 w-4" />
                            Nhân công đang làm việc
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{activeEmployees}</div>
                        <CardDescription>Số nhân công hiện đang hoạt động</CardDescription>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                            <UserX className="mr-2 h-4 w-4" />
                            Nhân công không hoạt động
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">{inactiveEmployees}</div>
                        <CardDescription>Số nhân công hiện không hoạt động</CardDescription>
                    </CardContent>
                </Card>
            </div>

            {/* Search input */}
            <div className="my-6 flex space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Tìm kiếm nhân công..."
                        className="pl-8 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button
                    variant="outline"
                    className="space-x-1"
                    onClick={() => downloadCSV(farmEmployees, 'farm-employees.csv')}
                >
                    <span>Tải file</span> <Download size={18} />
                </Button>
                <Button className="space-x-1" onClick={openModal}>
                    <span>Thêm nhân công</span> <Plus size={18} />
                </Button>
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <UserRoundPlusIcon size={20} />
                                Thêm nhân công mới
                            </DialogTitle>
                            <DialogDescription>
                                Thêm nhân công vào trang trại bằng cách gửi thông báo đến cho người
                                được thêm.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-[600px]">
                            <FarmEmployeeForm closeDialog={() => setOpen(false)} />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Results summary */}
            <div className="flex items-center justify-between my-4">
                <div className="text-sm text-muted-foreground">
                    Hiển thị <Badge variant="outline">{filteredEmployees.length}</Badge> nhân công{' '}
                    {searchQuery && `cho tìm kiếm "${searchQuery}"`}
                </div>
            </div>

            {/* Data Table */}
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <DataTable data={filteredEmployees} columns={columns} />
            </div>
        </div>
    );
}
