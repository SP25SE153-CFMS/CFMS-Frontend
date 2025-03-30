import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quản lý giống gà',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
