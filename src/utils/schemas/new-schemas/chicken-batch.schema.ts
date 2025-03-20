import { z } from 'zod';

export const ChickenBatchSchema = z.object({
    chickenBatchId: z.string().uuid({ message: 'ID lô gà không hợp lệ, phải là UUID' }),

    chickenCoopId: z.string().uuid({ message: 'ID chuồng gà không hợp lệ, phải là UUID' }),

    chickenBatchName: z.string().trim().min(1, { message: 'Tên lô gà là bắt buộc' }),

    startDate: z
        .string()
        .datetime({ message: 'Ngày bắt đầu không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),

    endDate: z
        .string()
        .datetime({ message: 'Ngày kết thúc không hợp lệ, phải là định dạng ngày giờ hợp lệ' })
        .optional(),

    note: z.string().trim().optional(),

    status: z.number().int({ message: 'Trạng thái phải là số nguyên' }),
});

export type ChickenBatch = z.infer<typeof ChickenBatchSchema>;

export const CreateChickenBatchSchema = ChickenBatchSchema.omit({ chickenBatchId: true });
