'use client';

import { PanelsTopLeft, Users } from 'lucide-react';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import config from '@/configs';
import Link from 'next/link';

export default function SidebarFarmOwnerOverview() {
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Tổng quan</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {/* Dashboard */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={config.routes.farmOwner.dashboard}>
                                <PanelsTopLeft />
                                <span>Trang chủ</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Farm Settings */}
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href={config.routes.farmOwner.farmEmployee}>
                                <Users />
                                <span>Quản lý nhân công</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
