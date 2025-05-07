import { z } from 'zod';

export const ResourceSupplierSchema = z.object({
    resourceSupplierId: z.string().uuid({ message: 'Nhà cung cấp tài nguyên không hợp lệ' }),
    resourceId: z.string().uuid({ message: 'Tài nguyên không hợp lệ' }),
    description: z.string().optional(),
    supplierId: z.string().uuid({ message: 'Nhà cung cấp không hợp lệ' }),
    price: z.coerce.number().positive({ message: 'Giá phải là số dương' }),
    // unitPriceId: z.string().uuid({ message: 'Đơn giá không hợp lệ' }),
    // packagePriceId: z.string().uuid({ message: 'Giá gói không hợp lệ' }),
    // packageSizePrice: z.coerce.number().positive({ message: 'Kích thước gói phải là số dương' }),
});

export type ResourceSupplier = z.infer<typeof ResourceSupplierSchema>;

export const AddResourceSupplierSchema = ResourceSupplierSchema.omit({
    resourceSupplierId: true,
    // resourceId: true,
});
export type AddResourceSupplier = z.infer<typeof AddResourceSupplierSchema>;
