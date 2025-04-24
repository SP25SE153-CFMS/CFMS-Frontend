import { z } from 'zod';
import { UserStatus } from '../enum/status.enum';

export const UserSchema = z.object({
    userId: z.string().uuid({ message: 'ID người dùng không hợp lệ' }),
    fullName: z
        .string()
        .min(1, { message: 'Họ và tên là bắt buộc' })
        .max(255, { message: 'Họ và tên không được vượt quá 255 ký tự' }),
    phoneNumber: z
        .string()
        .regex(/^(?:\+?84|0)(?:\d{9,10})$/, { message: 'Số điện thoại không hợp lệ' })
        .optional(),
    mail: z.string().email({ message: 'Email không hợp lệ' }),
    avatar: z
        .string()
        .url({ message: 'URL ảnh đại diện không hợp lệ' })
        .optional()
        .or(z.literal('')), // Cho phép avatar rỗng
    dateOfBirth: z
        .string()
        .datetime({ message: 'Ngày sinh không hợp lệ, phải là định dạng ngày giờ hợp lệ' })
        .optional(),
    status: z.nativeEnum(UserStatus, { message: 'Trạng thái không hợp lệ' }),
    address: z.string().max(500, { message: 'Địa chỉ không được vượt quá 500 ký tự' }).optional(),
    cccd: z
        .string()
        .regex(/^\d{12}$/, { message: 'CCCD phải có 12 chữ số' })
        .optional(),
    systemRole: z.enum(['0', '1', '2', '3'], {
        message: 'Vai trò hệ thống không hợp lệ',
    }),
    // .transform((value) => parseInt(value)),
    googleId: z.string().optional(),
    hashedPassword: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
export const CreateUserSchema = UserSchema.omit({ userId: true, status: true });
