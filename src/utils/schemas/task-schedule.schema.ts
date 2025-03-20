import { z } from 'zod';

export const TaskScheduleSchema = z.object({
    taskScheduleId: z.string().uuid({ message: 'ID lịch công việc không hợp lệ, phải là UUID' }),
    frequency: z.number().int().nonnegative({ message: 'Tần suất phải là số nguyên không âm' }),
    nextWorkDate: z.string().datetime({
        message: 'Ngày làm việc tiếp theo không hợp lệ, phải là định dạng ngày giờ hợp lệ',
    }),
    lastWorkDate: z.string().datetime({
        message: 'Ngày làm việc cuối cùng không hợp lệ, phải là định dạng ngày giờ hợp lệ',
    }),
});

export type TaskSchedule = z.infer<typeof TaskScheduleSchema>;
export const CreateTaskScheduleSchema = TaskScheduleSchema.omit({ taskScheduleId: true });
