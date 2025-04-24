import { z } from 'zod';

export const EquipmentSchema = z.object({
    equipmentId: z.string().uuid({ message: 'ID thiết bị không hợp lệ' }),
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
    purchaseDate: z.string({ message: 'Ngày mua không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    material: z.string().optional(),
    materialId: z.string().uuid({ message: 'Chất liệu không hợp lệ' }),
    usage: z.string().optional(),
    warranty: z.number().default(0),
    size: z.number().default(0),
    sizeUnitId: z.string().uuid({ message: 'Đơn vị kích thước không hợp lệ' }),
    weight: z.number().default(0),
    weightUnitId: z.string().uuid({ message: 'Đơn vị khối lượng không hợp lệ' }),
});

export type Equipment = z.infer<typeof EquipmentSchema>;
export const CreateEquipmentSchema = EquipmentSchema.omit({ equipmentId: true }).extend({
    wareId: z.string().uuid({ message: 'Kho không hợp lệ' }),
    packageId: z.string().uuid({ message: 'Quy cách đóng gói không hợp lệ' }),
    unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }),
    packageSize: z.number().default(0),
});

export type CreateEquipment = z.infer<typeof CreateEquipmentSchema>;
