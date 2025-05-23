import { z } from 'zod';

export const RevokedTokenSchema = z.object({
    revokedTokenId: z.string().uuid({ message: 'Token bị thu hồi không hợp lệ' }),
    token: z.string().min(1, { message: 'Token là bắt buộc' }),
    tokenType: z.coerce.number().int({ message: 'Loại token phải là số nguyên' }),
    revokedAt: z
        .string()
        .datetime({ message: 'Thời gian thu hồi không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    expiryDate: z
        .string()
        .datetime({ message: 'Ngày hết hạn không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    userId: z.string().uuid({ message: 'Người dùng không hợp lệ' }),
});

export type RevokedToken = z.infer<typeof RevokedTokenSchema>;
