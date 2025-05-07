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
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import config from '@/configs';
import initials from 'initials';
import Link from 'next/link';
import { signOutUser } from '@/utils/functions/sign-out.function';
import { BadgeCheck, Check, Moon, Sun } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/services/auth.service';
import { convertToThumbnailUrl } from '@/utils/functions';
import { useTheme } from '@/context/theme-context';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

export function ProfileDropdown() {
    const {
        data: currentUser,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const user = await getCurrentUser();
            sessionStorage.setItem('userId', user.userId);
            return user;
        },
    });

    const { theme, setTheme } = useTheme();

    /* Update theme-color meta tag
     * when theme is updated */
    useEffect(() => {
        const themeColor = theme === 'dark' ? '#020817' : '#fff';
        const metaThemeColor = document.querySelector("meta[name='theme-color']");
        if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
    }, [theme]);

    if (isLoading) {
        return <Skeleton className="w-8 h-8 rounded-full" />;
    }

    if (!currentUser) {
        refetch();
        // router.push(config.routes.signIn);
        return null;
        // return (
        //     <Avatar className="size-8 rounded-lg">
        //         {/* <AvatarImage src={currentUser.avatar || ''} alt={currentUser.fullName} /> */}
        //         <AvatarFallback className="rounded-lg">N/A</AvatarFallback>
        //     </Avatar>
        // );
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
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            Giao diện
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setTheme('light')}>
                                Sáng{' '}
                                <Check
                                    size={14}
                                    className={cn('ml-auto', theme !== 'light' && 'hidden')}
                                />
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('dark')}>
                                Tối
                                <Check
                                    size={14}
                                    className={cn('ml-auto', theme !== 'dark' && 'hidden')}
                                />
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('system')}>
                                Hệ thống
                                <Check
                                    size={14}
                                    className={cn('ml-auto', theme !== 'system' && 'hidden')}
                                />
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
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
