'use client';

import { CaretSortIcon } from '@radix-ui/react-icons';
import { BadgeCheck, LogOut } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import initials from 'initials';
import Link from 'next/link';
import config from '@/configs';
import { signOutUser } from '@/utils/functions/sign-out.function';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/services/auth.service';
import { LoadingSpinner } from '../ui/loading-spinner';
import { convertToThumbnailUrl } from '@/utils/functions';

export default function SidebarFooterMenu() {
    const { isMobile } = useSidebar();

    const { data: user, isLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => getCurrentUser(),
    });

    if (isLoading) {
        return <LoadingSpinner className="size-8" />;
    }

    if (!user) {
        return (
            <Avatar className="size-8 rounded-lg">
                {/* <AvatarImage src={user.avatar} alt={user.fullName} /> */}
                <AvatarFallback className="rounded-lg">N/A</AvatarFallback>
            </Avatar>
        );
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="size-8 rounded-lg">
                                <AvatarImage
                                    src={convertToThumbnailUrl(user.avatar || '')}
                                    alt={user.fullName}
                                />
                                <AvatarFallback className="rounded-lg">
                                    {initials(user.fullName)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user.fullName}</span>
                                <span className="truncate text-xs">{user.mail}</span>
                            </div>
                            <CaretSortIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="size-8 rounded-lg">
                                    <AvatarImage src={user.avatar} alt={user.fullName} />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user.fullName}</span>
                                    <span className="truncate text-xs">{user.mail}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href={config.routes.profile}>
                                    <BadgeCheck />
                                    Tài khoản
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link
                                href={config.routes.signIn}
                                onClick={async () => await signOutUser()}
                            >
                                <LogOut />
                                Đăng xuất
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
