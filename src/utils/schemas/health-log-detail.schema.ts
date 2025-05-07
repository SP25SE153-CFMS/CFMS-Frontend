import { z } from 'zod';

export const HealthLogDetailSchema = z.object({
    healthLogDetailId: z.string().uuid({ message: 'Chi tiết nhật ký sức khỏe không hợp lệ' }),
    healthLogId: z.string().uuid({ message: 'Nhật ký sức khỏe không hợp lệ' }),
    criteriaId: z.string().uuid({ message: 'Tiêu chí không hợp lệ' }),
    result: z.string().optional(),
});

export type HealthLogDetail = z.infer<typeof HealthLogDetailSchema>;
export const CreateHealthLogDetailSchema = HealthLogDetailSchema.omit({ healthLogDetailId: true });
