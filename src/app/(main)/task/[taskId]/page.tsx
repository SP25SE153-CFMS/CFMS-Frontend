'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Egg, Home, Info, Package, ShoppingBag, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getTaskById, updateTaskStatus } from '@/services/task.service';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import config from '@/configs';
import { TaskStatus } from '@/utils/enum/status.enum';
import { getShifts } from '@/services/shift.service';

// Mock resource names - in a real app, these would be fetched from an API
const resourceNames = {
    '680f8752-9ea3-4a0a-917d-9afb2cfdcb30': 'Hộp đựng trứng',
    '63f244d1-c260-4bbb-b10a-c6a7761e9aab': 'Găng tay',
};

// Mock unit names
const unitNames = {
    '07358248-3175-4e99-adff-4c0836ac3078': 'cái',
};

export default function TaskDetail() {
    const router = useRouter();

    const { taskId }: { taskId: string } = useParams();

    const { data: task, isLoading } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById(taskId),
    });

    const { data: shiftNames } = useQuery({
        queryKey: ['shiftNames'],
        queryFn: () => getShifts(),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[75vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!task || !shiftNames) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Card className="px-36 py-8">
                    <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                        <Image src="/no-data.jpg" width={300} height={300} alt="Not Found" />
                        <h1 className="text-2xl font-bold">Công việc không tồn tại</h1>
                        <Button variant="outline" onClick={() => window.history.back()}>
                            Quay lại
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const getStatusBadge = (statusCode: number) => {
        switch (statusCode) {
            case 0:
                return (
                    <Badge variant="outline" className="bg-gray-100">
                        Chưa bắt đầu
                    </Badge>
                );
            case 1:
                return (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        Đang thực hiện
                    </Badge>
                );
            case 2:
                return (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                        Hoàn thành
                    </Badge>
                );
            case 3:
                return (
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                        Đã hủy
                    </Badge>
                );
            default:
                return <Badge variant="outline">Không xác định</Badge>;
        }
    };

    const updateStatus = async (newStatus: number) => {
        await updateTaskStatus(taskId, newStatus);
        toast.success('Cập nhật trạng thái thành công');
        router.push(config.routes.task);
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd/MM/yyyy');
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="w-full md:w-2/3">
                    <Card className="w-full">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl flex items-center gap-2">
                                        <Egg className="h-6 w-6 text-yellow-500" />
                                        {task.taskName}
                                    </CardTitle>
                                </div>
                                {getStatusBadge(task.status)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                        <Info className="h-4 w-4" /> Mô tả
                                    </h3>
                                    <p>{task.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                            <Calendar className="h-4 w-4" /> Ngày bắt đầu
                                        </h3>
                                        <p>{formatDate(task.startWorkDate)}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                            <Home className="h-4 w-4" /> Vị trí
                                        </h3>
                                        <p>Chuồng số 3</p>
                                    </div>
                                </div>

                                <Separator />

                                <Tabs defaultValue="resources" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="resources">Tài nguyên</TabsTrigger>
                                        <TabsTrigger value="schedule">Lịch trình</TabsTrigger>
                                        <TabsTrigger value="assignments">Phân công</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="resources" className="pt-4">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Tên tài nguyên</TableHead>
                                                    <TableHead className="text-right">
                                                        Số lượng
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Đơn vị
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {task.taskResources.map((resource) => (
                                                    <TableRow key={resource.taskResourceId}>
                                                        <TableCell className="font-medium">
                                                            {resourceNames[
                                                                resource.resourceId as keyof typeof resourceNames
                                                            ] || 'Tài nguyên không xác định'}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {resource.quantity}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {unitNames[
                                                                resource.unitId as keyof typeof unitNames
                                                            ] || 'đơn vị'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TabsContent>

                                    <TabsContent value="schedule" className="pt-4">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Ngày</TableHead>
                                                    <TableHead>Ca làm việc</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {task.shiftSchedules.map((shift) => (
                                                    <TableRow key={shift.shiftScheduleId}>
                                                        <TableCell>
                                                            {formatDate(shift.date)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {shiftNames.find(
                                                                (s) => s.shiftId === shift.shiftId,
                                                            )?.shiftName || 'Ca không xác định'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TabsContent>

                                    <TabsContent value="assignments" className="pt-4">
                                        {task.assignments.length > 0 ? (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Nhân viên</TableHead>
                                                        <TableHead>Vai trò</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {task.assignments.map((assignment, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>Tên nhân viên</TableCell>
                                                            <TableCell>Vai trò</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                                <Users className="h-12 w-12 text-muted-foreground mb-2" />
                                                <p className="text-muted-foreground">
                                                    Chưa có nhân viên nào được phân công
                                                </p>
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline">Chỉnh sửa</Button>
                            <div className="space-x-2">
                                {task.status !== TaskStatus.COMPLETED && (
                                    <Button
                                        variant="default"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => updateStatus(TaskStatus.COMPLETED)}
                                    >
                                        Hoàn thành
                                    </Button>
                                )}
                                {task.status !== TaskStatus.CANCELLED && (
                                    <Button
                                        variant="destructive"
                                        onClick={() => updateStatus(TaskStatus.CANCELLED)}
                                    >
                                        Hủy
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                <div className="w-full md:w-1/3">
                    <Card className="w-full mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Package className="h-5 w-5 text-green-500" />
                                Thu hoạch
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                        Loại thu hoạch
                                    </h3>
                                    <p>Trứng gà</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                                        Số lượng thu hoạch
                                    </h3>
                                    <p>Chưa có dữ liệu</p>
                                </div>
                                <Button variant="outline" className="w-full">
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    Nhập kết quả thu hoạch
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-500" />
                                Hoạt động gần đây
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                                    <div>
                                        <p className="text-sm">Tạo công việc</p>
                                        <p className="text-xs text-muted-foreground">
                                            03/04/2025 17:31
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full">
                                    Xem tất cả hoạt động
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
