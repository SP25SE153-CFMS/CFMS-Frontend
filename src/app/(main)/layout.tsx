import { ReactNode } from 'react';

import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { ThemeSwitch } from '@/components/theme-switch';
import Notification from '@/components/ui/notification';
import { Search } from '@/components/command-search/search';

interface LayoutProps {
    readonly children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <main>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="mx-auto max-w-screen-2xl">
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Search />
                        </div>
                        <div className="ml-auto flex items-center space-x-4 px-4">
                            <Notification />
                            <ThemeSwitch />
                            <ProfileDropdown />
                        </div>
                    </header>
                    <div className="p-4 pt-0 w-full h-full">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </main>
    );
}
