'use client';

import * as React from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';

import { HeaderLogo } from './header-logo';
import { sidebarItems } from '@/utils/constants/sidebar.constant';
import SidebarFooterMenu from './sidebar-footer-menu';
import SidebarNavigation from './sidebar-navigation';
import { currentUser } from '@/utils/data/mock.data';
import SidebarOverview from './sidebar-overview';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const user = {
        name: currentUser.fullName,
        email: currentUser.mail,
        avatar: currentUser.avatar,
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <HeaderLogo />
            </SidebarHeader>
            <SidebarContent>
                <SidebarNavigation sidebarItems={sidebarItems} />
                <SidebarOverview />
            </SidebarContent>
            <SidebarFooter>
                <SidebarFooterMenu user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
