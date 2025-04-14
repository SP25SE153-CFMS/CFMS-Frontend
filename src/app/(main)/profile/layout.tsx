import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Thông tin cá nhân',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
