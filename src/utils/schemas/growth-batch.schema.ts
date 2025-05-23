import { z } from 'zod';
import { CommonStatus } from '../enum/status.enum';

export const GrowthBatchSchema = z.object({
    growthBatchId: z.string().uuid({ message: 'LỨa tăng trưởng không hợp lệ' }),
    chickenBatchId: z.string().uuid({ message: 'LỨa nuôi không hợp lệ' }),
    growthStageId: z.string().uuid({ message: 'Giai đoạn tăng trưởng không hợp lệ' }),
    startDate: z
        .string()
        .datetime({ message: 'Ngày bắt đầu không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    endDate: z
        .string()
        .datetime({ message: 'Ngày kết thúc không hợp lệ, phải là định dạng ngày giờ hợp lệ' })
        .nullable(),
    avgWeight: z.coerce.number().positive({ message: 'Trọng lượng trung bình phải là số dương' }),
    mortalityRate: z.coerce.number().positive({ message: 'Tỷ lệ tử vong phải là số dương' }),
    feedConsumption: z.coerce
        .number()
        .positive({ message: 'Lượng thức ăn tiêu thụ phải là số dương' }),
    note: z.string().optional(),
    status: z.nativeEnum(CommonStatus, { message: 'Trạng thái không hợp lệ' }),
});

export type GrowthBatch = z.infer<typeof GrowthBatchSchema>;
export const CreateGrowthBatchSchema = GrowthBatchSchema.omit({ growthBatchId: true });
