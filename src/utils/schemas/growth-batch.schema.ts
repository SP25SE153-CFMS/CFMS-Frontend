import { z } from 'zod';

export const GrowthBatchSchema = z.object({
    growthBatchId: z.string().uuid({ message: 'ID lô tăng trưởng không hợp lệ, phải là UUID' }),
    chickenBatchId: z.string().uuid({ message: 'ID lô gà không hợp lệ, phải là UUID' }),
    growthStageId: z
        .string()
        .uuid({ message: 'ID giai đoạn tăng trưởng không hợp lệ, phải là UUID' }),
    startDate: z
        .string()
        .datetime({ message: 'Ngày bắt đầu không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    endDate: z
        .string()
        .datetime({ message: 'Ngày kết thúc không hợp lệ, phải là định dạng ngày giờ hợp lệ' })
        .nullable(),
    avgWeight: z.number().positive({ message: 'Trọng lượng trung bình phải là số dương' }),
    mortalityRate: z.number().positive({ message: 'Tỷ lệ tử vong phải là số dương' }),
    feedConsumption: z.number().positive({ message: 'Lượng thức ăn tiêu thụ phải là số dương' }),
    note: z.string().optional(),
    status: z.boolean({ message: 'Trạng thái phải là giá trị boolean' }),
});

export type GrowthBatch = z.infer<typeof GrowthBatchSchema>;
export const CreateGrowthBatchSchema = GrowthBatchSchema.omit({ growthBatchId: true });
