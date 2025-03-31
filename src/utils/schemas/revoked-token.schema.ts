import { z } from 'zod';

export const RevokedTokenSchema = z.object({
    revokedTokenId: z.string().uuid({ message: 'ID token bị thu hồi không hợp lệ, phải là UUID' }),
    token: z.string().min(1, { message: 'Token là bắt buộc' }),
    tokenType: z.coerce.number().int({ message: 'Loại token phải là số nguyên' }),
    revokedAt: z
        .string()
        .datetime({ message: 'Thời gian thu hồi không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    expiryDate: z
        .string()
        .datetime({ message: 'Ngày hết hạn không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    userId: z.string().uuid({ message: 'ID người dùng không hợp lệ, phải là UUID' }),
});

export type RevokedToken = z.infer<typeof RevokedTokenSchema>;
export const CreateRevokedTokenSchema = RevokedTokenSchema.omit({ revokedTokenId: true });
