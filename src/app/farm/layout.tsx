import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Danh sách trang trại',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
