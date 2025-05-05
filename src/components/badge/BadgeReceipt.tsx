import { getSubBySubId } from '@/services/category.service';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { getResourceById } from '@/services/resource.service';

type SubCateDisplayProps = {
    id: string;
    mode: 'badge' | 'input' | 'description' | 'title';
};

type ResourceDisplayProps = {
    id: string;
};

export default function SubCateDisplay({ id, mode }: SubCateDisplayProps) {
    const { data: subCate, isLoading } = useQuery({
        queryKey: ['subCate', id],
        queryFn: () => getSubBySubId(id),
        enabled: !!id,
    });

    if (isLoading) {
        const loadingContent = {
            badge: (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Đang tải...</span>
                </span>
            ),
            input: (
                <div className="relative">
                    <input
                        disabled
                        className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 shadow-sm focus:border-gray-300 focus:ring-0"
                        value="Đang tải..."
                    />
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
                </div>
            ),
            title: (
                <div className="flex items-center gap-2 text-base font-semibold text-gray-700">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    <span>Đang tải tiêu đề...</span>
                </div>
            ),
            description: (
                <p className="flex items-center gap-2 text-sm text-gray-500 italic">
                    <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                    Đang tải mô tả...
                </p>
            ),
        };

        return loadingContent[mode];
    }

    if (!subCate) {
        const fallbackContent = {
            badge: (
                <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    Không xác định
                </span>
            ),
            input: (
                <input
                    disabled
                    className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 shadow-sm focus:border-gray-300 focus:ring-0"
                    value="Không xác định"
                />
            ),
            title: <span className="text-sm font-medium text-gray-500">Không xác định</span>,
            description: <span className="text-sm italic text-gray-500">Không có mô tả</span>,
        };

        return fallbackContent[mode];
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
                disabled
                className="focus:ring-2 focus:ring-blue-500"
                value={subCate.subCategoryName}
            />
        );
    } else if (mode === 'description') {
        return <span className="text-sm">{subDesc}</span>;
    } else if (mode === 'title') {
        return <span className="text-sm font-medium">{subCate.description}</span>;
    }
}

export function ResourceDisplay({ id }: ResourceDisplayProps) {
    const { data: resource } = useQuery({
        queryKey: ['resource', id],
        queryFn: () => getResourceById(id),
        enabled: !!id,
    });

    return (
        <div>
            {/* Food */}
            {resource?.food && (
                <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Tên sản phẩm:</span>
                    <span className="font-medium text-slate-800">{resource.food.foodName}</span>
                </div>
            )}

            {/* Equipment */}
            {resource?.equipment && (
                <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Tên sản phẩm:</span>
                    <span className="font-medium text-slate-800">
                        {resource.equipment.equipmentName}
                    </span>
                </div>
            )}

            {/* Medicine */}
            {resource?.medicine && (
                <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Tên sản phẩm:</span>
                    <span className="font-medium text-slate-800">
                        {resource.medicine.medicineName}
                    </span>
                </div>
            )}

            {/* Breeding */}
            {resource?.breeding && (
                <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Tên sản phẩm:</span>
                    <span className="font-medium text-slate-800">
                        {resource.breeding.chickenName}
                    </span>
                </div>
            )}

            {/* Harvest Product */}
            {resource?.harvestProduct && (
                <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Tên sản phẩm:</span>
                    <span className="font-medium text-slate-800">
                        {resource.harvestProduct.harvestProductName}
                    </span>
                </div>
            )}
        </div>
    );
}
