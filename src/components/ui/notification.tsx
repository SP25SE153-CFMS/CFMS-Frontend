'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BellIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const initialNotifications = [
    {
        id: 1,
        image: 'https://res.cloudinary.com/dvqtkzmr5/image/upload/v1742739905/br6rdpwxl96f7ho9vl59.png',
        user: 'Chris Tompson',
        action: 'requested review on',
        target: 'PR #42: Feature implementation',
        timestamp: '15 phút trước',
        unread: true,
    },
    {
        id: 2,
        image: 'https://res.cloudinary.com/dvqtkzmr5/image/upload/v1742739905/br6rdpwxl96f7ho9vl59.png',
        user: 'Emma Davis',
        action: 'shared',
        target: 'New component library',
        timestamp: '45 phút trước',
        unread: true,
    },
    {
        id: 3,
        image: 'https://res.cloudinary.com/dvqtkzmr5/image/upload/v1742739905/br6rdpwxl96f7ho9vl59.png',
        user: 'James Wilson',
        action: 'assigned you to',
        target: 'API integration task',
        timestamp: '4 giờ trước',
        unread: false,
    },
    {
        id: 4,
        image: 'https://res.cloudinary.com/dvqtkzmr5/image/upload/v1742739905/br6rdpwxl96f7ho9vl59.png',
        user: 'Alex Morgan',
        action: 'replied to your comment in',
        target: 'Authentication flow',
        timestamp: '12 giờ trước',
        unread: false,
    },
    {
        id: 5,
        image: 'https://res.cloudinary.com/dvqtkzmr5/image/upload/v1742739905/br6rdpwxl96f7ho9vl59.png',
        user: 'Sarah Chen',
        action: 'commented on',
        target: 'Dashboard redesign',
        timestamp: '2 ngày trước',
        unread: false,
    },
    {
        id: 6,
        image: 'https://res.cloudinary.com/dvqtkzmr5/image/upload/v1742739905/br6rdpwxl96f7ho9vl59.png',
        user: 'Miky Derya',
        action: 'mentioned you in',
        target: 'Origin UI open graph image',
        timestamp: '2 weeks ago',
        unread: false,
    },
];

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
    const [notifications, setNotifications] = useState(initialNotifications);
    const unreadCount = notifications.filter((n) => n.unread).length;

    const handleMarkAllAsRead = () => {
        setNotifications(
            notifications.map((notification) => ({
                ...notification,
                unread: false,
            })),
        );
    };

    const handleNotificationClick = (id: number) => {
        setNotifications(
            notifications.map((notification) =>
                notification.id === id ? { ...notification, unread: false } : notification,
            ),
        );
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="relative"
                    aria-label="Open notifications"
                >
                    <BellIcon size={14} aria-hidden="true" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1 justify-center">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-1">
                <div className="flex items-baseline justify-between gap-4 px-3 py-2">
                    <div className="text-sm font-semibold">Thông báo</div>
                    {unreadCount > 0 && (
                        <button
                            className="text-xs font-medium hover:underline"
                            onClick={handleMarkAllAsRead}
                        >
                            Đánh dấu tất cả đã đọc
                        </button>
                    )}
                </div>
                <div
                    role="separator"
                    aria-orientation="horizontal"
                    className="bg-border -mx-1 my-1 h-px"
                ></div>
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
                    >
                        <div className="relative flex items-start gap-3 pe-3">
                            <Image
                                className="size-9 rounded-md"
                                src={notification.image}
                                width={32}
                                height={32}
                                alt={notification.user}
                            />
                            <div className="flex-1 space-y-1">
                                <button
                                    className="text-foreground/80 text-left after:absolute after:inset-0"
                                    onClick={() => handleNotificationClick(notification.id)}
                                >
                                    <span className="text-foreground font-medium hover:underline">
                                        {notification.user}
                                    </span>{' '}
                                    {notification.action}{' '}
                                    <span className="text-foreground font-medium hover:underline">
                                        {notification.target}
                                    </span>
                                    .
                                </button>
                                <div className="text-muted-foreground text-xs">
                                    {notification.timestamp}
                                </div>
                            </div>
                            {notification.unread && (
                                <div className="absolute end-0 self-center">
                                    <Dot />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </PopoverContent>
        </Popover>
    );
}
