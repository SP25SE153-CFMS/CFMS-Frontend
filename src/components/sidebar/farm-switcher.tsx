import { useState } from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
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
import { useQuery } from '@tanstack/react-query';
import { getFarmsForCurrentUser } from '@/services/farm.service';
import Image from 'next/image';
import { Farm } from '@/utils/schemas/farm.schema';
import Link from 'next/link';
import config from '@/configs';
import { ScrollArea } from '../ui/scroll-area';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

export function FarmSwitcher() {
    const { data: farms } = useQuery({
        queryKey: ['farms'],
        queryFn: () => getFarmsForCurrentUser(),
    });

    const router = useRouter();
    const { isMobile } = useSidebar();
    const [activeFarm, setActiveFarm] = useState<Farm>(
        JSON.parse(sessionStorage.getItem('activeFarm') || '{}'),
    );

    console.log(activeFarm);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                                <Image
                                    src={activeFarm.imageUrl ?? '/no-data.jpg'}
                                    alt={activeFarm.farmName}
                                    width={24}
                                    height={24}
                                    className="rounded-md object-cover"
                                />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {activeFarm.farmName}
                                </span>
                                <span className="truncate text-xs">{activeFarm.farmCode}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Danh sách trang trại
                        </DropdownMenuLabel>
                        <ScrollArea className="h-[20rem]">
                            {farms?.map((farm) => (
                                <DropdownMenuItem
                                    key={farm.farmId}
                                    onClick={() => {
                                        setActiveFarm(farm);
                                        sessionStorage.setItem('activeFarm', JSON.stringify(farm));
                                        setCookie(config.cookies.farmId, farm.farmId);
                                        router.push(
                                            `${config.routes.dashboard}?farmCode=${farm.farmCode}`,
                                        );
                                    }}
                                    className="gap-2 p-2"
                                >
                                    <div className="flex size-6 items-center justify-center rounded-sm border">
                                        <Image
                                            src={farm.imageUrl ?? '/no-data.jpg'}
                                            alt={farm.farmName}
                                            width={24}
                                            height={24}
                                        />
                                    </div>
                                    {farm.farmName}
                                    {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
                                </DropdownMenuItem>
                            ))}
                        </ScrollArea>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4" />
                            </div>
                            <Link
                                href={config.routes.farmRegister}
                                className="font-medium text-muted-foreground"
                            >
                                Thêm trang trại
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
