import { z } from 'zod';

export const TaskRequestSchema = z.object({
    taskRequestId: z.string().uuid({ message: 'Yêu cầu công việc không hợp lệ' }),
    requestId: z.string().uuid({ message: 'Yêu cầu không hợp lệ' }),
    taskTypeId: z.string().uuid({ message: 'Loại công việc không hợp lệ' }),
    title: z.string().min(1, { message: 'Tiêu đề không được để trống' }),
    priority: z.coerce.number().int({ message: 'Độ ưu tiên phải là số nguyên' }),
    // imageUrl: z.string().optional(),
    imageUrl: z.array(z.string()).optional(),
    description: z.string().optional(),
});

export type TaskRequest = z.infer<typeof TaskRequestSchema>;
export const CreateTaskRequestSchema = TaskRequestSchema.omit({ taskRequestId: true });
