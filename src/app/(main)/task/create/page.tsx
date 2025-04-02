import { TaskForm } from '@/components/forms/task-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ClipboardList, CalendarClock } from 'lucide-react';
import Link from 'next/link';
import config from '@/configs';

export default function CreateTaskPage() {
    return (
        <div className="container py-8 max-w-6xl mx-auto">
            {/* Header with back button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                        <ClipboardList className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Tạo công việc mới</h1>
                        <p className="text-muted-foreground mt-1">
                            Điền thông tin để tạo một công việc mới trong hệ thống
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
                                Điền đầy đủ thông tin bên dưới để tạo công việc mới
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TaskForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
