import { z } from 'zod';

export const TaskSchema = z.object({
    taskId: z.string().uuid({ message: 'ID công việc không hợp lệ, phải là UUID' }),
    taskName: z.string().min(1, { message: 'Tên công việc là bắt buộc' }),
    taskTypeId: z.string().uuid({ message: 'ID loại công việc không hợp lệ, phải là UUID' }),
    description: z.string().optional(),
});

export type Task = z.infer<typeof TaskSchema>;
export const CreateTaskSchema = TaskSchema.omit({ taskId: true });
