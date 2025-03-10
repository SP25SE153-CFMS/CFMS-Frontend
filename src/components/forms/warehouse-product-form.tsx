import { WarehouseProduct, WarehouseProductSchema } from '@/utils/schemas/warehouse-product.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function WarehouseProductForm() {
    const form = useForm<WarehouseProduct>({
        resolver: zodResolver(WarehouseProductSchema),
        defaultValues: {
            productId: '',
            productCode: '',
            productName: '',
            area: '',
            quantity: 0,
            unit: '',
            expiry: '',
            supplier: '',
        },
    });
}
