import { z } from 'zod';

export const CoopEquipmentSchema = z.object({
    coopEquipmentId: z.string().uuid({ message: 'ID thiết bị chuồng không hợp lệ, phải là UUID' }),
    chickenCoopId: z.string().uuid({ message: 'ID chuồng gà không hợp lệ, phải là UUID' }),
    equipmentId: z.string().uuid({ message: 'ID thiết bị không hợp lệ, phải là UUID' }),
    quantity: z.coerce.number().int().positive({ message: 'Số lượng phải là số nguyên dương' }),
    assignedDate: z
        .string()
        .datetime({ message: 'Ngày lắp đặt không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    lastMaintenanceDate: z
        .string()
        .datetime({ message: 'Ngày bảo trì cuối không hợp lệ, phải là định dạng ngày giờ hợp lệ' })
        .nullable(),
    nextMaintenanceDate: z
        .string()
        .datetime({
            message: 'Ngày bảo trì tiếp theo không hợp lệ, phải là định dạng ngày giờ hợp lệ',
        })
        .nullable(),
    maintenanceInterval: z.coerce
        .number()
        .int()
        .positive({ message: 'Khoảng thời gian bảo trì phải là số nguyên dương' }),
    status: z.string().optional(),
    note: z.string().optional(),
});

export type CoopEquipment = z.infer<typeof CoopEquipmentSchema>;
export const CreateCoopEquipmentSchema = CoopEquipmentSchema.omit({ coopEquipmentId: true });
