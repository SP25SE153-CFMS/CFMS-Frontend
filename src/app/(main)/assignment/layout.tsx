import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lịch trình công việc',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
