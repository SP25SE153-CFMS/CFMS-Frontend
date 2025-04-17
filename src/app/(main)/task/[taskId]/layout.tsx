import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chi tiết công việc',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
