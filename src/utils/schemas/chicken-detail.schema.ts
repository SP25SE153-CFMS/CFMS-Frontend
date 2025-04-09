import { z } from 'zod';
import { ChickenGender } from '../enum/gender.enum';
export const ChickenDetailSchema = z.object({
    chickenDetailId: z.string().uuid({ message: 'ID chi tiết gà không hợp lệ, phải là UUID' }),
    chickenId: z.string().uuid({ message: 'ID gà không hợp lệ, phải là UUID' }),
    // weight: z.coerce.number().nonnegative({ message: 'Trọng lượng phải là số không âm' }),
    quantity: z.coerce
        .number()
        .int()
        .nonnegative({ message: 'Số lượng phải là số nguyên không âm' }),
    gender: z.nativeEnum(ChickenGender, {
        message: 'Giới tính phải là đực (0) hoặc cái (1)',
    }),
    chickenBatchId: z.string().uuid({ message: 'ID lứa nuôi không hợp lệ, phải là UUID' }),
});

export type ChickenDetail = z.infer<typeof ChickenDetailSchema>;
export const CreateChickenDetailSchema = ChickenDetailSchema.omit({ chickenDetailId: true });
