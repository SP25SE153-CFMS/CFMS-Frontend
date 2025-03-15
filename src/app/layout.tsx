import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import TanstackProvider from '@/components/tanstack-provider';
import { ThemeProvider } from '@/context/theme-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: {
        template: '%s | CFMS',
        default: 'Hệ Thống Quản Lý Trang Trại Gà',
    },
    openGraph: {
        title: 'CFMS',
        description: 'Hệ Thống Quản Lý Trang Trại Gà',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider>
                    <TanstackProvider>
                        <Toaster toastOptions={{ duration: 3000 }} />
                        {children}
                    </TanstackProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
