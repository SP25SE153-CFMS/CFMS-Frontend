import { z } from 'zod';

export const EquipmentSchema = z.object({
    equipmentId: z.string().uuid({ message: 'ID thiết bị không hợp lệ, phải là UUID' }),
    equipmentCode: z.string().min(1, { message: 'Mã thiết bị là bắt buộc' }),
    equipmentName: z.string().min(1, { message: 'Tên thiết bị là bắt buộc' }),
    material: z.string().optional(),
    usage: z.string().optional(),
    warranty: z
        .number()
        .int()
        .nonnegative({ message: 'Thời gian bảo hành phải là số nguyên không âm' }),
    size: z.number().positive({ message: 'Kích thước phải là số dương' }),
    weight: z.number().positive({ message: 'Trọng lượng phải là số dương' }),
    purchaseDate: z
        .string()
        .datetime({ message: 'Ngày mua không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
});

export type Equipment = z.infer<typeof EquipmentSchema>;
export const CreateEquipmentSchema = EquipmentSchema.omit({ equipmentId: true });
