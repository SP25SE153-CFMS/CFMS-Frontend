import { z } from 'zod';

export const HealthLogSchema = z.object({
    healthLogId: z.string().uuid({ message: 'ID nhật ký sức khỏe không hợp lệ' }),
    startDate: z
        .string()
        .datetime({ message: 'Ngày bắt đầu không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    endDate: z
        .string()
        .datetime({ message: 'Ngày kết thúc không hợp lệ, phải là định dạng ngày giờ hợp lệ' })
        .nullable(),
    notes: z.string().optional(),
    chickenBatchId: z.string().uuid({ message: 'ID lô gà không hợp lệ' }),
    taskId: z.string().uuid({ message: 'ID công việc không hợp lệ' }),
    // checkedAt: z.string().datetime({
    //     message: 'Thời gian kiểm tra không hợp lệ, phải là định dạng ngày giờ hợp lệ',
    // }),
    // location: z.string().optional(),
});

export type HealthLog = z.infer<typeof HealthLogSchema>;

export const CreateHealthLogSchema = HealthLogSchema.omit({ healthLogId: true });
export type CreateHealthLog = z.infer<typeof CreateHealthLogSchema>;
