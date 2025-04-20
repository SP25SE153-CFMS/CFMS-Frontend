'use client';

import { Button } from '@/components/ui/button';
import { UserIcon, Calendar, Filter, Plus, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Image from '@/components/fallback-image';
import { getRequests } from '@/services/request.service';
import Link from 'next/link';
import config from '@/configs';
import { getUsers } from '@/services/user.service';
import { Badge } from '@/components/ui/badge';
import { requestStatusBadge, requestStatusLabels } from '@/utils/enum/status.enum';
import { formatDate } from '@/utils/functions';
import type { User } from '@/utils/schemas/user.schema';
import { useMemo, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { RequestResponse } from '@/utils/types/custom.type';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function Page() {
    // State for filtering
    const [selectedRequestType, setSelectedRequestType] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const { data: requests, isLoading } = useQuery({
        queryKey: ['requests'],
        queryFn: () => getRequests(),
    });

    const getRequestType = (request: RequestResponse) => {
        if (!request) return 'Phiếu khác';
        if (request.taskRequests?.length > 0) {
            return 'Báo cáo, đánh giá';
        }
        return 'Nhập xuất kho';
    };

    const requestTypes = useMemo(() => {
        const types = Array.from(
            new Map(
                requests?.map((request) => [
                    getRequestType(request),
                    {
                        id: request.requestTypeId,
                        label: getRequestType(request),
                    },
                ]),
            ).values(),
        );
        types.unshift({ id: 'all', label: 'Tất cả' });
        return types;
    }, [requests]);

    useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const users = await getUsers();
            sessionStorage.setItem('users', JSON.stringify(users));
            return users;
        },
    });

    // Filter requests based on selected type and search query
    const filteredRequests = useMemo(() => {
        if (!requests) return [];

        return requests.filter((request) => {
            const matchesType =
                selectedRequestType === 'all' ||
                request.requestTypeId?.toString() === selectedRequestType;

            if (!searchQuery) return matchesType;

            const users: User[] = JSON.parse(sessionStorage.getItem('users') || '[]');
            const createdBy = users.find((user) => user.userId === request.createdByUserId);
            const approvedBy = users.find((user) => user.userId === request.approvedById);

            const searchLower = searchQuery.toLowerCase();
            const createdByName = createdBy?.fullName?.toLowerCase() || '';
            const approvedByName = approvedBy?.fullName?.toLowerCase() || '';

            return (
                matchesType &&
                (createdByName.includes(searchLower) ||
                    approvedByName.includes(searchLower) ||
                    getRequestType(request).toLowerCase().includes(searchLower))
            );
        });
    }, [requests, selectedRequestType, searchQuery]);

    // Check if requests are loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="flex flex-col items-center gap-4">
                    <LoadingSpinner className="h-12 w-12" />
                    <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    // Check if requests data exists
    if (!requests) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Card className="px-8 py-8 sm:px-36 max-w-2xl mx-auto">
                    <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                        <Image
                            src="/no-data.jpg"
                            width={300}
                            height={300}
                            alt="Not Found"
                            className="rounded-lg object-cover"
                        />
                        <h1 className="text-2xl font-bold">Danh sách không tồn tại</h1>
                        <Button
                            variant="outline"
                            onClick={() => window.history.back()}
                            className="mt-2"
                        >
                            Quay lại
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Return the page
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold ">Danh sách các phiếu yêu cầu</h2>
                    <p className="text-muted-foreground mt-1">
                        Danh sách tất cả các phiếu yêu cầu trong hệ thống
                    </p>
                </div>

                {/* <div className="flex gap-2">
                    <Link href={config.routes.createRequest || '#'}>
                        <Button className="gap-1">
                            <Plus size={16} />
                            <span className="hidden sm:inline">Tạo phiếu mới</span>
                            <span className="sm:hidden">Tạo mới</span>
                        </Button>
                    </Link>
                </div> */}
            </div>

            {/* Search and Filter section */}
            <div className="mb-8 space-y-4 bg-muted/30 p-4 rounded-lg border">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-primary" />
                        <span className="font-medium">Lọc theo loại phiếu:</span>
                    </div>

                    {/* Tabs for larger screens */}
                    <div className="hidden md:block">
                        <Tabs
                            value={selectedRequestType}
                            onValueChange={setSelectedRequestType}
                            className="w-full"
                        >
                            <TabsList className="bg-background">
                                {requestTypes?.map((type) => (
                                    <TabsTrigger key={type.id} value={type.id}>
                                        {type.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Dropdown for mobile */}
                    <div className="md:hidden w-full sm:w-auto">
                        <Select value={selectedRequestType} onValueChange={setSelectedRequestType}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn loại phiếu" />
                            </SelectTrigger>
                            <SelectContent>
                                {requestTypes?.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Filter count */}
                    <div className="ml-auto">
                        <Badge variant="outline" className="bg-primary/10">
                            {filteredRequests?.length || 0} phiếu
                        </Badge>
                    </div>
                </div>

                {/* Search input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm theo người tạo, người duyệt hoặc loại phiếu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests?.map((request) => {
                    const users: User[] = JSON.parse(sessionStorage.getItem('users') || '[]');
                    const createdBy = users.find((user) => user.userId === request.createdByUserId);
                    const approvedBy = users.find((user) => user.userId === request.approvedById);
                    const requestType = getRequestType(request);

                    return (
                        <Card
                            key={request.requestId}
                            className="overflow-hidden hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] border-muted/80 group"
                        >
                            <CardHeader className="pb-2 bg-muted/20">
                                <div className="flex justify-between items-start">
                                    <Badge
                                        className={cn(
                                            requestStatusBadge[request.status],
                                            'hover:bg-inherit text-xs font-medium px-3 py-1',
                                        )}
                                    >
                                        {requestStatusLabels[request.status] || 'Chưa xác định'}
                                    </Badge>
                                    <Badge variant="outline" className="bg-background/80">
                                        {requestType}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 pb-2">
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary/10 p-1.5 rounded-full">
                                            <Calendar size={14} className="text-primary" />
                                        </div>
                                        <span className="flex flex-col">
                                            <span className="text-muted-foreground text-xs">
                                                Ngày tạo:
                                            </span>
                                            <span className="font-medium">
                                                {formatDate(request.createdWhen) ||
                                                    'Không có thông tin'}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary/10 p-1.5 rounded-full">
                                            <UserIcon size={14} className="text-primary" />
                                        </div>
                                        <span className="flex flex-col">
                                            <span className="text-muted-foreground text-xs">
                                                Người tạo:
                                            </span>
                                            <span className="font-medium">
                                                {createdBy?.fullName || 'Không có thông tin'}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary/10 p-1.5 rounded-full">
                                            <Calendar size={14} className="text-primary" />
                                        </div>
                                        <span className="flex flex-col">
                                            <span className="text-muted-foreground text-xs">
                                                Ngày duyệt:
                                            </span>
                                            <span className="font-medium">
                                                {formatDate(request.approvedAt) || 'Chưa duyệt'}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary/10 p-1.5 rounded-full">
                                            <UserIcon size={14} className="text-primary" />
                                        </div>
                                        <span className="flex flex-col">
                                            <span className="text-muted-foreground text-xs">
                                                Người duyệt:
                                            </span>
                                            <span className="font-medium">
                                                {approvedBy?.fullName || 'Chưa duyệt'}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-4">
                                <Link
                                    href={`${config.routes.request}/${request.requestId}`}
                                    className="w-full"
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                    >
                                        Xem chi tiết
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {filteredRequests?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 bg-muted/20 rounded-lg border border-dashed p-8 mt-4">
                    <Image
                        src="/no-data.jpg"
                        width={180}
                        height={180}
                        alt="No Requests"
                        className="rounded-lg"
                    />
                    <p className="mt-6 text-lg font-medium">
                        {selectedRequestType === 'all' && !searchQuery
                            ? 'Không có phiếu yêu cầu nào'
                            : `Không tìm thấy phiếu yêu cầu phù hợp với bộ lọc`}
                    </p>
                    <p className="text-muted-foreground text-sm mt-1 text-center max-w-md">
                        {selectedRequestType !== 'all' || searchQuery
                            ? 'Hãy thử thay đổi bộ lọc hoặc xóa từ khóa tìm kiếm để xem tất cả phiếu yêu cầu'
                            : 'Hãy tạo phiếu yêu cầu mới để bắt đầu'}
                    </p>
                    <div className="mt-6 flex gap-3">
                        {(selectedRequestType !== 'all' || searchQuery) && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedRequestType('all');
                                    setSearchQuery('');
                                }}
                            >
                                Xem tất cả
                            </Button>
                        )}
                        <Link href={config.routes.createRequest || '#'}>
                            <Button>
                                <Plus size={16} className="mr-1" />
                                Tạo phiếu yêu cầu
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
