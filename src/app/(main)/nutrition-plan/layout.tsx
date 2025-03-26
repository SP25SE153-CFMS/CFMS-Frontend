import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Danh sách chế độ dinh dưỡng',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
