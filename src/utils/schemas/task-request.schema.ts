import { z } from 'zod';

export const TaskRequestSchema = z.object({
    taskRequestId: z.string().uuid({ message: 'ID yêu cầu công việc không hợp lệ, phải là UUID' }),
    requestId: z.string().uuid({ message: 'ID yêu cầu không hợp lệ, phải là UUID' }),
    taskTypeId: z.string().uuid({ message: 'ID loại công việc không hợp lệ, phải là UUID' }),
    priority: z.number().int({ message: 'Độ ưu tiên phải là số nguyên' }),
    description: z.string().optional(),
});

export type TaskRequest = z.infer<typeof TaskRequestSchema>;
export const CreateTaskRequestSchema = TaskRequestSchema.omit({ taskRequestId: true });
