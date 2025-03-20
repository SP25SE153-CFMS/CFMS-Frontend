import { z } from 'zod';

export const TaskHarvestSchema = z.object({
    taskHarvestId: z
        .string()
        .uuid({ message: 'ID thu hoạch công việc không hợp lệ, phải là UUID' }),
    taskId: z.string().uuid({ message: 'ID công việc không hợp lệ, phải là UUID' }),
    harvestTypeId: z.string().uuid({ message: 'ID loại thu hoạch không hợp lệ, phải là UUID' }),
    quantity: z.number().int().nonnegative({ message: 'Số lượng phải là số nguyên không âm' }),
    unitId: z.string().uuid({ message: 'ID đơn vị không hợp lệ, phải là UUID' }),
    quality: z.string().optional(),
});

export type TaskHarvest = z.infer<typeof TaskHarvestSchema>;
export const CreateTaskHarvestSchema = TaskHarvestSchema.omit({ taskHarvestId: true });
