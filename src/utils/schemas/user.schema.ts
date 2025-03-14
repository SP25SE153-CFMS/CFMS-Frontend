import { z } from 'zod';

export const UserSchema = z.object({
    userId: z.string().uuid({ message: "userId phải là UUID hợp lệ" }),
    fullName: z.string()
        .min(1, { message: "Họ và tên không được để trống" })
        .max(255, { message: "Họ và tên không được vượt quá 255 ký tự" }),
    phoneNumber: z.string()
        .regex(/^(?:\+?84|0)(?:\d{9,10})$/, { message: "Số điện thoại không hợp lệ" }),
    mail: z.string()
        .email({ message: "Email không hợp lệ" }),
    avatar: z.string()
        .url({ message: "Avatar phải là một URL hợp lệ" })
        .optional()
        .or(z.literal('')), // Cho phép avatar rỗng
    dateOfBirth: z.string()
        .datetime({ message: "Ngày sinh phải là ngày hợp lệ (ISO 8601)" }),
    startDate: z.string()
        .datetime({ message: "Ngày bắt đầu phải là ngày hợp lệ (ISO 8601)" }),
    status: z.enum(["0", "1"], { message: "status chỉ có thể là '0' (Ngừng hoạt động) hoặc '1' (Đang hoạt động)" }),
    address: z.string()
        .max(500, { message: "Địa chỉ không được vượt quá 500 ký tự" }),
    cccd: z.string()
        .regex(/^\d{12}$/, { message: "CCCD phải có 12 chữ số" }),
    roleName: z.string()
        .min(1, { message: "Vai trò không được để trống" })
        .max(255, { message: "Vai trò không được vượt quá 255 ký tự" }),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({ userId: true });