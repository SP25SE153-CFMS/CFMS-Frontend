import { z } from 'zod';

export const WarePermissionSchema = z.object({
    permissionId: z.string().uuid({ message: 'Quyền truy cập không hợp lệ' }),
    wareId: z.string().uuid({ message: 'Kho không hợp lệ' }).optional(),
    userId: z.string().uuid({ message: 'Người dùng không hợp lệ' }).optional(),
    permissionLevel: z.coerce
        .number()
        .int()
        .nonnegative({ message: 'Cấp độ quyền phải là số nguyên không âm' }),
    grantedAt: z
        .string()
        .datetime({
            message: 'Thời gian cấp quyền không hợp lệ, phải là định dạng ngày giờ hợp lệ',
        })
        .optional(),
});

export type WarePermission = z.infer<typeof WarePermissionSchema>;
export const CreateWarePermissionSchema = WarePermissionSchema.omit({ permissionId: true });
