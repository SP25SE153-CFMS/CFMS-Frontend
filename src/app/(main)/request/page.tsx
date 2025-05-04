'use client';

import { Button } from '@/components/ui/button';
import { Filter, Search, Table, Columns3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card } from '@/components/ui/card';
import Image from '@/components/fallback-image';
import { getRequests } from '@/services/request.service';
import { getUsers } from '@/services/user.service';
import { Badge } from '@/components/ui/badge';
import { RequestStatus, requestStatusBadge, requestStatusLabels } from '@/utils/enum/status.enum';
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
import { Input } from '@/components/ui/input';
import { mapEnumToValues } from '@/utils/functions/enum.function';
import { DataTable } from '@/components/table/data-table';
import { columns as tableColumns } from './columns';
import RequestCard from './request-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getRequestType } from '@/lib/helper';

export default function Page() {
    // State for filtering
    const [selectedRequestType, setSelectedRequestType] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [viewMode, setViewMode] = useState<'column' | 'table'>('column');

    const { data: requests, isLoading } = useQuery({
        queryKey: ['requests'],
        queryFn: () => getRequests(),
    });

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

    // Define the columns for the Kanban board
    const columns = mapEnumToValues(RequestStatus).map((status) => ({
        id: Number(status),
        title: requestStatusLabels[status],
        color: requestStatusBadge[status],
    }));

    const getRequestsByStatus = (status: number) => {
        if (status === 0) {
            return filteredRequests.filter((request) => request.status === 0 || !request.status);
        }
        return filteredRequests.filter((request) => request.status === Number(status));
    };

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
            <div className="mb-6 space-y-4 bg-muted/30 p-4 rounded-lg border">
                <div className="flex justify-between items-center">
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
                            <Select
                                value={selectedRequestType}
                                onValueChange={setSelectedRequestType}
                            >
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
                    </div>

                    {/* Filter count */}
                    {/* <div className="ml-auto">
                        <Badge variant="outline" className="bg-primary/10">
                            {filteredRequests?.length || 0} phiếu
                        </Badge>
                    </div> */}

                    <div className="flex items-center gap-1 border rounded-md p-1">
                        <Button
                            variant={viewMode === 'column' ? 'default' : 'ghost'}
                            size="sm"
                            className="h-7 px-4"
                            onClick={() => setViewMode('column')}
                        >
                            <Columns3 className="h-4 w-4" />
                            <span>Dạng cột</span>
                        </Button>
                        <Button
                            variant={viewMode === 'table' ? 'default' : 'ghost'}
                            size="sm"
                            className="h-7 px-4"
                            onClick={() => setViewMode('table')}
                        >
                            <Table className="h-4 w-4" />
                            <span>Dạng bảng</span>
                        </Button>
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

            {/* Column View */}
            {viewMode === 'column' && (
                <div className="flex-1 overflow-auto py-4">
                    <div className="h-full gap-8 pb-4 overflow-x-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {columns.map((column) => (
                            <div
                                key={column.id}
                                className={`flex-shrink-0 flex flex-col rounded-md ${column.color}`}
                            >
                                <div className="p-3 font-medium flex items-center justify-between border-b text-black">
                                    <h3>{column.title}</h3>
                                    <Badge variant="outline" className="text-black">
                                        {getRequestsByStatus(column.id).length}
                                    </Badge>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px]">
                                    <ScrollArea className="max-h-screen space-x-2 py-2">
                                        {getRequestsByStatus(column.id).map((request) => (
                                            <RequestCard
                                                request={request}
                                                key={request.requestId}
                                            />
                                        ))}
                                    </ScrollArea>
                                    {getRequestsByStatus(column.id).length === 0 && (
                                        <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
                                            Không có phiếu yêu cầu
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="py-6">
                    <DataTable columns={tableColumns} data={filteredRequests} />
                </div>
            )}

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests?.map((request) => {
                    return <RequestCard request={request} key={request.requestId} />;
                })}
            </div> */}

            {/* {filteredRequests?.length === 0 && (
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
                    </div>
                </div>
            )} */}
        </div>
    );
}
