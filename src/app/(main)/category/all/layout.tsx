import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tất cả danh mục dùng chung',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
