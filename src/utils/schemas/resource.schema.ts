import { z } from 'zod';

export const ResourceSchema = z.object({
    resourceId: z.string().uuid({ message: 'ID tài nguyên không hợp lệ, phải là UUID' }),
    resourceTypeId: z.string().uuid({ message: 'ID loại tài nguyên không hợp lệ, phải là UUID' }),
    description: z.string().optional(),
    unitId: z.string().uuid({ message: 'ID đơn vị không hợp lệ, phải là UUID' }),
    packageId: z.string().uuid({ message: 'ID gói không hợp lệ, phải là UUID' }),
    packageSize: z.number().positive({ message: 'Kích thước gói phải là số dương' }),
});

export type Resource = z.infer<typeof ResourceSchema>;
export const CreateResourceSchema = ResourceSchema.omit({ resourceId: true });
