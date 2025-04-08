'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Image from 'next/image';
import { BellIcon, InboxIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getNotificationForCurrentUser } from '@/services/notification.service';

function Dot({ className }: { className?: string }) {
    return (
        <svg
            width="6"
            height="6"
            fill="currentColor"
            viewBox="0 0 6 6"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <circle cx="3" cy="3" r="3" />
        </svg>
    );
}

export default function Notification() {
    const { data: initialNotifications, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => getNotificationForCurrentUser(),
    });

    const [notifications, setNotifications] = useState(initialNotifications);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setNotifications(initialNotifications);
    }, [initialNotifications]);

    // Count unread notifications (note: checking !isRead since true means it has been read)
    const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

    // const handleMarkAllAsRead = () => {
    //     setNotifications(
    //         notifications?.map((notification) => ({
    //             ...notification,
    //             isRead: true,
    //         })),
    //     );
    // };

    const handleNotificationClick = (id: string) => {
        setNotifications(
            notifications?.map((notification) =>
                notification.notificationId === id
                    ? { ...notification, isRead: true }
                    : notification,
            ),
        );
    };

    console.log(notifications);

    // eslint-disable-next-line no-unused-vars
    const formatNotificationTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return formatDistanceToNow(date, { addSuffix: true, locale: vi });
        } catch (error) {
            return '';
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                    aria-label={`${unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Không có thông báo mới'}`}
                >
                    <BellIcon className="h-5 w-5" aria-hidden="true" />
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs"
                            variant="destructive"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h3 className="font-medium">Thông báo</h3>
                    {/* {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-xs font-medium"
                            onClick={handleMarkAllAsRead}
                        >
                            <CheckIcon className="h-3.5 w-3.5" />
                            Đánh dấu tất cả đã đọc
                        </Button>
                    )} */}
                </div>

                {isLoading ? (
                    <div className="flex h-[300px] items-center justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    </div>
                ) : notifications && notifications.length > 0 ? (
                    <ScrollArea className="h-[300px]">
                        {notifications.map((notification) => (
                            <div
                                key={notification.notificationId}
                                className={`relative border-b px-4 py-3 transition-colors hover:bg-accent ${!notification.isRead ? 'bg-accent/30' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <Image
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={
                                            notification.user.avatar ||
                                            '/placeholder.svg?height=40&width=40'
                                        }
                                        width={40}
                                        height={40}
                                        alt={notification.user.fullName}
                                    />
                                    <div className="flex-1 space-y-1">
                                        <button
                                            className="text-left text-sm after:absolute after:inset-0"
                                            onClick={() =>
                                                handleNotificationClick(notification.notificationId)
                                            }
                                        >
                                            <span className="font-semibold hover:underline">
                                                {notification.user.fullName}
                                            </span>{' '}
                                            <div className="hover:underline">
                                                {notification.notificationName}
                                            </div>
                                            {/* {notification.content}{' '}
                                            <span className="font-medium hover:underline">
                                                {notification.notificationName}
                                            </span> */}
                                        </button>
                                        {/* <div className="text-xs text-muted-foreground">
                                            {formatNotificationTime(notification.createdAt)}
                                        </div> */}
                                    </div>
                                    {!notification.isRead && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <Dot className="h-2 w-2 fill-primary" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                ) : (
                    <div className="flex h-[200px] flex-col items-center justify-center gap-2 p-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <InboxIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h4 className="text-sm font-medium">Không có thông báo</h4>
                        <p className="text-xs text-muted-foreground">
                            Bạn sẽ nhận được thông báo khi có hoạt động mới
                        </p>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
