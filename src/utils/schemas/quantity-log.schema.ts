import { z } from 'zod';

export const QuantityLogSchema = z.object({
    quantityLogId: z.string().uuid({ message: 'Nhật ký số lượng không hợp lệ' }),
    chickenBatchId: z.string().uuid({ message: 'Lứa nuôi không hợp lệ' }),
    logDate: z
        .string()
        .datetime({ message: 'Ngày nhật ký không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    notes: z.string().optional(),
    quantity: z.coerce.number().int().nonnegative({ message: 'Số lượng không được âm' }),
    // img: z.string().url({ message: 'URL hình ảnh không hợp lệ' }).optional(),
    logType: z.coerce.number().int({ message: 'Loại nhật ký phải là số nguyên' }),
});

export type QuantityLog = z.infer<typeof QuantityLogSchema>;

export const CreateQuantityLogSchema = QuantityLogSchema.omit({ quantityLogId: true });
export type CreateQuantityLog = z.infer<typeof CreateQuantityLogSchema>;
