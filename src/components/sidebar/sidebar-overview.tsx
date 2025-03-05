'use client';

import { BookCopy, ChevronRight, PanelsTopLeft } from 'lucide-react';
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
import { getCategories } from '@/services/category.service';
import { useQuery } from '@tanstack/react-query';

export default function SidebarOverview() {
    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories(),
    });

    // Check if categories are loading
    if (isLoading) {
        return (
            <SidebarMenu>
                {Array.from({ length: 5 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                        <SidebarMenuSkeleton showIcon />
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        );
    }

    // Check if categories data exists
    if (!categories) {
        return <></>;
    }

    // Return the page
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Tổng quan</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {/* Dashboard */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={config.routes.dashboard}>
                                <PanelsTopLeft />
                                <span>Trang chủ</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

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
                                    {categories.map((category) => (
                                        <SidebarMenuSubItem
                                            key={category.categoryId}
                                            className="flex items-center justify-between"
                                        >
                                            <SidebarMenuSubButton asChild>
                                                <Link href={`/category/${category.categoryId}`}>
                                                    <span>{category.categoryType}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
