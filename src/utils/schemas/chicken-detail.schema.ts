import { z } from 'zod';
import { ChickenGender } from '../enum/gender.enum';
export const ChickenDetailSchema = z.object({
    chickenDetailId: z.string().uuid({ message: 'Chi tiết gà không hợp lệ' }),
    chickenId: z.string().uuid({ message: 'Giống gà không hợp lệ' }),
    // weight: z.coerce.number().nonnegative({ message: 'Trọng lượng phải là số không âm' }),
    quantity: z.coerce
        .number()
        .int()
        .nonnegative({ message: 'Số lượng phải là số nguyên không âm' }),
    gender: z.nativeEnum(ChickenGender, {
        message: 'Giới tính phải là đực hoặc cái',
    }),
    chickenBatchId: z.string().uuid({ message: 'Lứa nuôi không hợp lệ' }),
});

export type ChickenDetail = z.infer<typeof ChickenDetailSchema>;
export const CreateChickenDetailSchema = ChickenDetailSchema.omit({ chickenDetailId: true });
