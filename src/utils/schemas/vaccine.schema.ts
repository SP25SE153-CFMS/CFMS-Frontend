import { z } from 'zod';
import { VaccinationLogStatus } from '../enum/status.enum';

// Schema Vaccine
export const VaccineSchema = z.object({
    vaccineId: z.string().uuid('Vắc-xin không hợp lệ'),
    name: z.string().min(1, 'Tên vắc-xin không được để trống'),
    notes: z.string().optional(),
    productionDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: 'Ngày sản xuất không hợp lệ',
    }),
    expiryDate: z.coerce.date().refine((date) => date > new Date(), {
        message: 'Ngày hết hạn phải sau ngày hiện tại',
    }),
    dosage: z.string().min(1, 'Liều lượng không được để trống'),
    instructions: z.string().optional(),
    batchNumber: z.string().min(1, 'Số lô không được để trống'),
    createdAt: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: 'Ngày tạo không hợp lệ',
    }),
    updatedAt: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: 'Ngày cập nhật không hợp lệ',
    }),
    supplierId: z.string().uuid('Nhà cung cấp không hợp lệ'),
    diseaseId: z.coerce.number().int().positive('Bệnh không hợp lệ'),
});

// Schema Vaccination Log
export const VaccinationLogSchema = z.object({
    vLogId: z.string().uuid('Nhật ký tiêm phòng không hợp lệ'),
    vaccinationDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: 'Ngày tiêm không hợp lệ',
    }),
    dosage: z.string().min(1, 'Liều lượng không được để trống'),
    notes: z.string().optional(),
    quantity: z.coerce
        .number()
        .int()
        .positive('Số lượng phải là số nguyên dương')
        .min(1, 'Số lượng phải ít nhất là 1'),
    status: z.nativeEnum(VaccinationLogStatus, { message: 'Trạng thái không hợp lệ' }),
    reaction: z.string().nullable(),
    createdAt: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: 'Ngày tạo không hợp lệ',
    }),
    updatedAt: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: 'Ngày cập nhật không hợp lệ',
    }),
    vaccineId: z.string().uuid('Vắc-xin không hợp lệ'),
    flockId: z.string().uuid({ message: 'Đàn gà không hợp lệ' }),
    taskId: z.string().uuid('Công việc không hợp lệ'),
});

// Export types
export type Vaccine = z.infer<typeof VaccineSchema>;
export type VaccinationLog = z.infer<typeof VaccinationLogSchema>;
