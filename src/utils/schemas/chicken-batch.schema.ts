import { z } from 'zod';

export const ChickenBatchSchema = z.object({
    chickenBatchId: z.string().uuid({ message: 'ID lứa nuôi không hợp lệ, phải là UUID' }),

    chickenCoopId: z.string().uuid({ message: 'ID chuồng gà không hợp lệ, phải là UUID' }),

    chickenBatchName: z
        .string()
        .min(3, 'Tên phải có ít nhất 3 ký tự')
        .max(100, 'Tên không được vượt quá 100 ký tự'),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Ngày bắt đầu không hợp lệ'),
    endDate: z
        .string()
        .datetime({ message: 'Ngày kết thúc không hợp lệ, phải là định dạng ngày giờ hợp lệ' })
        .nullable(),

    note: z.string().max(255, 'Ghi chú không được vượt quá 255 ký tự').optional(),
    status: z.enum(['0', '1', '2', '3'], {
        message: 'Trạng thái không hợp lệ',
    }),
});

export type ChickenBatch = z.infer<typeof ChickenBatchSchema>;

export const CreateChickenBatchSchema = ChickenBatchSchema.omit({ chickenBatchId: true });
