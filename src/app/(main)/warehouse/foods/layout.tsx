import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quản lý kho thức ăn',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
