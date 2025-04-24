import { z } from 'zod';

export const ResourceSupplierSchema = z.object({
    resourceSupplierId: z.string().uuid({ message: 'ID nhà cung cấp tài nguyên không hợp lệ' }),
    resourceId: z.string().uuid({ message: 'ID tài nguyên không hợp lệ' }),
    description: z.string().optional(),
    supplierId: z.string().uuid({ message: 'ID nhà cung cấp không hợp lệ' }),
    price: z.coerce.number().positive({ message: 'Giá phải là số dương' }),
    // unitPriceId: z.string().uuid({ message: 'ID đơn giá không hợp lệ' }),
    // packagePriceId: z.string().uuid({ message: 'ID giá gói không hợp lệ' }),
    // packageSizePrice: z.coerce.number().positive({ message: 'Kích thước gói phải là số dương' }),
});

export type ResourceSupplier = z.infer<typeof ResourceSupplierSchema>;

export const CreateResourceSupplierSchema = ResourceSupplierSchema.omit({
    resourceSupplierId: true,
});
export type CreateResourceSupplier = z.infer<typeof CreateResourceSupplierSchema>;
