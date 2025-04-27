'use client';

import { BookCopy, ChevronRight, PanelsTopLeft, Settings, Settings2 } from 'lucide-react';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import config from '@/configs';
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { CategoryResponse } from '@/utils/types/custom.type';
import { getCookie } from 'cookies-next';
import { FarmRole } from '@/utils/enum';

export default function SidebarOverview({
    categories,
    isLoading,
}: {
    categories?: CategoryResponse[];
    isLoading: boolean;
}) {
    const renderCategories = (categories: CategoryResponse[]) => {
        return (
            <>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href={config.routes.categoryUnit}>
                            <span>Danh mục đơn vị</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                {categories
                    .filter((category) => !category.categoryType.endsWith('UNIT'))
                    .map((category) => (
                        <SidebarMenuSubItem
                            key={category.categoryId}
                            className="flex items-center justify-between"
                        >
                            <SidebarMenuSubButton asChild>
                                <Link href={`/category/${category.categoryId}`}>
                                    <span>{category.categoryName}</span>
                                </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    ))}
            </>
        );
    };

    // Return the page
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Tổng quan</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {/* Dashboard */}
                    {getCookie(config.cookies.farmRole) === FarmRole.OWNER?.toString() && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href={config.routes.dashboard}>
                                    <PanelsTopLeft />
                                    <span>Trang chủ</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}

                    {/* Common Category */}
                    <Collapsible className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip="Danh mục dùng chung">
                                    <BookCopy />
                                    <span>Danh mục dùng chung</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem className="flex items-center justify-between">
                                        <SidebarMenuSubButton asChild>
                                            <Link href={config.routes.categoryAll}>
                                                <span>Tất cả</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    {isLoading || !categories ? (
                                        <SidebarMenu>
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <SidebarMenuItem key={index}>
                                                    <SidebarMenuSkeleton showIcon />
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    ) : (
                                        renderCategories(categories)
                                    )}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>

                    {/* Farm Settings */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={config.routes.settings}>
                                <Settings />
                                <span>Cài đặt trang trại</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* System Config */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={config.routes.config}>
                                <Settings2 />
                                <span>Cấu hình hệ thống</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
