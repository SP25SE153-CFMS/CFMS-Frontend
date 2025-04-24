import { z } from 'zod';
import { EquipmentStatus } from '../enum/status.enum';

export const CoopEquipmentSchema = z.object({
    coopEquipmentId: z.string().uuid({ message: 'ID thiết bị chuồng không hợp lệ' }),
    chickenCoopId: z.string().uuid({ message: 'ID chuồng gà không hợp lệ' }),
    equipmentId: z.string().uuid({ message: 'ID thiết bị không hợp lệ' }),
    quantity: z.coerce.number().int().positive({ message: 'Số lượng phải là số nguyên dương' }),
    assignedDate: z.string(),
    // .datetime({ message: 'Ngày lắp đặt không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    lastMaintenanceDate: z
        .string()
        // .datetime({ message: 'Ngày bảo trì cuối không hợp lệ, phải là định dạng ngày giờ hợp lệ' })
        .nullable(),
    nextMaintenanceDate: z
        .string()
        // .datetime({
        //     message: 'Ngày bảo trì tiếp theo không hợp lệ, phải là định dạng ngày giờ hợp lệ',
        // })
        .nullable(),
    maintenanceInterval: z.coerce
        .number()
        .int()
        .positive({ message: 'Khoảng thời gian bảo trì phải là số nguyên dương' }),
    status: z.nativeEnum(EquipmentStatus, { message: 'Trạng thái không hợp lệ' }),
    note: z.string().optional(),
});

export type CoopEquipment = z.infer<typeof CoopEquipmentSchema>;
export const CreateCoopEquipmentSchema = CoopEquipmentSchema.omit({ coopEquipmentId: true });
