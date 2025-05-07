import { z } from 'zod';

export const TaskResourceSchema = z.object({
    taskResourceId: z.string().uuid({ message: 'Tài nguyên công việc không hợp lệ' }),
    taskId: z.string().uuid({ message: 'Công việc không hợp lệ' }),
    resourceId: z.string().uuid({ message: 'Tài nguyên không hợp lệ' }),
    resourceTypeId: z.string().uuid({ message: 'Loại tài nguyên không hợp lệ' }),
    quantity: z.coerce
        .number()
        .int()
        .nonnegative({ message: 'Số lượng phải là số nguyên không âm' }),
    unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }),
});

export type TaskResource = z.infer<typeof TaskResourceSchema>;
export const CreateTaskResourceSchema = TaskResourceSchema.omit({ taskResourceId: true });
