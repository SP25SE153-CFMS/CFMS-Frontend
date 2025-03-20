import { z } from 'zod';

export const FarmSchema = z.object({
    farmId: z.string().uuid({ message: 'ID trang trại không hợp lệ, phải là UUID' }),
    farmName: z
        .string()
        .min(1, { message: 'Tên trang trại là bắt buộc' })
        .max(100, { message: 'Tên trang trại không được dài quá 100 ký tự' }),
    farmCode: z
        .string()
        .min(1, { message: 'Mã trang trại là bắt buộc' })
        .max(50, { message: 'Mã trang trại không được dài quá 50 ký tự' }),
    address: z
        .string()
        .trim()
        .min(1, { message: 'Địa chỉ là bắt buộc' })
        .max(300, { message: 'Địa chỉ không được dài quá 300 ký tự' }),
    area: z
        .number()
        .positive({ message: 'Diện tích phải là số dương' })
        .max(1_000_000, { message: 'Diện tích không được vượt quá 1,000,000 m²' }),
    scale: z.coerce.number().positive({ message: 'Quy mô phải là số nguyên dương' }),
    phoneNumber: z
        .string()
        .trim()
        .regex(/^\+?\d{10}$/, { message: 'Số điện thoại không hợp lệ, phải có 10 chữ số' })
        .optional(),

    website: z.string().trim().url({ message: 'Địa chỉ website không hợp lệ' }).or(z.literal('')),
    imageUrl: z.string().trim().url({ message: 'URL hình ảnh không hợp lệ' }).optional(),
});

export type Farm = z.infer<typeof FarmSchema>;
export const CreateFarmSchema = FarmSchema.omit({ farmId: true });
