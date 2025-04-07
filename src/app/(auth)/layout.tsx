import { Fragment, ReactNode } from 'react';

import { ThemeSwitch } from '@/components/theme-switch';

interface LayoutProps {
    readonly children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <Fragment>
            <div className="absolute top-4 right-4">
                <ThemeSwitch />
            </div>
            {children}
        </Fragment>
    );
}
