'use client';

import type React from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
    ArrowLeft,
    CheckCircle,
    RefreshCw,
    Info,
    CalendarClock,
    Package,
    Users,
    FileText,
    Tag,
    MapPin,
    PenToolIcon as Tools,
    Star,
    User,
    Clock,
    Calendar,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Task {
    taskId: number;
    taskName: string;
    taskType: string;
    taskLocation: string;
    description?: string;
    status: number;
    shiftScheduleList?: ShiftSchedule[];
    resourceList?: Resource[];
    assignmentList: Assignment[];
}

interface ShiftSchedule {
    id?: number;
    shiftName: string;
    startTime?: string;
    endTime?: string;
}

interface Resource {
    resourceName: string;
    resourceType: string;
    unitSpecification?: string;
    specQuantity?: number;
}

interface Assignment {
    assignedTo: string;
    status: number;
    assignedDate?: string;
    note?: string;
}

interface EmptySectionProps {
    icon: React.ReactNode;
    message: string;
}

const EmptySection = ({ icon, message }: EmptySectionProps) => (
    <div className="flex flex-col items-center justify-center p-8 bg-muted/30 dark:bg-muted/10 rounded-lg my-4 gap-4">
        {icon}
        <p className="text-muted-foreground text-sm text-center">{message}</p>
    </div>
);

