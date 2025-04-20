'use client';

import * as React from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';

import { sidebarItems } from '@/utils/constants/sidebar.constant';
import SidebarFooterMenu from './sidebar-footer-menu';
import SidebarNavigation from './sidebar-navigation';
import SidebarOverview from './sidebar-overview';
import { getCategories } from '@/services/category.service';
import { useQuery } from '@tanstack/react-query';
import { FarmSwitcher } from './farm-switcher';
import SidebarFarmOwnerOverview from './sidebar-farm-owner-overview';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    isFarmOwner?: boolean;
}

export function AppSidebar({ isFarmOwner = false, ...props }: AppSidebarProps) {
    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const categories = await getCategories();
            sessionStorage.setItem('categories', JSON.stringify(categories));
            return categories;
        },
    });

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <FarmSwitcher />
            </SidebarHeader>
            {isFarmOwner && (
                <SidebarContent>
                    <SidebarFarmOwnerOverview />
                </SidebarContent>
            )}
            {!isFarmOwner && (
                <SidebarContent>
                    <SidebarNavigation sidebarItems={sidebarItems} />
                    <SidebarOverview categories={categories} isLoading={isLoading} />
                </SidebarContent>
            )}
            <SidebarFooter>
                <SidebarFooterMenu />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
