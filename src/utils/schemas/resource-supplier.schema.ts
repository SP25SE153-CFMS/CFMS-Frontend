import { z } from 'zod';

export const ResourceSupplierSchema = z.object({
    resourceSupplierId: z
        .string()
        .uuid({ message: 'ID nhà cung cấp tài nguyên không hợp lệ, phải là UUID' }),
    resourceId: z.string().uuid({ message: 'ID tài nguyên không hợp lệ, phải là UUID' }),
    description: z.string().optional(),
    supplierId: z.string().uuid({ message: 'ID nhà cung cấp không hợp lệ, phải là UUID' }),
    price: z.coerce.number().positive({ message: 'Giá phải là số dương' }),
    // unitPriceId: z.string().uuid({ message: 'ID đơn giá không hợp lệ, phải là UUID' }),
    // packagePriceId: z.string().uuid({ message: 'ID giá gói không hợp lệ, phải là UUID' }),
    // packageSizePrice: z.coerce.number().positive({ message: 'Kích thước gói phải là số dương' }),
});

export type ResourceSupplier = z.infer<typeof ResourceSupplierSchema>;

export const CreateResourceSupplierSchema = ResourceSupplierSchema.omit({
    resourceSupplierId: true,
    resourceId: true,
});
export type CreateResourceSupplier = z.infer<typeof CreateResourceSupplierSchema>;
