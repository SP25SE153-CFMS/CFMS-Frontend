import { z } from 'zod';

export const WarePermissionSchema = z.object({
    permissionId: z.string().uuid({ message: 'ID quyền không hợp lệ, phải là UUID' }),
    wareId: z.string().uuid({ message: 'ID kho không hợp lệ, phải là UUID' }).optional(),
    userId: z.string().uuid({ message: 'ID người dùng không hợp lệ, phải là UUID' }).optional(),
    permissionLevel: z
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
