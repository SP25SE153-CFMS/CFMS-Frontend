import { getSubBySubId } from '@/services/category.service';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Input } from '../ui/input';

type SubCateDisplayProps = {
    id: string;
    mode: 'badge' | 'input' | 'description';
};

export default function SubCateDisplay({ id, mode }: SubCateDisplayProps) {
    const { data: subCate, isLoading } = useQuery({
        queryKey: ['subCate', id],
        queryFn: () => getSubBySubId(id),
        enabled: !!id,
    });

    if (isLoading) {
        return mode === 'badge' ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Đang tải...</span>
            </span>
        ) : (
            <div className="relative">
                <input
                    disabled
                    className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 shadow-sm focus:border-gray-300 focus:ring-0"
                    value="Đang tải..."
                />
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!subCate) {
        return mode === 'badge' ? (
            <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                Không xác định
            </span>
        ) : (
            <input
                disabled
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 shadow-sm focus:border-gray-300 focus:ring-0"
                value="Không xác định"
            />
        );
    }

    const subDesc = subCate.description?.toLowerCase?.() || 'không có mô tả';

    if (mode === 'badge') {
        return (
            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                {subCate.subCategoryName}
            </span>
        );
    } else if (mode === 'input') {
        return (
            <Input
                readOnly
                className="focus:ring-2 focus:ring-blue-500"
                value={subCate.subCategoryName}
            />
        );
    } else if (mode === 'description') {
        return <span className="text-sm">{subDesc}</span>;
    }
}

// else if (mode === 'name') {
//     return <span className="text-sm">{subCate.subCategoryName}</span>;
// }
