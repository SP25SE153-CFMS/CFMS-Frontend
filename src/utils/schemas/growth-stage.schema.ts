import { z } from 'zod';

export const GrowthStageSchema = z.object({
    growthStageId: z.string().uuid({ message: 'Giai đoạn tăng trưởng không hợp lệ' }),
    stageCode: z.string().min(1, { message: 'Mã giai đoạn là bắt buộc' }),
    stageName: z.string().min(1, { message: 'Tên giai đoạn là bắt buộc' }),
    chickenType: z.string().uuid({ message: 'Loại gà không hợp lệ' }),
    minAgeWeek: z.coerce
        .number()
        .int()
        .nonnegative({ message: 'Tuổi bắt đầu phải là số nguyên không âm' }),
    maxAgeWeek: z.coerce
        .number()
        .int()
        .nonnegative({ message: 'Tuổi kết thúc phải là số nguyên không âm' }),
    description: z.string().optional(),
    farmId: z.string().uuid({ message: 'Trang trại không hợp lệ' }),
    // TODO: Verify if this field is correct
    // nutritionPlanId: z.string().uuid({ message: 'Chế độ dinh dưỡng không hợp lệ' }).optional(),
});

export type GrowthStage = z.infer<typeof GrowthStageSchema>;
export const CreateGrowthStageSchema = GrowthStageSchema.omit({ growthStageId: true });
