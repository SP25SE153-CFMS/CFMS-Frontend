import { z } from 'zod';

export const TaskResourceSchema = z.object({
    taskResourceId: z
        .string()
        .uuid({ message: 'ID tài nguyên công việc không hợp lệ, phải là UUID' }),
    taskId: z.string().uuid({ message: 'ID công việc không hợp lệ, phải là UUID' }),
    resourceId: z.string().uuid({ message: 'ID tài nguyên không hợp lệ, phải là UUID' }),
    resourceTypeId: z.string().uuid({ message: 'ID loại tài nguyên không hợp lệ, phải là UUID' }),
    quantity: z.coerce
        .number()
        .int()
        .nonnegative({ message: 'Số lượng phải là số nguyên không âm' }),
    unitId: z.string().uuid({ message: 'ID đơn vị không hợp lệ, phải là UUID' }),
});

export type TaskResource = z.infer<typeof TaskResourceSchema>;
export const CreateTaskResourceSchema = TaskResourceSchema.omit({ taskResourceId: true });
