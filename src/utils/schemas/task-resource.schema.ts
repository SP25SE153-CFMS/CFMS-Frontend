import { z } from 'zod';

export const TaskResourceSchema = z.object({
    taskResourceId: z.string().uuid({ message: 'ID tài nguyên công việc không hợp lệ' }),
    taskId: z.string().uuid({ message: 'ID công việc không hợp lệ' }),
    resourceId: z.string().uuid({ message: 'ID tài nguyên không hợp lệ' }),
    resourceTypeId: z.string().uuid({ message: 'ID loại tài nguyên không hợp lệ' }),
    quantity: z.coerce
        .number()
        .int()
        .nonnegative({ message: 'Số lượng phải là số nguyên không âm' }),
    unitId: z.string().uuid({ message: 'ID đơn vị không hợp lệ' }),
});

export type TaskResource = z.infer<typeof TaskResourceSchema>;
export const CreateTaskResourceSchema = TaskResourceSchema.omit({ taskResourceId: true });
