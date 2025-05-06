'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { ChevronsUpDown, Map, Plus } from 'lucide-react';
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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getFarmsForCurrentUser } from '@/services/farm.service';
import Image from '@/components/fallback-image';
import { Farm } from '@/utils/schemas/farm.schema';
import Link from 'next/link';
import config from '@/configs';
import { ScrollArea } from '../ui/scroll-area';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { FarmResponse } from '@/utils/types/custom.type';
import { FarmRole, farmRoleLabels } from '@/utils/enum';
import { Skeleton } from '../ui/skeleton';

const FARM_IMAGE_SIZE = 24;
const DEFAULT_IMAGE = '/no-data.jpg';

interface FarmImageProps {
    src?: string;
    alt: string;
    size?: number;
    className?: string;
}

const FarmImage = ({ src, alt, size = FARM_IMAGE_SIZE, className = '' }: FarmImageProps) => (
    <Image
        src={src || DEFAULT_IMAGE}
        alt={alt}
        width={size}
        height={size}
        className={`rounded-md object-cover ${className}`}
        priority
    />
);

const FarmSkeleton = () => (
    <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="grid text-left text-sm gap-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
        </div>
    </div>
);

export default function FarmSwitcher() {
    const router = useRouter();
    const { isMobile } = useSidebar();
    const queryClient = useQueryClient();

    // Fetch farms for the current user
    const { data: farms } = useQuery({
        queryKey: ['farms'],
        queryFn: getFarmsForCurrentUser,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Determine the current farm based on cookies
    const currentFarm = useMemo(() => {
        const farmId = getCookie(config.cookies.farmId);
        return farms?.find((farm) => farm.farmId === farmId);
    }, [farms]);

    // State for the active farm
    const [activeFarm, setActiveFarm] = useState<Farm | null>(currentFarm ?? null);

    // Sync active farm with session storage or fallback to current farm
    useEffect(() => {
        const storedFarm = (() => {
            try {
                return JSON.parse(sessionStorage.getItem('activeFarm') || '{}') as Farm;
            } catch {
                return {} as Farm;
            }
        })();

        if (Object.keys(storedFarm).length > 0) {
            setActiveFarm(storedFarm);
        } else if (currentFarm) {
            setActiveFarm(currentFarm);
        }
    }, [currentFarm]);

    // Handle farm selection
    const handleFarmSelect = useCallback(
        (farm: FarmResponse) => {
            setActiveFarm(farm);
            try {
                sessionStorage.setItem('activeFarm', JSON.stringify(farm));
                setCookie(config.cookies.farmId, farm.farmId);
                setCookie(config.cookies.farmRole, farm.farmRole);

                // Invalidate queries to refetch data
                queryClient.invalidateQueries();

                // Redirect based on farm role
                const route =
                    farm.farmRole === FarmRole.OWNER
                        ? `${config.routes.dashboard}?farmCode=${farm.farmCode}`
                        : `${config.routes.welcome}?farmCode=${farm.farmCode}`;
                router.push(route);
            } catch (error) {
                console.error('Error setting active farm:', error);
            }
        },
        [queryClient, router],
    );

    // Render the active farm
    const renderActiveFarm = useMemo(() => {
        if (!activeFarm) return <FarmSkeleton />;

        return (
            <>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                    <FarmImage src={activeFarm.imageUrl} alt={activeFarm.farmCode} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{activeFarm.farmName}</span>
                    <span className="truncate text-xs">{activeFarm.farmCode}</span>
                </div>
            </>
        );
    }, [activeFarm]);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            {renderActiveFarm}
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
                                    onClick={() => handleFarmSelect(farm)}
                                    className="gap-2 p-2"
                                >
                                    <div className="flex size-8 items-center justify-center rounded-sm border">
                                        <FarmImage src={farm.imageUrl} alt={farm.farmCode} />
                                    </div>
                                    <div className="gap-1">
                                        <p className="font-semibold text-sm">{farm.farmName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Vai trò: {farmRoleLabels[farm.farmRole]}
                                        </p>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </ScrollArea>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Map className="size-4" />
                            </div>
                            <Link
                                href={config.routes.farm}
                                className="font-medium text-muted-foreground"
                            >
                                Xem bản đồ
                            </Link>
                        </DropdownMenuItem>
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
