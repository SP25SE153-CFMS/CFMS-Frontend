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
import dynamic from 'next/dynamic';

const FarmSwitcher = dynamic(() => import('./farm-switcher'), { ssr: false });

export function AppSidebar({ ...props }) {
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
            <SidebarContent>
                <SidebarNavigation sidebarItems={sidebarItems} />
                <SidebarOverview categories={categories} isLoading={isLoading} />
            </SidebarContent>
            <SidebarFooter>
                <SidebarFooterMenu />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
