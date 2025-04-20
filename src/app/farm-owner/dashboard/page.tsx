'use client';

import { EggIcon, Users, AlertTriangle, TrendingUp, House } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { getDashboardByFarmId } from '@/services/dashboard.service';
import { getCookie } from 'cookies-next';
import config from '@/configs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import useQueryParams from '@/hooks/use-query-params';
import { useEffect } from 'react';

export default function Dashboard() {
    const { farmCode } = useQueryParams();

    const {
        data: farmData,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['farmData', farmCode],
        queryFn: () => getDashboardByFarmId(getCookie(config.cookies.farmId) as string),
    });

    useEffect(() => {
        if (farmCode) {
            refetch();
        }
    }, [farmCode, refetch]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[75vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!farmData) {
        return <h1>Không tìm thấy dữ liệu</h1>;
    }

    // Function to get the total chickens in a batch
    const getBatchChickenCount = (batch: any) => {
        if (!batch.chickenDetails || batch.chickenDetails.length === 0) {
            return '0';
        }
        return batch.chickenDetails.reduce(
            (total: number, detail: any) => total + detail.quantity,
            0,
        );
    };

    // Function to format the status
    const getStatusBadge = (status: number) => {
        switch (status) {
            case 1:
                return (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600">Đang hoạt động</Badge>
                );
            default:
                return <Badge variant="outline">Không xác định</Badge>;
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex flex-1">
                <main className="flex-1 p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Xin chào, chào mừng trở lại!
                        </h1>
                        <p className="text-muted-foreground">
                            Đây là tổng quan về trang trại gà của bạn hôm nay.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="overflow-hidden border-none shadow-md">
                                <CardHeader className="pb-2 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <EggIcon className="h-4 w-4 text-amber-500" />
                                        Tổng số gà
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="text-3xl font-bold text-amber-600">
                                        {farmData.totalChicken}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Tổng số gà trong tất cả các lô
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="overflow-hidden border-none shadow-md">
                                <CardHeader className="pb-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <Users className="h-4 w-4 text-blue-500" />
                                        Tổng số nhân viên
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="text-3xl font-bold text-blue-600">
                                        {farmData.totalEmployee}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Nhân viên trang trại
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="overflow-hidden border-none shadow-md">
                                <CardHeader className="pb-2 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        Số gà chết
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="text-3xl font-bold text-red-600">
                                        {farmData.totalChickenDeath || 0}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Không có gà chết được ghi nhận
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="overflow-hidden border-none shadow-md">
                                <CardHeader className="pb-2 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                        Lứa nuôi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="text-3xl font-bold text-green-600">
                                        {farmData.chickenBatches.length}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Lứa nuôi đang hoạt động
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
                                <CardTitle>Các lứa nuôi</CardTitle>
                                <CardDescription>
                                    Tổng quan về tất cả các lứa nuôi trong trang trại
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                        <TableRow>
                                            <TableHead>Tên lứa nuôi</TableHead>
                                            <TableHead>Ngày bắt đầu</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead className="text-right">
                                                Số lượng gà
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {farmData.chickenBatches.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center">
                                                    <div className="flex h-[150px] flex-col items-center justify-center gap-2 p-4 text-center">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                                            <House className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                        <h4 className="text-sm font-medium">
                                                            Không có lứa nuôi
                                                        </h4>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {farmData.chickenBatches.map((batch) => (
                                            <TableRow
                                                key={batch.chickenBatchId}
                                                className="hover:bg-amber-50 dark:hover:bg-amber-900/10"
                                            >
                                                <TableCell className="font-medium">
                                                    {batch.chickenBatchName}
                                                </TableCell>
                                                <TableCell>
                                                    {format(
                                                        new Date(batch.startDate),
                                                        'dd MMMM yyyy',
                                                        { locale: vi },
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(batch.status)}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {getBatchChickenCount(batch)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
