'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ClipboardList, CalendarClock } from 'lucide-react';
import Link from 'next/link';
import config from '@/configs';
import { useParams } from 'next/navigation';
import { getTaskById } from '@/services/task.service';
import { useQuery } from '@tanstack/react-query';
import { UpdateTaskForm } from '@/components/forms/update-task-form';
import { UpdateTask } from '@/utils/schemas/task.schema';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function UpdateTaskPage() {
    const { taskId }: { taskId: string } = useParams();

    const { data: task, isLoading } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById(taskId),
    });

    const defaultValues: UpdateTask = {
        taskName: task?.taskName || '',
        taskTypeId: task?.taskTypeId || '',
        isHavest: task?.isHavest || false,
        status: task?.status || 0,
        startWorkDate: task?.startWorkDate ? new Date(task?.startWorkDate) : new Date(),
        endWorkDate: task?.endWorkDate ? new Date(task?.endWorkDate) : new Date(),
        locationType: task?.taskLocation?.locationType || '',
        locationId:
            task?.taskLocation?.location?.chickenCoopId ||
            task?.taskLocation?.locationNavigation?.wareId ||
            '',
        taskResources:
            task?.taskResources?.map((item) => ({
                resourceId: item.resourceId,
                suppliedQuantity: Number(item.specQuantity.split(' ')[0]),
                consumedQuantity: 0,
                // TODO: Update this when supplierId is available
                // supplierId: item.currentSupplierId || ''
                supplierId: '',
            })) || [],
        description: task?.description || '',
        taskId: taskId,
        assignedTos: task?.assignments || [],
        shiftId: '',
        shiftName: task?.shiftSchedule?.shiftName || '',
        note: task?.assignments?.[0]?.note || '',
        assignedDate: task?.assignments?.[0]?.assignedDate
            ? new Date(task?.assignments?.[0]?.assignedDate)
            : new Date(),
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[75vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="container py-8 max-w-6xl mx-auto">
            {/* Header with back button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                        <ClipboardList className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Cập nhật công việc</h1>
                        <p className="text-muted-foreground mt-1">
                            Chỉnh sửa thông tin để cập nhật công việc trong hệ thống
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full md:w-auto">
                    <Link href={config.routes.task}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại danh sách
                    </Link>
                </Button>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar with help information */}
                <div className="lg:col-span-1 order-1">
                    <div className="sticky top-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CalendarClock className="h-5 w-5" />
                                    Hướng dẫn
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <h3 className="font-medium mb-1">Tên công việc</h3>
                                        <p className="text-muted-foreground">
                                            Đặt tên ngắn gọn và dễ hiểu cho công việc.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1">Tần suất</h3>
                                        <p className="text-muted-foreground">
                                            Số lần công việc cần được thực hiện trong một đơn vị
                                            thời gian.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1">Ca làm việc</h3>
                                        <p className="text-muted-foreground">
                                            Chọn ít nhất một ca làm việc cho công việc này.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Form container */}
                <div className="lg:col-span-3 order-2">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle>Thông tin công việc</CardTitle>
                            <CardDescription>
                                Chỉnh sửa thông tin bên dưới để cập nhật công việc
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UpdateTaskForm defaultValues={defaultValues} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
