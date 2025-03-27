import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Danh sách giai đoạn phát triển',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
