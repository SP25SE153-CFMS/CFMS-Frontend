import { getWareStockByResourceTypeId } from '@/services/warehouse.service';
import { useQuery } from '@tanstack/react-query';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { getSubCategoryById } from '@/services/sub-category.service';
import { getSubBySubId } from '@/services/category.service';

type SelectResourcesProps = {
    wareId: string;
    resourceTypeId: string;
    onSelect: (resourceId: string) => void;
};

export default function SelectResources({
    wareId,
    resourceTypeId,
    onSelect,
}: SelectResourcesProps) {
    const { data: resources, isLoading: isLoadingSupplier } = useQuery({
        queryKey: ['resources', wareId, resourceTypeId],
        queryFn: () => getWareStockByResourceTypeId(wareId, resourceTypeId),
        enabled: !!wareId && !!resourceTypeId,
    });

    const { data: subCate } = useQuery({
        queryKey: ['subCate', resourceTypeId],
        queryFn: () => getSubBySubId(resourceTypeId),
    });

    const subName = subCate?.subCategoryName;

    return (
        <Select onValueChange={onSelect}>
            <SelectTrigger>
                <SelectValue placeholder="Chọn tài nguyên.." />
            </SelectTrigger>
            <SelectContent>
                {resources?.map((r) => {
                    const resourceId = r.resourceId;

                    if (subName === 'food') {
                        return (
                            <SelectItem key={resourceId} value={resourceId}>
                                {r.foodName}
                            </SelectItem>
                        );
                    }
                    if (subName === 'equipment') {
                        return (
                            <SelectItem key={resourceId} value={resourceId}>
                                {r.equipmentName}
                            </SelectItem>
                        );
                    }

                    if (subName === 'medicine') {
                        return (
                            <SelectItem key={resourceId} value={resourceId}>
                                {r.medicineName}
                            </SelectItem>
                        );
                    }

                    if (subName === 'breeding') {
                        return (
                            <SelectItem key={resourceId} value={resourceId}>
                                {r.chickenName}
                            </SelectItem>
                        );
                    }

                    return (
                        <SelectItem key={resourceId} value={resourceId}>
                            (Không xác định loại)
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}
