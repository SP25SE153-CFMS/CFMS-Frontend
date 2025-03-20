import { z } from 'zod';

export const FarmSchema = z.object({
    farmId: z.string().uuid({ message: 'ID trang trại không hợp lệ, phải là UUID' }),
    farmName: z.string().min(1, { message: 'Tên trang trại là bắt buộc' }),
    farmCode: z.string().min(1, { message: 'Mã trang trại là bắt buộc' }),
    address: z.string().min(1, { message: 'Địa chỉ là bắt buộc' }),
    area: z.number().positive({ message: 'Diện tích phải là số dương' }),
    scale: z.number().int().positive({ message: 'Quy mô phải là số nguyên dương' }),
    phoneNumber: z.string().optional(),
    website: z.string().url({ message: 'URL website không hợp lệ' }).optional(),
    imageUrl: z.string().url({ message: 'URL hình ảnh không hợp lệ' }).optional(),
});

export type Farm = z.infer<typeof FarmSchema>;
export const CreateFarmSchema = FarmSchema.omit({ farmId: true });
