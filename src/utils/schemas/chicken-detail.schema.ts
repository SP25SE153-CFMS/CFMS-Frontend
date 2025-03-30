import { z } from 'zod';

export const ChickenDetailSchema = z.object({
    chickenDetailId: z.string().uuid({ message: 'ID chi tiết gà không hợp lệ, phải là UUID' }),
    chickenId: z.string().uuid({ message: 'ID gà không hợp lệ, phải là UUID' }),
    weight: z.number().nonnegative({ message: 'Trọng lượng phải là số không âm' }),
    quantity: z.number().int().nonnegative({ message: 'Số lượng phải là số nguyên không âm' }),
    gender: z.enum(['0', '1'], {
        message: 'Giới tính phải là đực (0) hoặc cái (1)',
    }),
});

export type ChickenDetail = z.infer<typeof ChickenDetailSchema>;
export const CreateChickenDetailSchema = ChickenDetailSchema.omit({ chickenDetailId: true });
