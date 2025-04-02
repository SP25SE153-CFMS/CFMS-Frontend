import { getResourceSuppliersByFarmIdAndSupplierId } from '@/services/supplier.service';
import { useQuery } from '@tanstack/react-query';

interface ResourceSuppliersProps {
    supplierId: string;
    farmId: string;
}

export default function ResourceSuppliers({ supplierId, farmId }: ResourceSuppliersProps) {
    const { data: resources } = useQuery({
        queryKey: ['resources'],
        queryFn: () => getResourceSuppliersByFarmIdAndSupplierId(farmId, supplierId),
    });

    console.log('Test list: ', resources);

    return <div className="w-full"></div>;
}
