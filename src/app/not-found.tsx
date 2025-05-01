'use client';

import Link from 'next/link';
import { Button } from '../components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../components/ui/card';
import { Home, ArrowLeft, RefreshCw } from 'lucide-react';
import React from 'react';

export default function NotFound() {
    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center p-4">
            <Card className="mx-auto max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <span className="text-4xl font-bold">404</span>
                    </div>
                    <CardTitle className="text-2xl uppercase font-semibold">
                        Không Tìm Thấy Trang
                    </CardTitle>
                    <CardDescription>
                        Chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                    <p>
                        Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên, hoặc tạm thời không khả
                        dụng.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 sm:flex-row">
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Trang Chủ
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                        <Link href="javascript:history.back()">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Quay Lại
                        </Link>
                    </Button>
                    <Button className="w-full sm:w-auto" onClick={() => window.location.reload()}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Làm Mới
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
