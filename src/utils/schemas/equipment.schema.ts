import { z } from 'zod';

export const EquipmentSchema = z.object({
    equipmentId: z.string().uuid({ message: 'ID thiết bị không hợp lệ, phải là UUID' }),
    equipmentCode: z
        .string()
        .trim()
        .min(1, { message: 'Mã thiết bị là bắt buộc' })
        .max(50, { message: 'Mã thiết bị không được dài quá 50 ký tự' }),
    equipmentName: z
        .string()
        .trim()
        .min(1, { message: 'Tên thiết bị là bắt buộc' })
        .max(300, { message: 'Tên thiết bị không được dài quá 300 ký tự' }),
    purchaseDate: z
        .string()
        .datetime({ message: 'Ngày mua không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),

    material: z.string().optional(),
    materialId: z.string().uuid({ message: 'Chất liệu không hợp lệ' }),
    usage: z.string().optional(),
    warranty: z.coerce
        .number()
        .int()
        .positive({ message: 'Thời gian bảo hành phải là số nguyên dương' }),
    size: z.coerce.number().positive({ message: 'Kích thước phải là số dương' }),
    sizeUnitId: z.string().uuid({ message: 'Đơn vị kích thước không hợp lệ' }),
    weight: z.coerce.number().positive({ message: 'Khối lượng phải là số dương' }),
    weightUnitId: z.string().uuid({ message: 'Đơn vị khối lượng không hợp lệ' }),
});

export type Equipment = z.infer<typeof EquipmentSchema>;
export const CreateEquipmentSchema = EquipmentSchema.omit({ equipmentId: true });
