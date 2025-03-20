import { z } from 'zod';

export const UserSchema = z.object({
    userId: z.string().uuid({ message: 'ID người dùng không hợp lệ, phải là UUID' }),
    fullName: z.string().min(1, { message: 'Họ và tên là bắt buộc' }),
    phoneNumber: z.string().optional(),
    mail: z.string().email({ message: 'Email không hợp lệ' }).optional(),
    avatar: z.string().url({ message: 'URL ảnh đại diện không hợp lệ' }).optional(),
    dateOfBirth: z
        .string()
        .datetime({ message: 'Ngày sinh không hợp lệ, phải là định dạng ngày giờ hợp lệ' })
        .optional(),
    status: z.number().int({ message: 'Trạng thái phải là số nguyên' }),
    address: z.string().optional(),
    cccd: z.string().optional(),
    systemRole: z.number().int({ message: 'Vai trò hệ thống phải là số nguyên' }),
    googleId: z.string().optional(),
    hashedPassword: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
export const CreateUserSchema = UserSchema.omit({ userId: true });
