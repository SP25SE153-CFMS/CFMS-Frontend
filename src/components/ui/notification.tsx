'use client';

import type React from 'react';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    BellIcon,
    InboxIcon,
    Trash2Icon,
    XIcon,
    AlertCircleIcon,
    CheckCheck,
    RotateCw,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    getNotificationForCurrentUser,
    readAllNotifications,
    clearAllNotifications,
    clearOneNotification,
    readOneNotification,
} from '@/services/notification.service';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import initials from 'initials';
import { convertToThumbnailUrl, formatRelativeTime } from '@/utils/functions';
import { NotificationTypeEnum } from '@/utils/enum/notification-type.enum';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { NotificationResponse } from '@/utils/types/custom.type';
import { useSignalR } from '@/hooks';
import { acceptInvitation, rejectInvitation } from '@/services/farm.service';

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
    const {
        data: notifications,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => getNotificationForCurrentUser(),
    });
    // const [notifications, setNotifications] = useState<NotificationResponse[]>();

    const { notifications: noties, connected } = useSignalR('/noti');
    console.log(noties, connected);

    // useEffect(() => {
    //     setNotifications(
    //         notis?.map((noti) => ({
    //             ...noti,
    //             notificationType: 'INVITATION',
    //         })),
    //     );
    // }, [notis]);

    const [open, setOpen] = useState(false);
    const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
    const [farmCodeDialogOpen, setFarmCodeDialogOpen] = useState(false);
    const [currentNotification, setCurrentNotification] = useState<NotificationResponse | null>(
        null,
    );
    // const [farmCode, setFarmCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Count unread notifications (note: checking !isRead since true means it has been read)
    const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;
    const totalCount = notifications?.length || 0;

    const handleMarkAllAsRead = async () => {
        try {
            await readAllNotifications();
            await refetch();
            // toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
        } catch (error) {
            console.error(error);
            // toast.error(error?.response?.data?.message);
        }
    };

    const handleNotificationClick = async (noti: NotificationResponse) => {
        try {
            if (
                noti.notificationType === NotificationTypeEnum.ENROLL_FARM ||
                noti.notificationType === NotificationTypeEnum.INVITE_FARM
            ) {
                // Open the farm code dialog
                setCurrentNotification(noti);
                setFarmCodeDialogOpen(true);
            }

            await readOneNotification(noti.notificationId);
            await refetch();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAccept = async () => {
        if (!currentNotification) return;

        setIsSubmitting(true);
        try {
            const response = await acceptInvitation(currentNotification.notificationId);
            toast.success(response.message);
            setFarmCodeDialogOpen(false);

            // Redirect to appropriate page if needed
            // if (currentNotification.metadata && typeof currentNotification.metadata === 'object') {
            //     if (
            //         'farmId' in currentNotification.metadata &&
            //         typeof currentNotification.metadata.farmId === 'string'
            //     ) {
            //         router.push(`/farms/${currentNotification.metadata.farmId}`);
            //     }
            // }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!currentNotification) return;

        setIsSubmitting(true);
        try {
            // Here you would call your API to reject the invitation/enrollment
            const response = await rejectInvitation(currentNotification.notificationId);
            toast.success(response.message);
            setFarmCodeDialogOpen(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // const handleDeleteNotification = async (id: string) => {
    //     try {
    //         await clearOneNotification(id);
    //         await refetch();
    //         // toast.success('Đã xóa thông báo');
    //     } catch (error) {
    //         toast.error('Không thể xóa thông báo');
    //     }
    //     setDeleteDialogOpen(false);
    //     setNotificationToDelete(null);
    // };

    const handleDeleteAllNotifications = async () => {
        try {
            await clearAllNotifications();
            await refetch();
            // toast.success('Đã xóa tất cả thông báo');
        } catch (error) {
            toast.error('Không thể xóa tất cả thông báo');
        }
        setDeleteAllDialogOpen(false);
    };

    const confirmDeleteNotification = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        // setNotificationToDelete(id);
        // setDeleteDialogOpen(true);
        try {
            await clearOneNotification(id);
            await refetch();
            // toast.success('Đã xóa thông báo');
        } catch (error) {
            toast.error('Không thể xóa thông báo');
        }
    };

    const confirmDeleteAllNotifications = () => {
        setDeleteAllDialogOpen(true);
    };

    return (
        <>
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
                            // <Badge
                            //     className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs"
                            //     variant="destructive"
                            // >
                            //     {unreadCount > 99 ? '99+' : unreadCount}
                            // </Badge>
                            <Badge
                                className="absolute -right-0 -top-0 flex h-3 min-w-3 items-center px-0 justify-center rounded-full text-xs"
                                variant="destructive"
                            />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0 shadow-lg" align="end">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <div className="flex items-center gap-2">
                            <h3 className="font-medium">Thông báo</h3>
                            {unreadCount > 0 && (
                                <Badge variant="default" className="px-2 py-0.5">
                                    {unreadCount} chưa đọc
                                </Badge>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => refetch()}
                                        >
                                            <RotateCw className="h-4 w-4" />
                                            <span className="sr-only">Lấy thông báo mới nhất</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Lấy thông báo mới nhất</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            {unreadCount > 0 && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={handleMarkAllAsRead}
                                            >
                                                <CheckCheck className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Đánh dấu tất cả đã đọc
                                                </span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Đánh dấu tất cả đã đọc</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                            {totalCount > 0 && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                onClick={confirmDeleteAllNotifications}
                                            >
                                                <Trash2Icon className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Xóa tất cả thông báo
                                                </span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Xóa tất cả thông báo</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex h-[350px] items-center justify-center">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        </div>
                    ) : notifications && notifications.length > 0 ? (
                        <ScrollArea className="h-[350px]">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.notificationId}
                                    className={`group relative border-b px-4 py-3 transition-colors hover:bg-accent ${!notification.isRead ? 'bg-accent/30' : ''}`}
                                >
                                    <div className="flex gap-3">
                                        <Avatar className="h-10 w-10 rounded-full object-cover">
                                            <AvatarImage
                                                src={convertToThumbnailUrl(
                                                    notification.user.avatar || '',
                                                )}
                                                alt={notification.user.fullName}
                                                className="rounded-sm object-contain"
                                            />
                                            <AvatarFallback className="rounded-sm">
                                                {initials(notification.user.fullName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <button
                                                className="text-left text-sm after:absolute after:inset-0"
                                                onClick={() =>
                                                    handleNotificationClick(notification)
                                                }
                                            >
                                                {/* <span className="font-semibold hover:underline">
                                                    {notification.user.fullName}
                                                </span> */}
                                                <div className="font-semibold hover:underline">
                                                    {notification.notificationName}
                                                </div>
                                                <div className="my-1 text-muted-foreground max-w-60">
                                                    {notification.content}
                                                </div>
                                            </button>
                                            <div className="text-xs text-muted-foreground">
                                                {formatRelativeTime(
                                                    notification.createdWhen?.toString() ?? '',
                                                )}
                                            </div>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="absolute right-12 top-1/2 -translate-y-1/2">
                                                <Dot className="h-2 w-2 fill-primary" />
                                            </div>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) =>
                                                confirmDeleteNotification(
                                                    notification.notificationId,
                                                    e,
                                                )
                                            }
                                        >
                                            <XIcon className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                            <span className="sr-only">Xóa thông báo</span>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>
                    ) : (
                        <div className="flex h-[250px] flex-col items-center justify-center gap-2 p-4 text-center">
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

            {/* Farm Code Dialog for ENROLLMENT or INVITATION */}
            <Dialog open={farmCodeDialogOpen} onOpenChange={setFarmCodeDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {(currentNotification && currentNotification?.notificationName) ||
                                'Tham gia trang trại'}
                        </DialogTitle>
                        <DialogDescription>
                            {currentNotification?.content ||
                                'Vui lòng nhập mã trang trại để xác nhận tham gia.'}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReject}
                            disabled={isSubmitting}
                        >
                            Từ chối
                        </Button>
                        <Button type="button" onClick={handleAccept} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                                    Đang xử lý...
                                </>
                            ) : (
                                'Chấp nhận'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete All Notifications Dialog */}
            <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircleIcon className="h-5 w-5 text-destructive" />
                            Xóa tất cả thông báo
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa tất cả thông báo không? Hành động này không
                            thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={handleDeleteAllNotifications}
                        >
                            Xóa tất cả
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
