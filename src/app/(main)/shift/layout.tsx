import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ca làm việc',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
