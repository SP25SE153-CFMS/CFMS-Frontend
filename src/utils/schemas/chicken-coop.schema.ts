import { z } from 'zod';

export const ChickenCoopSchema = z.object({
    chickenCoopId: z.string().uuid({ message: 'ID chuồng gà không hợp lệ, phải là UUID' }),

    chickenCoopCode: z
        .string()
        .trim()
        .min(1, { message: 'Mã chuồng gà là bắt buộc' })
        .max(50, { message: 'Mã chuồng không được dài quá 50 ký tự' }),

    chickenCoopName: z
        .string()
        .trim()
        .min(1, { message: 'Tên chuồng gà là bắt buộc' })
        .max(100, { message: 'Tên chuồng không được dài quá 100 ký tự' }),

    capacity: z.number().int({ message: 'Sức chứa phải là số nguyên' }),
    status: z.enum(['0', '1', '2'], {
        message: 'Trạng thái không hợp lệ',
    }),

    breedingAreaId: z.string().uuid({ message: 'ID khu vực chăn nuôi không hợp lệ, phải là UUID' }),
    area: z.number().positive({ message: 'Diện tích phải là số dương' }),

    density: z.number().positive({ message: 'Mật độ phải là số dương' }),

    currentQuantity: z.number().int({ message: 'Số lượng hiện tại phải là số nguyên' }),

    description: z.string().trim().optional(),
});

export type ChickenCoop = z.infer<typeof ChickenCoopSchema>;

export const CreateChickenCoopSchema = ChickenCoopSchema.omit({ chickenCoopId: true });