export default function TaskDetail({ task }: { task: Task }) {
    const router = useRouter();

    const getTaskTypeText = (type: string) => {
        switch (type.toLowerCase()) {
            case 'feed':
                return 'Cho ăn';
            case 'harvest':
                return 'Thu hoạch';
            case 'inject':
                return 'Tiêm phòng';
            case 'evaluate':
                return 'Đánh giá';
            case 'clean':
                return 'Dọn dẹp';
            case 'others':
                return 'Khác';
            default:
                return 'Khác';
        }
    };

    const getTaskTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'feed':
                return <Package className="h-5 w-5" />;
            case 'harvest':
                return <Package className="h-5 w-5" />;
            case 'inject':
                return <FileText className="h-5 w-5" />;
            case 'evaluate':
                return <FileText className="h-5 w-5" />;
            case 'clean':
                return <Package className="h-5 w-5" />;
            default:
                return <FileText className="h-5 w-5" />;
        }
    };

    const handleUpdateStatus = async () => {
        try {
            // Implement your updateTaskStatus function here
            // await updateTaskStatus(task.taskId, task.status === 0 ? 1 : 0)
            router.back();
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const formatDateTime = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
        } catch (error) {
            return 'N/A';
        }
    };

    const formatTimeOnly = (timeString: string | undefined) => {
        if (!timeString) return 'N/A';
        return timeString.split(':').slice(0, 2).join(':');
    };

    return (
        <div className="container max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-300">
            {/* Header with status badge */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full h-10 w-10"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Chi tiết công việc</h1>
                        <p className="text-muted-foreground text-sm">ID: {task.taskId}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Badge
                        variant={task.status === 0 ? 'outline' : 'default'}
                        className={cn(
                            'px-3 py-1 text-sm font-medium',
                            task.status === 0
                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                : 'bg-green-500/10 text-green-500 border-green-500/20',
                        )}
                    >
                        {task.status === 0 ? (
                            <>
                                <Clock className="h-3.5 w-3.5 mr-1" /> Đang thực hiện
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Hoàn thành
                            </>
                        )}
                    </Badge>

                    <Button
                        variant="outline"
                        onClick={handleUpdateStatus}
                        className={cn(
                            'transition-all',
                            task.status === 0
                                ? 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20'
                                : 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-950/20',
                        )}
                    >
                        {task.status === 0 ? (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2" /> Đánh dấu hoàn thành
                            </>
                        ) : (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2" /> Đánh dấu chưa hoàn thành
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content - 2/3 width on desktop */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card className="overflow-hidden border-none shadow-md">
                        <CardHeader className="bg-primary/5 pb-4">
                            <div className="flex items-center gap-2">
                                <Info className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg font-semibold">
                                    Thông tin cơ bản
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-5">
                                <div className="bg-primary/10 p-4 rounded-full shrink-0">
                                    {getTaskTypeIcon(task.taskType)}
                                </div>
                                <div className="space-y-4 flex-1">
                                    <h3 className="text-xl font-semibold">{task.taskName}</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 bg-muted/40 p-2 rounded-md">
                                            <Tag className="h-4 w-4 text-primary shrink-0" />
                                            <span className="text-sm text-primary font-medium whitespace-nowrap">
                                                Loại công việc:
                                            </span>
                                            <span className="text-sm ml-1">
                                                {getTaskTypeText(task.taskType)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 bg-muted/40 p-2 rounded-md">
                                            <MapPin className="h-4 w-4 text-orange-500 shrink-0" />
                                            <span className="text-sm text-orange-500 font-medium whitespace-nowrap">
                                                Vị trí:
                                            </span>
                                            <span className="text-sm ml-1">
                                                {task.taskLocation}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {task.description && (
                                <div className="mt-6 pt-6 border-t">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground font-medium">
                                            Mô tả công việc
                                        </span>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <p className="text-sm leading-relaxed">
                                            {task.description}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tabs for Resources and Assignments */}
                    <Tabs defaultValue="shifts" className="w-full">
                        <TabsList className="grid grid-cols-3 mb-4">
                            <TabsTrigger value="shifts">Ca làm việc</TabsTrigger>
                            <TabsTrigger value="resources">Vật phẩm</TabsTrigger>
                            <TabsTrigger value="assignments">Người thực hiện</TabsTrigger>
                        </TabsList>

                        {/* Shift Schedule Tab */}
                        <TabsContent value="shifts" className="mt-0">
                            <Card className="border-none shadow-md">
                                <CardHeader className="bg-primary/5 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CalendarClock className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-lg font-semibold">
                                                Ca làm việc
                                            </CardTitle>
                                        </div>
                                        {task.shiftScheduleList &&
                                            task.shiftScheduleList.length > 0 && (
                                                <Badge
                                                    variant="outline"
                                                    className="bg-primary/10 text-primary border-primary/20"
                                                >
                                                    {task.shiftScheduleList.length} ca
                                                </Badge>
                                            )}
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {task.shiftScheduleList && task.shiftScheduleList.length > 0 ? (
                                        <div className="relative pl-8 border-l-2 border-primary">
                                            {task.shiftScheduleList
                                                .sort((a, b) => {
                                                    const timeA = a.startTime
                                                        ? Number.parseInt(a.startTime.split(':')[0])
                                                        : 0;
                                                    const timeB = b.startTime
                                                        ? Number.parseInt(b.startTime.split(':')[0])
                                                        : 0;
                                                    return timeA - timeB;
                                                })
                                                .map((shift, index) => (
                                                    <div
                                                        key={index}
                                                        className="mb-6 relative group"
                                                    >
                                                        <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                                                            {index + 1}
                                                        </div>
                                                        <div className="ml-6 p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border border-transparent group-hover:border-primary/20 transition-all">
                                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                                <div className="font-semibold">
                                                                    {shift.shiftName}
                                                                </div>
                                                                <div className="flex items-center text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                                                                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                                                                    {formatTimeOnly(
                                                                        shift.startTime,
                                                                    )}{' '}
                                                                    -{' '}
                                                                    {formatTimeOnly(shift.endTime)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <EmptySection
                                            icon={
                                                <CalendarClock className="h-10 w-10 text-muted-foreground/50" />
                                            }
                                            message="Chưa có ca làm việc"
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Resources Tab */}
                        <TabsContent value="resources" className="mt-0">
                            <Card className="border-none shadow-md">
                                <CardHeader className="bg-primary/5 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-lg font-semibold">
                                                Vật phẩm sử dụng
                                            </CardTitle>
                                        </div>
                                        {task.resourceList && task.resourceList.length > 0 && (
                                            <Badge
                                                variant="outline"
                                                className="bg-primary/10 text-primary border-primary/20"
                                            >
                                                {task.resourceList.length} vật phẩm
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {task.resourceList && task.resourceList.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {task.resourceList.map((resource, index) => (
                                                <Card
                                                    key={index}
                                                    className="overflow-hidden border border-muted/50 hover:border-primary/20 transition-all"
                                                >
                                                    <CardHeader className="bg-muted/30 dark:bg-muted/10 py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            {resource.resourceType ===
                                                            'Thiết bị' ? (
                                                                <Tools className="h-4 w-4 text-primary" />
                                                            ) : (
                                                                <Package className="h-4 w-4 text-primary" />
                                                            )}
                                                            <CardTitle className="text-base font-medium">
                                                                {resource.resourceName}
                                                            </CardTitle>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="py-3 px-4">
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-primary/10 text-primary border-primary/20"
                                                            >
                                                                <Tag className="h-3 w-3 mr-1" />
                                                                {resource.resourceType}
                                                            </Badge>

                                                            {resource.unitSpecification && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-blue-500/10 text-blue-500 border-blue-500/20"
                                                                >
                                                                    <Package className="h-3 w-3 mr-1" />
                                                                    {resource.unitSpecification}
                                                                </Badge>
                                                            )}

                                                            {resource.specQuantity && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-orange-500/10 text-orange-500 border-orange-500/20"
                                                                >
                                                                    SL: {resource.specQuantity}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptySection
                                            icon={
                                                <Package className="h-10 w-10 text-muted-foreground/50" />
                                            }
                                            message="Chưa có vật phẩm"
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Assignments Tab */}
                        <TabsContent value="assignments" className="mt-0">
                            <Card className="border-none shadow-md">
                                <CardHeader className="bg-primary/5 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-lg font-semibold">
                                                Người được phân công
                                            </CardTitle>
                                        </div>
                                        {task.assignmentList && task.assignmentList.length > 0 && (
                                            <Badge
                                                variant="outline"
                                                className="bg-primary/10 text-primary border-primary/20"
                                            >
                                                {task.assignmentList.length} người
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {task.assignmentList.map((assignment, index) => (
                                            <Card
                                                key={index}
                                                className="overflow-hidden border border-muted/50 hover:border-primary/20 transition-all"
                                            >
                                                <CardHeader className="bg-muted/30 dark:bg-muted/10 py-3 px-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={cn(
                                                                    'w-10 h-10 rounded-full flex items-center justify-center text-white',
                                                                    assignment.status === 1
                                                                        ? 'bg-yellow-500'
                                                                        : 'bg-primary',
                                                                )}
                                                            >
                                                                {assignment.status === 1 ? (
                                                                    <Star className="h-5 w-5" />
                                                                ) : (
                                                                    <User className="h-5 w-5" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <CardTitle className="text-base font-medium">
                                                                    {assignment.assignedTo}
                                                                </CardTitle>
                                                                <CardDescription className="text-xs">
                                                                    {assignment.status === 1
                                                                        ? 'Đội trưởng'
                                                                        : 'Thành viên'}
                                                                </CardDescription>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-muted/50 text-muted-foreground border-muted/20"
                                                        >
                                                            <Calendar className="h-3 w-3 mr-1" />
                                                            {formatDateTime(
                                                                assignment.assignedDate,
                                                            )}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                {assignment.note && (
                                                    <CardContent className="py-3 px-4 bg-yellow-500/5 border-t border-yellow-500/10">
                                                        <div className="flex items-start gap-2">
                                                            <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                                                            <p className="text-sm">
                                                                {assignment.note}
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                )}
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar - 1/3 width on desktop */}
                <div className="space-y-6">
                    {/* Note Section */}
                    {task.assignmentList?.[0]?.note && (
                        <Card className="border-none shadow-md">
                            <CardHeader className="bg-yellow-500/10 pb-4">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                                    <CardTitle className="text-lg font-semibold">
                                        Ghi chú quan trọng
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
                                    <p className="text-sm leading-relaxed">
                                        {task.assignmentList[0].note}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Task Summary Card */}
                    <Card className="border-none shadow-md">
                        <CardHeader className="bg-primary/5 pb-4">
                            <div className="flex items-center gap-2">
                                <Info className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg font-semibold">
                                    Tóm tắt công việc
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Loại công việc
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {getTaskTypeText(task.taskType)}
                                    </span>
                                </div>

                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Vị trí
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {task.taskLocation}
                                    </span>
                                </div>

                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Số ca làm việc
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {task.shiftScheduleList?.length || 0}
                                    </span>
                                </div>

                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Số vật phẩm
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {task.resourceList?.length || 0}
                                    </span>
                                </div>

                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Số người thực hiện
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {task.assignmentList?.length || 0}
                                    </span>
                                </div>

                                <div className="flex justify-between py-2">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Trạng thái
                                    </span>
                                    <Badge
                                        variant={task.status === 0 ? 'outline' : 'default'}
                                        className={cn(
                                            'px-2 py-0.5 text-xs',
                                            task.status === 0
                                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                : 'bg-green-500/10 text-green-500 border-green-500/20',
                                        )}
                                    >
                                        {task.status === 0 ? 'Đang thực hiện' : 'Hoàn thành'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end pt-2 pb-4">
                            <Button variant="outline" onClick={() => router.back()}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Quay lại
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
