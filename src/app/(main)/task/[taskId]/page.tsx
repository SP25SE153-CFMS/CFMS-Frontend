'use client';

import { Box, Calendar, Clock, Egg, Home, Info, Package, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getTaskById } from '@/services/task.service';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { taskStatusLabels, taskStatusVariant } from '@/utils/enum/status.enum';
import { getShifts } from '@/services/shift.service';
import { getQuantityUnit } from '@/utils/functions/category.function';
import { TaskResourceResponse } from '@/utils/types/custom.type';
import { formatDate } from '@/utils/functions';
import { getWarehouses } from '@/services/warehouse.service';
import { Badge } from '@/components/ui/badge';

export default function TaskDetail() {
    const { taskId }: { taskId: string } = useParams();

    const { data: task, isLoading } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById(taskId),
    });

    const { data: shifts } = useQuery({
        queryKey: ['shifts'],
        queryFn: () => getShifts(),
    });

    const { data: warehouses } = useQuery({
        queryKey: ['warehouses'],
        queryFn: () => getWarehouses(),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[75vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!task || !shifts) {
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

    // const updateStatus = async (newStatus: number) => {
    //     await updateTaskStatus(taskId, newStatus);
    //     toast.success('Cập nhật trạng thái thành công');
    //     router.push(config.routes.task);
    // };

    // const getChickenCoopName = (coopId: string | undefined) => {
    //     if (!coopId) return 'Chuồng không xác định';

    //     const chickenCoops: ChickenCoopResponse[] = JSON.parse(
    //         sessionStorage.getItem('chickenCoops') || '[]',
    //     );

    //     return chickenCoops.find((coop) => coop.chickenCoopId === coopId)?.chickenCoopName;
    // };

    // const getWarehouseName = (wareId: string | undefined) => {
    //     if (!wareId || !warehouses) return 'Kho không xác định';

    //     const warehouse = warehouses.find((ware) => ware.wareId === wareId);
    //     return warehouse?.warehouseName;
    // };

    const getResourceName = (taskRes: TaskResourceResponse) => {
        if (taskRes.resource?.equipment) {
            return taskRes.resource?.equipment.equipmentName;
        } else if (taskRes.resource?.food) {
            return taskRes.resource?.food.foodName;
        } else if (taskRes.resource?.medicine) {
            return taskRes.resource?.medicine.medicineName;
        }
        return 'Vật phẩm khác';
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="w-full md:w-2/3">
                    <Card className="w-full">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl flex items-center gap-2">
                                        <Egg className="h-6 w-6 text-yellow-500" />
                                        {task.taskName}
                                    </CardTitle>
                                </div>
                                <Badge variant={taskStatusVariant[task.status]}>
                                    {taskStatusLabels[task.status]}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                        <Info className="h-4 w-4" /> Mô tả
                                    </h3>
                                    <p>{task.description || 'Không có mô tả'}</p>
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
                                        <p>
                                            {task.taskLocation?.coop?.chickenCoopName ||
                                                task.taskLocation?.ware?.warehouseName ||
                                                'Không xác định'}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                    <Box className="h-4 w-4" /> Vật phẩm
                                </h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tên vật phẩm</TableHead>
                                            <TableHead className="text-right">Số lượng</TableHead>
                                            <TableHead className="text-right">Đơn vị</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {task.taskResources.map((taskRes) => (
                                            <TableRow key={taskRes.taskResourceId}>
                                                <TableCell className="font-medium">
                                                    {getResourceName(taskRes)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {taskRes.quantity}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {getQuantityUnit(taskRes.unitId) || 'đơn vị'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <Separator />

                                <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                    <Clock className="h-4 w-4" /> Lịch trình
                                </h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ngày</TableHead>
                                            <TableHead>Ca làm việc</TableHead>
                                            <TableHead>Thời gian</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {task.shiftSchedules.map((shift) => (
                                            <TableRow key={shift.shiftScheduleId}>
                                                <TableCell>{formatDate(shift.date)}</TableCell>
                                                <TableCell>
                                                    {shifts.find((s) => s.shiftId === shift.shiftId)
                                                        ?.shiftName || 'Ca không xác định'}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        shifts.find(
                                                            (s) => s.shiftId === shift.shiftId,
                                                        )?.startTime
                                                    }{' '}
                                                    -{' '}
                                                    {
                                                        shifts.find(
                                                            (s) => s.shiftId === shift.shiftId,
                                                        )?.endTime
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                        {/* <CardFooter className="flex justify-between">
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
                        </CardFooter> */}
                    </Card>
                </div>

                <div className="w-full md:w-1/3">
                    <Card className="w-full mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Package className="h-5 w-5 text-green-500" />
                                Phân công
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
