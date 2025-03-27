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
import { getCategories } from '@/services/category.service';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const user = {
        name: currentUser.fullName,
        email: currentUser.mail,
        avatar: currentUser.avatar,
    };

    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategories(),
    });

    useEffect(() => {
        if (categories) {
            sessionStorage.setItem('categories', JSON.stringify(categories));
        }
    }, [categories]);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <HeaderLogo />
            </SidebarHeader>
            <SidebarContent>
                <SidebarNavigation sidebarItems={sidebarItems} />
                <SidebarOverview categories={categories} isLoading={isLoading} />
            </SidebarContent>
            <SidebarFooter>
                <SidebarFooterMenu user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
