import { z } from 'zod';

export const VaccineLogSchema = z.object({
    vaccineLogId: z.string().uuid({ message: 'ID nhật ký tiêm phòng không hợp lệ, phải là UUID' }),
    notes: z.string().optional(),
    status: z.boolean({ message: 'Trạng thái phải là giá trị boolean' }),
    reaction: z.string().optional(),
    chickenBatchId: z.string().uuid({ message: 'ID lô gà không hợp lệ, phải là UUID' }),
    taskId: z.string().uuid({ message: 'ID công việc không hợp lệ, phải là UUID' }),
});

export type VaccineLog = z.infer<typeof VaccineLogSchema>;
export const CreateVaccineLogSchema = VaccineLogSchema.omit({ vaccineLogId: true });
