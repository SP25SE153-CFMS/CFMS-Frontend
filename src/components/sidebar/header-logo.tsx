import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { currentUser } from '@/utils/data/mock.data';
import Image from 'next/image';

export function HeaderLogo() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="hover:bg-transparent cursor-default">
                    <Image src="/assets/logo/logo.png" alt="Logo" width="36" height="36" />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">CFMS</span>
                        <span className="truncate text-xs">
                            {currentUser.systemRole === '1' ? 'Quản lý' : 'Chủ trang trại'}
                        </span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
