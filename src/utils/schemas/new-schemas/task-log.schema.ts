import { z } from 'zod';

export const TaskLogSchema = z.object({
    taskLogId: z.string().uuid({ message: 'ID nhật ký công việc không hợp lệ, phải là UUID' }),
    taskId: z.string().uuid({ message: 'ID công việc không hợp lệ, phải là UUID' }),
    chickenCoopId: z.string().uuid({ message: 'ID chuồng gà không hợp lệ, phải là UUID' }),
    completedAt: z.string().datetime({
        message: 'Thời gian hoàn thành không hợp lệ, phải là định dạng ngày giờ hợp lệ',
    }),
    note: z.string().optional(),
});

export type TaskLog = z.infer<typeof TaskLogSchema>;
export const CreateTaskLogSchema = TaskLogSchema.omit({ taskLogId: true });
