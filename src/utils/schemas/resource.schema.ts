import { z } from 'zod';

export const ResourceSchema = z.object({
    resourceId: z.string().uuid({ message: 'Tài nguyên không hợp lệ' }),
    resourceTypeId: z.string().uuid({ message: 'Loại tài nguyên không hợp lệ' }),
    description: z.string().optional(),
    unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }),
    packageId: z.string().uuid({ message: 'Gói không hợp lệ' }),
    packageSize: z.coerce.number().positive({ message: 'Kích thước gói phải là số dương' }),
});

export type Resource = z.infer<typeof ResourceSchema>;
export const CreateResourceSchema = ResourceSchema.omit({ resourceId: true });
