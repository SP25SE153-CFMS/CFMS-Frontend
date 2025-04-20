import { CreateResourceSupplier } from '@/utils/schemas/resource-supplier.schema';
import { CreateSupplierSchema } from '@/utils/schemas/supplier.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '../ui/form';
import { useQuery } from '@tanstack/react-query';
import { getWarestockResourceByFarm } from '@/services/warehouse.service';

interface CreateResourceProps {
    closeModal: () => void;
    supplierId: string;
}

export default function AddResourceSupplier({ closeModal, supplierId }: CreateResourceProps) {
    console.log('Supplier ID: ', supplierId);

    const form = useForm<CreateResourceSupplier>({
        resolver: zodResolver(CreateSupplierSchema),
        defaultValues: {
            description: '',
            supplierId: supplierId,
            price: 0,
        },
    });

    // Get resource
    // const { data: resources } = useQuery({
    //     queryKey: ['resources'],
    //     queryFn: () => getWarestockResourceByFarm(),
    //     enabled: !!defaultValues?.resourceId,
    // });

    return (
        <Form {...form}>
            <form className="flex flex-col">
                <div></div>
            </form>
        </Form>
    );
}
