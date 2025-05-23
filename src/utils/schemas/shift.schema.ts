import { z } from 'zod';

export const ShiftSchema = z.object({
    shiftId: z.string().uuid({ message: 'Ca làm việc không hợp lệ' }),
    shiftName: z.string().min(1, { message: 'Tên ca làm việc là bắt buộc' }),
    startTime: z.string(),
    // .datetime({ message: 'Thời gian bắt đầu không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    endTime: z.string(),
    farmId: z.string().uuid({ message: 'Trang trại không hợp lệ' }).nullable(),
    // .datetime({
    //     message: 'Thời gian kết thúc không hợp lệ, phải là định dạng ngày giờ hợp lệ',
    // }),
});

export type Shift = z.infer<typeof ShiftSchema>;
export const CreateShiftSchema = ShiftSchema.omit({ shiftId: true });
