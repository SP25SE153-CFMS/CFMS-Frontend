import { z } from 'zod';

export const TaskLogSchema = z.object({
    taskLogId: z.string().uuid({ message: 'Nhật ký công việc không hợp lệ' }),
    taskId: z.string().uuid({ message: 'Công việc không hợp lệ' }),
    chickenCoopId: z.string().uuid({ message: 'Chuồng nuôi không hợp lệ' }),
    completedAt: z.string().datetime({
        message: 'Thời gian hoàn thành không hợp lệ, phải là định dạng ngày giờ hợp lệ',
    }),
    note: z.string().optional(),
});

export type TaskLog = z.infer<typeof TaskLogSchema>;
export const CreateTaskLogSchema = TaskLogSchema.omit({ taskLogId: true });
