'use client';

import { getWareStockByResourceTypeId } from '@/services/warehouse.service';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getSubBySubId } from '@/services/category.service';
import { useState } from 'react';
import type { Supplier } from '@/utils/schemas/supplier.schema';
import { Loader2, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        <div className="space-y-2">
            <div className="relative">
                <Select onValueChange={handleSelectResource}>
                    <SelectTrigger
                        id="resource-select"
                        className={cn(
                            'w-full transition-all duration-200 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary/20',
                            'hover:border-primary/50 dark:hover:border-primary/50',
                            'h-10 px-3 py-2',
                        )}
                    >
                        <div className="flex items-center gap-2">
                            {isLoadingSupplier ? (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            ) : (
                                <Package className="h-4 w-4 text-muted-foreground" />
                            )}
                            <SelectValue
                                placeholder={
                                    isLoadingSupplier ? 'Đang tải...' : 'Chọn tài nguyên..'
                                }
                                className="text-sm"
                            />
                        </div>
                    </SelectTrigger>
                    <SelectContent
                        className="max-h-[300px] overflow-y-auto border-gray-200 dark:border-gray-700 shadow-lg"
                        position="popper"
                        align="start"
                        sideOffset={4}
                    >
                        {resources.length === 0 && !isLoadingSupplier ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                Không có tài nguyên nào
                            </div>
                        ) : (
                            resources?.map((r) => {
                                const resourceId = r.resourceId;
                                let displayName = '(Không xác định loại)';

                                if (subName === 'food') {
                                    displayName = r.foodName;
                                } else if (subName === 'equipment') {
                                    displayName = r.equipmentName;
                                } else if (subName === 'medicine') {
                                    displayName = r.medicineName;
                                } else if (subName === 'breeding') {
                                    displayName = r.chickenName;
                                }

                                return (
                                    <SelectItem
                                        key={resourceId}
                                        value={resourceId}
                                        className="cursor-pointer hover:bg-muted/50 focus:bg-muted/50 py-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{displayName}</span>
                                            {r.unitSpecification && (
                                                <span className="text-xs text-muted-foreground">
                                                    ({r.unitSpecification})
                                                </span>
                                            )}
                                        </div>
                                    </SelectItem>
                                );
                            })
                        )}
                    </SelectContent>
                </Select>
                {selectedResource && (
                    <div className="mt-1 text-xs text-muted-foreground">
                        {selectedResource.unitSpecification && (
                            <span>Đơn vị: {selectedResource.unitSpecification}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
