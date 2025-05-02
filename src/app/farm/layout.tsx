import { ProfileDropdown } from '@/components/profile-dropdown';
import { Metadata } from 'next';
import { Fragment } from 'react';
import Notification from '@/components/ui/notification';

export const metadata: Metadata = {
    title: 'Danh sách trang trại',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Fragment>
            <div className="flex items-center space-x-4 absolute top-4 right-4">
                {/* <ThemeSwitch /> */}
                <Notification />
                <ProfileDropdown />
            </div>
            {children}
        </Fragment>
    );
}
