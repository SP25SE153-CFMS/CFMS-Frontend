'use client';

import { getCategories } from '@/services/category.service';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type SelectCateProps = {
    onSelect: (subCategoryId: string) => void;
};

export default function SelectCate({ onSelect }: SelectCateProps) {
    const { data: category } = useQuery({
        queryKey: ['category'],
        queryFn: () => getCategories(),
    });

    return (
        <Select onValueChange={onSelect}>
            <SelectTrigger>
                <SelectValue placeholder="Chọn loại..." />
            </SelectTrigger>
            <SelectContent>
                {category?.flatMap((c) =>
                    c.categoryType === 'RESOURCE'
                        ? c.subCategories
                              .filter((sub) => sub.subCategoryName !== 'harvest_product')
                              .map((sub) => (
                                  <SelectItem key={sub.subCategoryId} value={sub.subCategoryId}>
                                      {sub.description}
                                  </SelectItem>
                              ))
                        : [],
                )}
            </SelectContent>
        </Select>
    );
}
