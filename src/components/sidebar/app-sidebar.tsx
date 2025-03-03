'use client';

import * as React from 'react';

import { AudioWaveform, Command, Frame, GalleryVerticalEnd, Map, PieChart } from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';

import { TeamSwitcher } from './team-switcher';
import { sidebarItems } from '@/utils/constants/sidebar.constant';
import SidebarFooterMenu from './sidebar-footer-menu';
import SidebarNavigation from './sidebar-navigation';
import { currentUser } from '@/utils/data/mock.data';

const teams = [
    {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
    },
    {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup',
    },
    {
        name: 'Evil Corp.',
        logo: Command,
        plan: 'Free',
    },
];

// eslint-disable-next-line no-unused-vars
const projects = [
    {
        name: 'Design Engineering',
        url: '#',
        icon: Frame,
    },
    {
        name: 'Sales & Marketing',
        url: '#',
        icon: PieChart,
    },
    {
        name: 'Travel',
        url: '#',
        icon: Map,
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const user = {
        name: currentUser.fullName,
        email: currentUser.mail,
        avatar: currentUser.avatar,
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={teams} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarNavigation sidebarItems={sidebarItems} />
                {/* <SidebarProjects projects={projects} /> */}
            </SidebarContent>
            <SidebarFooter>
                <SidebarFooterMenu user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
