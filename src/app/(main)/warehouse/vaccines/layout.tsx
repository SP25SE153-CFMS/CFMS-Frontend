import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quản lý kho vaccine',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
