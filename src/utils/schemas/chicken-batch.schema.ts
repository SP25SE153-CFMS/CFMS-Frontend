import { z } from 'zod';
import { ChickenBatchStatus } from '../enum/status.enum';

export const ChickenBatchSchema = z.object({
    chickenBatchId: z.string().uuid({ message: 'ID lứa nuôi không hợp lệ' }),

    chickenCoopId: z.string().uuid({ message: 'ID chuồng gà không hợp lệ' }),

    chickenBatchName: z
        .string()
        .min(3, 'Tên phải có ít nhất 3 ký tự')
        .max(100, 'Tên không được vượt quá 100 ký tự'),
    startDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: 'Ngày tạo không hợp lệ',
    }),
    endDate: z.coerce
        .date()
        .refine((date) => !isNaN(date.getTime()), {
            message: 'Ngày kết thúc không hợp lệ',
        })
        .nullable(),

    note: z.string().max(255, 'Ghi chú không được vượt quá 255 ký tự').optional(),
    status: z.nativeEnum(ChickenBatchStatus, {
        message: 'Trạng thái không hợp lệ',
    }),
});

export type ChickenBatch = z.infer<typeof ChickenBatchSchema>;

export const CreateChickenBatchSchema = ChickenBatchSchema.omit({ chickenBatchId: true });
