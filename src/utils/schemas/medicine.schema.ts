import { z } from 'zod';

export const MedicineSchema = z.object({
    medicineId: z.string().uuid({ message: 'ID thuốc không hợp lệ' }),
    medicineCode: z.string().min(1, { message: 'Mã thuốc không được để trống' }),
    medicineName: z.string().min(1, { message: 'Tên thuốc không được để trống' }),
    usage: z.string().optional(),
    dosageForm: z.string().optional(),
    storageCondition: z.string().optional(),
    diseaseId: z.string().uuid({ message: 'ID bệnh không hợp lệ' }),
    productionDate: z.string({
        message: 'Ngày sản xuất không hợp lệ, phải là định dạng ngày giờ hợp lệ',
    }),
    expiryDate: z.string({
        message: 'Ngày hết hạn không hợp lệ, phải là định dạng ngày giờ hợp lệ',
    }),
});

export type Medicine = z.infer<typeof MedicineSchema>;
export const CreateMedicineSchema = MedicineSchema.omit({ medicineId: true }).extend({
    wareId: z.string().uuid({ message: 'Kho không hợp lệ' }),
    packageId: z.string().uuid({ message: 'Quy cách đóng gói không hợp lệ' }),
    unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }),
    packageSize: z.number().default(0),
});
export type CreateMedicine = z.infer<typeof CreateMedicineSchema>;
