'use client';

import {
    Box,
    Calendar,
    Clock,
    Crown,
    Egg,
    FileText,
    Home,
    Info,
    Notebook,
    Pencil,
    Plus,
    Type,
    Users,
    X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
import { cancelTask, getTaskById } from '@/services/task.service';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Image from '@/components/fallback-image';
import {
    AssignmentRoleStatus,
    TaskStatus,
    taskStatusLabels,
    taskStatusVariant,
} from '@/utils/enum/status.enum';
import { formatDate } from '@/utils/functions';
import { Badge } from '@/components/ui/badge';
import config from '@/configs';
import dayjs from 'dayjs';
import InfoItem from '@/components/info-item';
import { useCallback, useState } from 'react';
import { TaskLocationResponse } from '@/utils/types/custom.type';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AssignmentForm from '@/components/forms/assignment-form';
import Link from 'next/link';

export default function TaskDetail() {
    const [open, setOpen] = useState(false);
    const { taskId }: { taskId: string } = useParams();
    const router = useRouter();

    const { data: task, isLoading } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById(taskId),
    });

    const getLocation = useCallback((taskLocation: TaskLocationResponse) => {
        if (taskLocation?.location) {
            return taskLocation.location?.chickenCoopName;
        } else if (taskLocation?.locationNavigation) {
            return taskLocation.locationNavigation?.warehouseName;
        }
        return 'N/A';
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[75vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Card className="px-36 py-8 dark:bg-slate-800">
                    <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                        <Image src="/no-data.jpg" width={300} height={300} alt="Not Found" />
                        <h1 className="text-2xl font-bold dark:text-white">
                            Công việc không tồn tại
                        </h1>
                        <Button variant="outline" onClick={() => window.history.back()}>
                            Quay lại
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    async function handleCancelTask(taskId: string): Promise<void> {
        if (!confirm('Bạn có chắc chắn muốn hủy công việc này?')) {
            return;
        }

        try {
            await cancelTask(taskId);
            alert('Công việc đã được hủy thành công.');
            router.push(config.routes.task); // Redirect to the task list page
        } catch (error) {
            console.error('Error cancelling task:', error);
            alert('Đã xảy ra lỗi khi hủy công việc. Vui lòng thử lại.');
        }
    }

    // const getResourceName = (taskRes: TaskResourceResponse) => {
    //     if (taskRes.resource?.equipment) {
    //         return taskRes.resource?.equipment.equipmentName;
    //     } else if (taskRes.resource?.food) {
    //         return taskRes.resource?.food.foodName;
    //     } else if (taskRes.resource?.medicine) {
    //         return taskRes.resource?.medicine.medicineName;
    //     }
    //     return 'Vật phẩm khác';
    // };

    return (
        <div className="container mx-auto py-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="w-full md:w-2/3">
                    <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-300">
                        <CardHeader className="pb-4 border-b">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl flex items-center gap-2 dark:text-white">
                                        <Egg className="h-6 w-6 text-yellow-500" />
                                        {task.taskName}
                                    </CardTitle>
                                </div>
                                <Badge
                                    variant={taskStatusVariant[task.status]}
                                    className="text-sm px-3 py-1"
                                >
                                    {taskStatusLabels[task.status]}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1">
                                        <Info className="h-4 w-4" /> Mô tả
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        {task.description || 'Không có mô tả'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1">
                                            <Type className="h-4 w-4" /> Loại công việc
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-300">
                                            {task.taskType?.description || 'Không xác định'}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1">
                                            <Calendar className="h-4 w-4" /> Ngày bắt đầu
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-300">
                                            {formatDate(task.startWorkDate)}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1">
                                            <Home className="h-4 w-4" /> Vị trí
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-300">
                                            {getLocation(task.taskLocation)}
                                        </p>
                                    </div>
                                </div>

                                <Separator className="dark:bg-slate-700" />

                                <div>
                                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2 dark:text-white">
                                        <Box className="h-5 w-5 text-primary" /> Vật phẩm
                                    </h3>

                                    {task.taskResources && task.taskResources.length > 0 ? (
                                        <div className="bg-white dark:bg-slate-800 rounded-lg border  overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="dark:text-slate-200">
                                                            Tên vật phẩm
                                                        </TableHead>
                                                        <TableHead className="dark:text-slate-200">
                                                            Loại vật phẩm
                                                        </TableHead>
                                                        <TableHead className="text-right dark:text-slate-200">
                                                            Số lượng
                                                        </TableHead>
                                                        <TableHead className="text-right dark:text-slate-200">
                                                            Quy cách
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {task.taskResources.map((taskRes) => (
                                                        <TableRow
                                                            key={taskRes.taskResourceId}
                                                            className="hover:bg-slate-50 dark:hover:bg-slate-700 "
                                                        >
                                                            <TableCell className="font-medium dark:text-slate-300">
                                                                {/* {getResourceName(taskRes)} */}
                                                                {taskRes.resourceName}
                                                            </TableCell>
                                                            <TableCell className="font-medium dark:text-slate-300">
                                                                {taskRes.resourceType}
                                                            </TableCell>
                                                            <TableCell className="text-right dark:text-slate-300">
                                                                {taskRes.specQuantity}
                                                            </TableCell>
                                                            <TableCell className="text-right dark:text-slate-300">
                                                                {taskRes.unitSpecification}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                            <Box className="h-12 w-12 text-slate-400 dark:text-slate-500 mb-2" />
                                            <p className="text-slate-500 dark:text-slate-300 font-medium">
                                                Không có vật phẩm nào
                                            </p>
                                            <p className="text-slate-400 dark:text-slate-400 text-sm mt-1">
                                                Công việc này không yêu cầu vật phẩm
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/*<Separator className="dark:bg-slate-700" />

                                <div>
                                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2 dark:text-white">
                                        <Clock className="h-5 w-5 text-primary" /> Lịch trình
                                    </h3>

                                     {task.shiftSchedule && task.shiftSchedule.length > 0 ? (
                                        <div className="bg-white dark:bg-slate-800 rounded-lg border  overflow-hidden">
                                            <Table>
                                                <TableHeader className="bg-slate-50 dark:bg-slate-700/50">
                                                    <TableRow className="">
                                                        <TableHead className="dark:text-slate-200">
                                                            Ngày
                                                        </TableHead>
                                                        <TableHead className="dark:text-slate-200">
                                                            Ca làm việc
                                                        </TableHead>
                                                        <TableHead className="dark:text-slate-200">
                                                            Thời gian
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {task.shiftSchedules.map((shift) => (
                                                        <TableRow
                                                            key={shift.shiftScheduleId}
                                                            className="hover:bg-slate-50 dark:hover:bg-slate-700 "
                                                        >
                                                            <TableCell className="dark:text-slate-300">
                                                                {formatDate(shift.date)}
                                                            </TableCell>
                                                            <TableCell className="dark:text-slate-300">
                                                                {shifts.find(
                                                                    (s) =>
                                                                        s.shiftId === shift.shiftId,
                                                                )?.shiftName || 'Ca không xác định'}
                                                            </TableCell>
                                                            <TableCell className="dark:text-slate-300">
                                                                {
                                                                    shifts.find(
                                                                        (s) =>
                                                                            s.shiftId ===
                                                                            shift.shiftId,
                                                                    )?.startTime
                                                                }{' '}
                                                                -{' '}
                                                                {
                                                                    shifts.find(
                                                                        (s) =>
                                                                            s.shiftId ===
                                                                            shift.shiftId,
                                                                    )?.endTime
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                            <Clock className="h-12 w-12 text-slate-400 dark:text-slate-500 mb-2" />
                                            <p className="text-slate-500 dark:text-slate-300 font-medium">
                                                Không có lịch trình
                                            </p>
                                            <p className="text-slate-400 dark:text-slate-400 text-sm mt-1">
                                                Công việc này chưa được lên lịch
                                            </p>
                                        </div>
                                    )} 
                                </div>*/}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t mt-4 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => router.push(config.routes.task)}
                                className="dark:border-slate-600 dark:text-slate-200"
                            >
                                Quay lại
                            </Button>
                            {(task.status === TaskStatus.PENDING ||
                                task.status === TaskStatus.ASSIGNED) && (
                                <div className="space-x-2">
                                    <Link href={`${config.routes.task}/${taskId}/update`}>
                                        <Button>
                                            <Pencil className="h-4 w-4" />
                                            Chỉnh sửa
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleCancelTask(taskId)}
                                    >
                                        <X className="h-4 w-4" />
                                        Hủy
                                    </Button>
                                </div>
                            )}
                            {task.status === TaskStatus.COMPLETED && (
                                <div className="space-x-2">
                                    <Dialog open={open} onOpenChange={setOpen}>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <FileText className="h-4 w-4" />
                                                Xem Báo cáo
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[800px]">
                                            <DialogHeader className="pb-4 border-b">
                                                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                    Báo cáo cho ăn
                                                </DialogTitle>
                                            </DialogHeader>

                                            <div className="py-4">
                                                <Card className="border rounded-lg overflow-hidden">
                                                    <div className="max-h-[400px] overflow-auto">
                                                        <Table>
                                                            <TableHeader className="bg-muted/50 sticky top-0">
                                                                <TableRow>
                                                                    <TableHead className="font-medium">
                                                                        Tên sản phẩm
                                                                    </TableHead>
                                                                    <TableHead className="font-medium">
                                                                        Mã sản phẩm
                                                                    </TableHead>
                                                                    <TableHead className="font-medium">
                                                                        Quy cách tính
                                                                    </TableHead>
                                                                    <TableHead className="font-medium text-right">
                                                                        Số lượng tiêu thụ
                                                                    </TableHead>
                                                                    <TableHead className="font-medium">
                                                                        Ghi chú
                                                                    </TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {task.feedLogs.length > 0 ? (
                                                                    task.feedLogs.map(
                                                                        (log, index) => (
                                                                            <TableRow
                                                                                key={index}
                                                                                className="hover:bg-muted/30"
                                                                            >
                                                                                <TableCell className="font-medium">
                                                                                    {
                                                                                        log.resourceName
                                                                                    }
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Badge
                                                                                        variant="outline"
                                                                                        className="font-mono"
                                                                                    >
                                                                                        {
                                                                                            log.resourceCode
                                                                                        }
                                                                                    </Badge>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {
                                                                                        log.unitSpecification
                                                                                    }
                                                                                </TableCell>
                                                                                <TableCell className="text-right">
                                                                                    {
                                                                                        log.actualQuantity
                                                                                    }
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {log.note ||
                                                                                        'Không có'}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ),
                                                                    )
                                                                ) : (
                                                                    <TableRow>
                                                                        <TableCell
                                                                            colSpan={5}
                                                                            className="text-center py-6 text-muted-foreground"
                                                                        >
                                                                            Không tìm thấy dữ liệu
                                                                            phù hợp
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </Card>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </div>

                <div className="w-full md:w-1/3 space-y-6">
                    <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-300">
                        <CardHeader className="border-b flex flex-row justify-between items-center">
                            <CardTitle className="text-lg flex items-center gap-2 dark:text-white">
                                <Users className="h-5 w-5 text-primary" /> Phân công
                            </CardTitle>

                            {task?.status === TaskStatus.PENDING && (
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild className="h-auto">
                                        <Button variant="outline">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Giao việc
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                        <DialogHeader>
                                            <DialogTitle>Giao công việc mới</DialogTitle>
                                        </DialogHeader>

                                        <AssignmentForm closeDialog={() => setOpen(false)} />
                                    </DialogContent>
                                </Dialog>
                            )}
                        </CardHeader>
                        <CardContent className="pt-4">
                            <InfoItem
                                label="Ghi chú"
                                value={task.assignments?.[0]?.note || 'Không có ghi chú'}
                                icon={<Notebook size={16} />}
                            />
                            {task.assignments && task.assignments.length ? (
                                <div className="bg-white dark:bg-slate-800 rounded-lg border overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-50 dark:bg-slate-700/50">
                                            <TableRow>
                                                <TableHead className="dark:text-slate-200">
                                                    Nhân viên
                                                </TableHead>
                                                <TableHead className="dark:text-slate-200">
                                                    Ngày giao
                                                </TableHead>
                                                {/* <TableHead className="dark:text-slate-200">
                                                    Ghi chú
                                                </TableHead> */}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {task.assignments.map((assignment, index) => (
                                                <TableRow
                                                    key={index}
                                                    className="hover:bg-slate-50 dark:hover:bg-slate-700"
                                                >
                                                    <TableCell className="dark:text-slate-300">
                                                        <div className="flex items-center gap-1.5">
                                                            {assignment.assignedTo}
                                                            {assignment.status ===
                                                                AssignmentRoleStatus.TEAM_LEADER && (
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Crown className="h-4 w-4 text-amber-500" />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Đội trưởng</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="dark:text-slate-300">
                                                        {assignment.assignedDate
                                                            ? dayjs(assignment.assignedDate).format(
                                                                  'DD/MM/YYYY',
                                                              )
                                                            : '-'}
                                                    </TableCell>
                                                    {/* <TableCell className="dark:text-slate-300">
                                                        {assignment.note ?? 'Không có'}
                                                    </TableCell> */}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <Users className="h-12 w-12 text-slate-400 dark:text-slate-500 mb-2" />
                                    <p className="text-slate-500 dark:text-slate-300 font-medium">
                                        Chưa có nhân viên
                                    </p>
                                    <p className="text-slate-400 dark:text-slate-400 text-sm mt-1">
                                        Chưa có nhân viên nào được phân công
                                    </p>
                                </div>
                            )}
                        </CardContent>
                        {/* <CardFooter className="border-t">
                            <Button
                                variant="outline"
                                className="w-full dark:border-slate-600 dark:text-slate-200"
                            >
                                <Users className="h-4 w-4 mr-2" /> Phân công nhân viên
                            </Button>
                        </CardFooter> */}
                    </Card>

                    <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-300">
                        <CardHeader className="border-b ">
                            <CardTitle className="text-lg flex items-center gap-2 dark:text-white">
                                <Clock className="h-5 w-5 text-primary" /> Ca làm việc
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {task.shiftSchedule ? (
                                <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
                                    <InfoItem
                                        label="Ca"
                                        value={task.shiftSchedule.shiftName}
                                        icon={<Calendar size={16} />}
                                    />

                                    <InfoItem
                                        label="Ngày làm việc"
                                        value={
                                            task.shiftSchedule.workTime
                                                ? dayjs(task.shiftSchedule.workTime).format(
                                                      'DD/MM/YYYY',
                                                  )
                                                : '-'
                                        }
                                        icon={<Calendar size={16} />}
                                    />

                                    <InfoItem
                                        label="Thời gian"
                                        value={
                                            task.shiftSchedule.startTime +
                                            ' - ' +
                                            task.shiftSchedule.endTime
                                        }
                                        icon={<Clock size={16} />}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <Users className="h-12 w-12 text-slate-400 dark:text-slate-500 mb-2" />
                                    <p className="text-slate-500 dark:text-slate-300 font-medium">
                                        Chưa có nhân viên
                                    </p>
                                    <p className="text-slate-400 dark:text-slate-400 text-sm mt-1">
                                        Chưa có nhân viên nào được phân công
                                    </p>
                                </div>
                            )}
                        </CardContent>
                        {/* <CardFooter className="border-t">
                            <Button
                                variant="outline"
                                className="w-full dark:border-slate-600 dark:text-slate-200"
                            >
                                <Users className="h-4 w-4 mr-2" /> Phân công nhân viên
                            </Button>
                        </CardFooter> */}
                    </Card>

                    {/* <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-300">
                        <CardHeader className="border-b">
                            <CardTitle className="text-lg flex items-center gap-2 dark:text-white">
                                <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                                Thông tin bổ sung
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">
                                        Mã công việc:
                                    </span>
                                    <span className="font-medium dark:text-white">{taskId}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">
                                        Độ ưu tiên:
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                                    >
                                        Cao
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">
                                        Ngày tạo:
                                    </span>
                                    <span className="font-medium dark:text-white">
                                        {formatDate(task.startWorkDate)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card> */}
                </div>
            </div>
        </div>
    );
}
