import { z } from 'zod';
import { BreedingAreaStatus } from '../enum/status.enum';

export const BreedingAreaSchema = z.object({
    breedingAreaId: z.string().uuid({ message: 'ID khu nuôi không hợp lệ, phải là UUID' }),

    breedingAreaCode: z
        .string()
        .trim()
        .min(1, { message: 'Mã khu nuôi là bắt buộc' })
        .max(10, { message: 'Mã khu nuôi quá dài, tối đa 10 ký tự' }),

    breedingAreaName: z
        .string()
        .trim()
        .min(1, { message: 'Tên khu nuôi là bắt buộc' })
        .max(100, { message: 'Tên khu nuôi quá dài, tối đa 100 ký tự' }),

    area: z.coerce.number().positive({ message: 'Diện tích phải là số dương' }),

    imageUrl: z.string().trim().url({ message: 'Hình ảnh phải là URL hợp lệ' }),

    notes: z.string().max(500, { message: 'Ghi chú không được vượt quá 500 ký tự' }).optional(),

    farmId: z.string().uuid({ message: 'ID trang trại không hợp lệ, phải là UUID' }),

    status: z.nativeEnum(BreedingAreaStatus, { message: 'Trạng thái không hợp lệ' }),
});

export type BreedingArea = z.infer<typeof BreedingAreaSchema>;

export const CreateBreedingAreaSchema = BreedingAreaSchema.omit({
    breedingAreaId: true,
    imageUrl: true,
});
