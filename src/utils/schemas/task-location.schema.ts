import { z } from 'zod';

export const TaskLocationSchema = z.object({
    taskLocationId: z.string().uuid({ message: 'ID vị trí công việc không hợp lệ, phải là UUID' }),
    taskId: z.string().uuid({ message: 'ID công việc không hợp lệ, phải là UUID' }),
    locationTypeId: z.string().uuid({ message: 'ID loại vị trí không hợp lệ, phải là UUID' }),
    locationType: z.string({ message: 'Loại vị trí không hợp lệ' }).optional(),
    locationId: z.string().uuid({ message: 'ID vị trí không hợp lệ, phải là UUID' }),
});

export type TaskLocation = z.infer<typeof TaskLocationSchema>;
export const CreateTaskLocationSchema = TaskLocationSchema.omit({ taskLocationId: true });
