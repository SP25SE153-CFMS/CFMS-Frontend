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
        default: 'Hệ Thống Quản Lý Trang Trại Gà - CFMS',
    },
    description:
        'CFMS tối ưu hóa hoạt động, lịch cho ăn và nâng cao năng suất tổng thể của trang trại bằng cách theo dõi sức khỏe của gà',
    openGraph: {
        url: 'http://cfms.hdang09.me',
        type: 'website',
        title: 'Hệ Thống Quản Lý Trang Trại Gà - CFMS',
        description:
            'CFMS tối ưu hóa hoạt động, lịch cho ăn và nâng cao năng suất tổng thể của trang trại bằng cách theo dõi sức khỏe của gà',
        images: [
            {
                url: 'https://res.cloudinary.com/dvqtkzmr5/image/upload/v1743562518/txje0dm0e8h4z3rth0v8.png',
                width: 1200,
                height: 630,
                alt: 'Hệ Thống Quản Lý Trang Trại Gà - CFMS',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Hệ Thống Quản Lý Trang Trại Gà - CFMS',
        description:
            'CFMS tối ưu hóa hoạt động, lịch cho ăn và nâng cao năng suất tổng thể của trang trại bằng cách theo dõi sức khỏe của gà',
        images: [
            'https://res.cloudinary.com/dvqtkzmr5/image/upload/v1743562518/txje0dm0e8h4z3rth0v8.png',
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
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
