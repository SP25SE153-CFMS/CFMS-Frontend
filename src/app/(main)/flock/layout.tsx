import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quản lý đàn gà',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
