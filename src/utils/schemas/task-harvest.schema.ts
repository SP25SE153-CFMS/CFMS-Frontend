import { z } from 'zod';

export const TaskHarvestSchema = z.object({
    taskHarvestId: z.string().uuid({ message: 'Công việc thu hoạch không hợp lệ' }),
    taskId: z.string().uuid({ message: 'Công việc không hợp lệ' }),
    harvestTypeId: z.string().uuid({ message: 'Loại thu hoạch không hợp lệ' }),
    quantity: z.coerce
        .number()
        .int()
        .nonnegative({ message: 'Số lượng phải là số nguyên không âm' }),
    unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }),
    quality: z.string().optional(),
});

export type TaskHarvest = z.infer<typeof TaskHarvestSchema>;
export const CreateTaskHarvestSchema = TaskHarvestSchema.omit({ taskHarvestId: true });
