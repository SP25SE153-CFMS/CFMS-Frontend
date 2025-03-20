import { z } from 'zod';

export const HealthLogDetailSchema = z.object({
    healthLogDetailId: z
        .string()
        .uuid({ message: 'ID chi tiết nhật ký sức khỏe không hợp lệ, phải là UUID' }),
    healthLogId: z.string().uuid({ message: 'ID nhật ký sức khỏe không hợp lệ, phải là UUID' }),
    criteriaId: z.string().uuid({ message: 'ID tiêu chí không hợp lệ, phải là UUID' }),
    result: z.string().optional(),
});

export type HealthLogDetail = z.infer<typeof HealthLogDetailSchema>;
export const CreateHealthLogDetailSchema = HealthLogDetailSchema.omit({ healthLogDetailId: true });
