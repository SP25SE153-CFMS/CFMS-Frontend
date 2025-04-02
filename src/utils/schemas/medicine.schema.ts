import { z } from 'zod';

export const MedicineSchema = z.object({
    medicineId: z.string().uuid({ message: 'ID thuốc không hợp lệ, phải là UUID' }),
    medicineCode: z.string().min(1, { message: 'Mã thuốc không được để trống' }),
    medicineName: z.string().min(1, { message: 'Tên thuốc không được để trống' }),
    usage: z.string().optional(),
    dosageForm: z.string().optional(),
    storageCondition: z.string().optional(),
    diseaseId: z.string().uuid({ message: 'ID bệnh không hợp lệ, phải là UUID' }),
    productionDate: z
        .string()
        .datetime({ message: 'Ngày sản xuất không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    expiryDate: z
        .string()
        .datetime({ message: 'Ngày hết hạn không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
});

export type Medicine = z.infer<typeof MedicineSchema>;
export const CreateMedicineSchema = MedicineSchema.omit({ medicineId: true });
