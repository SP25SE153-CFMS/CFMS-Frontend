import { z } from 'zod';
import { ChickenCoopStatus } from '../enum/status.enum';

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

    maxQuantity: z.coerce.number().min(0).int({ message: 'Sức chứa phải là số nguyên' }),
    status: z.nativeEnum(ChickenCoopStatus, { message: 'Trạng thái không hợp lệ' }),

    breedingAreaId: z.string().uuid({ message: 'Khu nuôi không hợp lệ' }),
    area: z.coerce.number().positive({ message: 'Diện tích phải là số dương' }),

    currentQuantity: z.coerce
        .number()
        .int({ message: 'Số lượng hiện tại phải là số nguyên' })
        .optional(),

    description: z.string().trim().optional(),

    purposeId: z.string().uuid({ message: 'ID mục đích không hợp lệ, phải là UUID' }),

    density: z.coerce.number().min(0).positive({ message: 'Mật độ phải là số dương' }),

    densityUnitId: z.string().uuid({ message: 'Đơn vị mật độ không hợp lệ, phải là UUID' }),

    areaUnitId: z.string().uuid({ message: 'Đơn vị diện tích không hợp lệ, phải là UUID' }),
});

export type ChickenCoop = z.infer<typeof ChickenCoopSchema>;

export const CreateChickenCoopSchema = ChickenCoopSchema.omit({
    chickenCoopId: true,
    status: true,
    currentQuantity: true,
});
export type CreateChickenCoop = z.infer<typeof CreateChickenCoopSchema>;
