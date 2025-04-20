import { UserIcon, Calendar } from 'lucide-react';
import { formatDate } from '@/utils/functions';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { User } from '@/utils/schemas/user.schema';
import { Badge } from '@/components/ui/badge';
import { requestStatusBadge, requestStatusLabels } from '@/utils/enum/status.enum';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import config from '@/configs';
import { RequestResponse } from '@/utils/types/custom.type';

export default function RequestCard({ request }: { request: RequestResponse }) {
    const getRequestType = (request: RequestResponse) => {
        if (!request) return 'Phiếu khác';
        if (request.taskRequests?.length > 0) {
            return 'Báo cáo, đánh giá';
        }
        return 'Nhập xuất kho';
    };

    const users: User[] = JSON.parse(sessionStorage.getItem('users') || '[]');
    const createdBy = users.find((user) => user.userId === request.createdByUserId);
    const approvedBy = users.find((user) => user.userId === request.approvedById);
    const requestType = getRequestType(request);

    return (
        <Card
            key={request.requestId}
            className="overflow-hidden hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] border-muted/80 group mb-4"
        >
            <CardHeader className="pb-2 bg-muted/20">
                <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-background/80">
                        {requestType}
                    </Badge>
                    <Badge
                        className={cn(
                            requestStatusBadge[request.status],
                            'hover:bg-inherit text-xs font-medium px-3 py-1',
                        )}
                    >
                        {requestStatusLabels[request.status] || 'Chưa xác định'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-4 pb-2">
                <div className="grid grid-cols-2 space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1.5 rounded-full">
                            <Calendar size={14} className="text-primary" />
                        </div>
                        <span className="flex flex-col">
                            <span className="text-muted-foreground text-xs">Ngày tạo:</span>
                            <span className="font-medium">
                                {formatDate(request.createdWhen) || 'Không có thông tin'}
                            </span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1.5 rounded-full">
                            <UserIcon size={14} className="text-primary" />
                        </div>
                        <span className="flex flex-col">
                            <span className="text-muted-foreground text-xs">Người tạo:</span>
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
                            <span className="text-muted-foreground text-xs">Ngày duyệt:</span>
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
                            <span className="text-muted-foreground text-xs">Người duyệt:</span>
                            <span className="font-medium">
                                {approvedBy?.fullName || 'Chưa duyệt'}
                            </span>
                        </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-4">
                <Link href={`${config.routes.request}/${request.requestId}`} className="w-full">
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
}
