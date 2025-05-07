import { z } from 'zod';

export const TaskLocationSchema = z.object({
    taskLocationId: z.string().uuid({ message: 'Vị trí của công việc không hợp lệ' }),
    taskId: z.string().uuid({ message: 'Công việc không hợp lệ' }),
    locationTypeId: z.string().uuid({ message: 'Loại vị trí không hợp lệ' }),
    locationType: z.string({ message: 'Loại vị trí không hợp lệ' }).optional(),
    locationId: z.string().uuid({ message: 'Vị trí không hợp lệ' }),
});

export type TaskLocation = z.infer<typeof TaskLocationSchema>;
export const CreateTaskLocationSchema = TaskLocationSchema.omit({ taskLocationId: true });
