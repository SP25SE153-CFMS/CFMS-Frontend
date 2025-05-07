import { z } from 'zod';

export const ShiftScheduleSchema = z.object({
    shiftScheduleId: z.string().uuid({ message: 'Lịch ca không hợp lệ' }),
    shiftId: z.string().uuid({ message: 'Ca làm việc không hợp lệ' }),
    date: z.string().datetime({ message: 'Ngày không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
});

export type ShiftSchedule = z.infer<typeof ShiftScheduleSchema>;
export const CreateShiftScheduleSchema = ShiftScheduleSchema.omit({ shiftScheduleId: true });
