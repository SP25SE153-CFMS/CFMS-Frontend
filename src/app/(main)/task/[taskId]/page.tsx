'use client';

import { TaskForm } from '@/components/forms/task-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, ClipboardList, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import config from '@/configs';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getTaskById } from '@/services/task.service';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import InfoItem from '@/components/info-item';
import { assignmentStatusLabels, assignmentStatusVariant } from '@/utils/enum/status.enum';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';

export default function Page() {
    const { taskId }: { taskId: string } = useParams();

    const { data: task, isLoading } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById(taskId),
    });

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

    return (
        <div className="container py-8 max-w-6xl mx-auto">
            {/* Header with back button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                        <ClipboardList className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Thông tin công việc</h1>
                        <p className="text-muted-foreground mt-1">
                            Đây là những thông tin chi tiết của công việc
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2">
                    <TaskForm />
                </div>

                {/* Assignments */}
                <div className="lg:col-span-1">
                    {task.assignments.map((assignment) => (
                        <Card key={assignment.assignmentId}>
                            <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                        Thông tin chi tiết
                                    </h3>
                                </div>
                                <InfoItem
                                    label="Trạng thái"
                                    value={
                                        assignment.status ? (
                                            <Badge
                                                variant={assignmentStatusVariant[assignment.status]}
                                            >
                                                {assignmentStatusLabels[assignment.status]}
                                            </Badge>
                                        ) : (
                                            '-'
                                        )
                                    }
                                    icon={<TrendingUp size={16} />}
                                />
                                <InfoItem
                                    label="Ngày phân công"
                                    value={dayjs(assignment.assignedDate).format(
                                        'DD/MM/YYYY HH:mm',
                                    )}
                                    icon={<Calendar size={16} />}
                                />
                                <InfoItem
                                    label="Ghi chú"
                                    value={assignment.note || 'Không có ghi chú'}
                                    icon={<FileText size={16} />}
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
