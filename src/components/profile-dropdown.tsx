'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import config from '@/configs';
import initials from 'initials';
import Link from 'next/link';
import { signOutUser } from '@/utils/functions/sign-out.function';
import { BadgeCheck } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/services/auth.service';
import { LoadingSpinner } from './ui/loading-spinner';
import { convertToThumbnailUrl } from '@/utils/functions';

export function ProfileDropdown() {
    const { data: currentUser, isLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const user = await getCurrentUser();
            sessionStorage.setItem('userId', user.userId);
            return user;
        },
    });

    if (isLoading) {
        return <LoadingSpinner className="size-8" />;
    }

    if (!currentUser) {
        return (
            <Avatar className="size-8 rounded-lg">
                {/* <AvatarImage src={currentUser.avatar || ''} alt={currentUser.fullName} /> */}
                <AvatarFallback className="rounded-lg">N/A</AvatarFallback>
            </Avatar>
        );
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={convertToThumbnailUrl(currentUser.avatar || '')}
                            alt={currentUser.fullName}
                        />
                        <AvatarFallback>{initials(currentUser.fullName)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="size-8 rounded-lg">
                            <AvatarImage
                                src={convertToThumbnailUrl(currentUser.avatar || '')}
                                alt={currentUser.fullName}
                            />
                            <AvatarFallback className="rounded-lg">
                                {initials(currentUser.fullName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{currentUser.fullName}</span>
                            <span className="truncate text-xs">{currentUser.mail}</span>
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
                    <Link href={config.routes.signIn} onClick={async () => await signOutUser()}>
                        <LogOut />
                        Đăng xuất
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
