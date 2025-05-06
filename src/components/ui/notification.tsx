'use client';

import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    BellIcon,
    InboxIcon,
    Trash2Icon,
    XIcon,
    AlertCircleIcon,
    CheckCheck,
    RotateCw,
    Tag,
    Phone,
    Mail,
    Calendar,
    MapPin,
    IdCard,
    Activity,
    X,
    Send,
    Globe,
    Sprout,
    Ruler,
    Code,
    FileText,
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
import { acceptInvitation, getFarms, rejectInvitation } from '@/services/farm.service';
import InfoItem from '../info-item';
import dayjs from 'dayjs';
import { scaleLabels, userStatusLabels, userStatusVariant } from '@/utils/enum/status.enum';
import { useSignalR } from '@/hooks';
import { env } from '@/env';
import { getAreaUnits } from '@/services/category.service';

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
        queryFn: async () => {
            const notifications = await getNotificationForCurrentUser();
            // Sort notifications by newest first
            return notifications.sort(
                (a, b) =>
                    new Date(b.createdWhen ?? 0).getTime() - new Date(a.createdWhen ?? 0).getTime(),
            );
        },
    });

    const { data: allFarms } = useQuery({
        queryKey: ['allFarms'],
        queryFn: getFarms,
    });

    // Get all area units
    const { data: areaUnits } = useQuery({
        queryKey: ['areaUnits'],
        queryFn: () => getAreaUnits(),
    });

    // SignalR connection
    useSignalR({
        url: env.NEXT_PUBLIC_API_URL + '/noti',
        onConnected: (connection) => {
            connection.on('SendMessage', (message: any) => {
                console.log('Received message:', message);
                // Refetch notifications when a new message is received
                refetch();

                // Save the original title
                const originalTitle = document.title;

                // Function to toggle the title
                let toggle = true;
                const interval = setInterval(() => {
                    document.title = toggle ? '🔔 Bạn có thông báo mới! | CFMS' : originalTitle;
                    toggle = !toggle;
                }, 1000);

                // Stop toggling after a certain duration (e.g., 15 seconds)
                setTimeout(() => {
                    clearInterval(interval);
                    document.title = originalTitle; // Reset to the original title
                }, 10000);
            });
        },
    });

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

    const farm = useMemo(() => {
        const farmCodeMatch = currentNotification?.content?.match(/trang trại (\w+)\s*\(/i);
        if (farmCodeMatch && farmCodeMatch[1]) {
            const farmCode = farmCodeMatch[1];
            return allFarms?.find((farm) => farm.farmCode === farmCode);
        } else {
            return null;
        }
    }, [allFarms, notifications]);

    const unit = useMemo(() => {
        if (!areaUnits) return '';
        const areaUnit = areaUnits?.find((unit) => unit.subCategoryId === farm?.areaUnitId);
        return areaUnit?.subCategoryName || '';
    }, [areaUnits, farm]);

    const queryClient = useQueryClient();

    const handleMarkAllAsRead = async () => {
        try {
            await readAllNotifications();
            await refetch();
            // toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
        } catch (error) {
            console.error(error);
            // toast(error?.response?.data?.message, { icon: '⚠️' });
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
            queryClient.invalidateQueries({ queryKey: ['farms'] });

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
            toast(error?.response?.data?.message, { icon: '⚠️' });
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
            queryClient.invalidateQueries({ queryKey: ['farms'] });
        } catch (error: any) {
            console.error(error);
            toast(error?.response?.data?.message, { icon: '⚠️' });
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
    //         toast('Không thể xóa thông báo', { icon: '⚠️' });
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
            toast('Không thể xóa tất cả thông báo', { icon: '⚠️' });
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
            toast('Không thể xóa thông báo', { icon: '⚠️' });
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
                                                src={
                                                    notification.createdByUser?.fullName
                                                        ?.toLowerCase()
                                                        ?.includes('sys')
                                                        ? '/assets/logo/logo.png'
                                                        : convertToThumbnailUrl(
                                                              notification.createdByUser?.avatar ||
                                                                  '',
                                                          )
                                                }
                                                alt={notification.createdByUser?.fullName || ''}
                                                className="rounded-sm object-contain"
                                            />
                                            <AvatarFallback className="rounded-sm">
                                                {initials(
                                                    notification.createdByUser?.fullName || '',
                                                )}
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
                        <DialogTitle className="flex items-center gap-2">
                            <Send size={20} />
                            {(currentNotification && currentNotification?.notificationName) ||
                                'Tham gia trang trại'}
                        </DialogTitle>
                        <DialogDescription>
                            {currentNotification?.content ||
                                'Vui lòng nhập mã trang trại để xác nhận tham gia.'}
                        </DialogDescription>
                    </DialogHeader>
                    {/* Dialog for enroll farm */}
                    {currentNotification?.notificationType === NotificationTypeEnum.ENROLL_FARM &&
                        currentNotification?.createdByUser && (
                            <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4 shadow-md">
                                {/* <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                    Thông tin chi tiết
                                </h3>
                            </div> */}

                                <InfoItem
                                    label="Họ và tên"
                                    value={currentNotification.createdByUser?.fullName}
                                    icon={<Tag size={16} />}
                                />

                                <InfoItem
                                    label="Số điện thoại"
                                    value={
                                        currentNotification.createdByUser?.phoneNumber || 'Không có'
                                    }
                                    icon={<Phone size={16} />}
                                />

                                <InfoItem
                                    label="Email"
                                    value={currentNotification.createdByUser?.mail}
                                    icon={<Mail size={16} />}
                                />

                                <InfoItem
                                    label="Ngày sinh"
                                    value={
                                        currentNotification.createdByUser?.dateOfBirth
                                            ? dayjs(
                                                  currentNotification.createdByUser?.dateOfBirth,
                                              ).format('DD/MM/YYYY')
                                            : 'Không có'
                                    }
                                    icon={<Calendar size={16} />}
                                />

                                <InfoItem
                                    label="Địa chỉ"
                                    value={currentNotification.createdByUser?.address || 'Không có'}
                                    icon={<MapPin size={16} />}
                                />

                                <InfoItem
                                    label="CCCD"
                                    value={currentNotification.createdByUser?.cccd || 'Không có'}
                                    icon={<IdCard size={16} />}
                                />

                                <InfoItem
                                    label="Trạng thái"
                                    value={
                                        <Badge
                                            variant={
                                                userStatusVariant[
                                                    currentNotification.createdByUser?.status
                                                ]
                                            }
                                        >
                                            {
                                                userStatusLabels[
                                                    currentNotification.createdByUser?.status
                                                ]
                                            }
                                        </Badge>
                                    }
                                    icon={<Activity size={16} />}
                                />

                                {/* <InfoItem
                                label="Vai trò hệ thống"
                                value={`Vai trò ${currentNotification.createdByUser?.systemRole}`}
                                icon={<User size={16} />}
                            /> */}
                            </div>
                        )}

                    {/* Dialog for invite farm */}
                    {currentNotification?.notificationType === NotificationTypeEnum.INVITE_FARM &&
                        currentNotification?.createdByUser &&
                        farm && (
                            <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4 shadow-md">
                                {/* <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                    Thông tin chi tiết
                                </h3>
                            </div> */}

                                <InfoItem
                                    label="Tên trang trại"
                                    value={farm?.farmName || 'Không có tên trang trại'}
                                    icon={<FileText size={16} />}
                                />

                                <InfoItem
                                    label="Mã trang trại"
                                    value={farm?.farmCode || 'Không có mã trang trại'}
                                    icon={<Code size={16} />}
                                />

                                <InfoItem
                                    label="Địa chỉ"
                                    value={farm?.address || 'Không có địa chỉ'}
                                    icon={<MapPin size={16} />}
                                />

                                <InfoItem
                                    label="Diện tích"
                                    value={`${farm?.area || 0} ${unit}`}
                                    icon={<Ruler size={16} />}
                                />

                                <InfoItem
                                    label="Quy mô"
                                    value={`${scaleLabels[farm?.scale]}`}
                                    icon={<Sprout size={16} />}
                                />

                                <InfoItem
                                    label="Số điện thoại"
                                    value={farm?.phoneNumber || 'Không có số điện thoại'}
                                    icon={<Phone size={16} />}
                                />

                                <InfoItem
                                    label="Website"
                                    value={farm?.website || 'Không có website'}
                                    icon={<Globe size={16} />}
                                />

                                {/* <InfoItem
                                label="Vai trò hệ thống"
                                value={`Vai trò ${currentNotification.createdByUser?.systemRole}`}
                                icon={<User size={16} />}
                            /> */}
                            </div>
                        )}
                    <DialogFooter className="sm:justify-between">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleReject}
                            disabled={isSubmitting}
                        >
                            <X className="h-4 w-4" />
                            Từ chối
                        </Button>
                        <Button type="button" onClick={handleAccept} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <CheckCheck className="h-4 w-4" />
                                    Chấp nhận
                                </>
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
