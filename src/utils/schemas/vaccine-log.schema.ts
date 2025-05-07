import { z } from 'zod';

export const VaccineLogSchema = z.object({
    vaccineLogId: z.string().uuid({ message: 'Nhật ký tiêm phòng không hợp lệ' }),
    notes: z.string().optional(),
    status: z.boolean({ message: 'Trạng thái không hợp lệ' }),
    reaction: z.string().optional(),
    chickenBatchId: z.string().uuid({ message: 'Lứa nuôi không hợp lệ' }),
    taskId: z.string().uuid({ message: 'Công việc không hợp lệ' }),
});

export type VaccineLog = z.infer<typeof VaccineLogSchema>;
export const CreateVaccineLogSchema = VaccineLogSchema.omit({ vaccineLogId: true });
