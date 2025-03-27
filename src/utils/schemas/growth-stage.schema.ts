import { z } from 'zod';

export const GrowthStageSchema = z.object({
    growthStageId: z
        .string()
        .uuid({ message: 'ID giai đoạn tăng trưởng không hợp lệ, phải là UUID' }),
    stageCode: z.string().min(1, { message: 'Mã giai đoạn là bắt buộc' }),
    stageName: z.string().min(1, { message: 'Tên giai đoạn là bắt buộc' }),
    chickenType: z.string().uuid({ message: 'Loại gà không hợp lệ' }),
    minAgeWeek: z
        .number()
        .int()
        .nonnegative({ message: 'Tuổi tối thiểu phải là số nguyên không âm' }),
    maxAgeWeek: z.number().int().nonnegative({ message: 'Tuổi tối đa phải là số nguyên không âm' }),
    description: z.string().optional(),
});

export type GrowthStage = z.infer<typeof GrowthStageSchema>;
export const CreateGrowthStageSchema = GrowthStageSchema.omit({ growthStageId: true });
