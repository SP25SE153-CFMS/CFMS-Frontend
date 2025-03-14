import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quản lý nhân công',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
