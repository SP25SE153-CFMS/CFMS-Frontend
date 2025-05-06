import { getWareStockByResourceTypeId } from '@/services/warehouse.service';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getSubBySubId } from '@/services/category.service';
import { useState } from 'react';
import { Supplier } from '@/utils/schemas/supplier.schema';

type SelectResourcesProps = {
    wareId: string;
    resourceTypeId: string;
    onSelect: (resourceId: string) => void;
    onUnitChange?: (unit: string | null) => void;
    onSupplierOptionsChange?: (suppliers: Supplier[]) => void;
};

export default function SelectResources({
    wareId,
    resourceTypeId,
    onSelect,
    onUnitChange,
    onSupplierOptionsChange,
}: SelectResourcesProps) {
    const [selectedResource, setSelectedResource] = useState<any>(null);
    const { data: resources = [], isLoading: isLoadingSupplier } = useQuery({
        queryKey: ['resources', wareId, resourceTypeId],
        queryFn: () => getWareStockByResourceTypeId(wareId, resourceTypeId),
        enabled: !!wareId && !!resourceTypeId,
    });

    const { data: subCate } = useQuery({
        queryKey: ['subCate', resourceTypeId],
        queryFn: () => getSubBySubId(resourceTypeId),
    });

    const subName = subCate?.subCategoryName;

    // Tách unit
    const extractUnit = (unitSpec: string | null | undefined): string | null => {
        if (!unitSpec) return null;
        const parts = unitSpec.split(' ');
        return parts.length > 1 ? parts[1].split('/')[0] : null; // "30 kg/bao" => "kg"
    };

    const handleSelectResource = (resourceId: string) => {
        const resource = resources.find((r) => r.resourceId === resourceId);
        setSelectedResource(resource);
        onSelect(resourceId);
        onUnitChange?.(extractUnit(resource?.unitSpecification));
        onSupplierOptionsChange?.(resource?.suppliersName ?? []);
    };

    return (
        <div>
            <Select onValueChange={handleSelectResource}>
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
        </div>
    );
}
