import { z } from "zod";

// Schema Vaccine
const VaccineSchema = z.object({
    vaccineId: z.string().uuid("ID vắc-xin phải là UUID hợp lệ"),
    name: z.string().min(1, "Tên vắc-xin không được để trống"),
    notes: z.string().optional(),
    productionDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: "Ngày sản xuất không hợp lệ",
    }),
    expiryDate: z
        .coerce.date()
        .refine((date) => date > new Date(), {
            message: "Ngày hết hạn phải sau ngày hiện tại",
        }),
    dosage: z.string().min(1, "Liều lượng không được để trống"),
    instructions: z.string().optional(),
    batchNumber: z.string().min(1, "Số lô không được để trống"),
    createdAt: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: "Ngày tạo không hợp lệ",
    }),
    updatedAt: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: "Ngày cập nhật không hợp lệ",
    }),
    supplierId: z.string().uuid("ID nhà cung cấp phải là UUID hợp lệ"),
    diseaseId: z.number().int().positive("ID bệnh phải là số nguyên dương"),
});

// Schema Vaccination Log
const VaccinationLogSchema = z.object({
    vLogId: z.string().uuid("ID nhật ký phải là UUID hợp lệ"),
    vaccinationDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: "Ngày tiêm không hợp lệ",
    }),
    dosage: z.string().min(1, "Liều lượng không được để trống"),
    notes: z.string().optional(),
    quantity: z
        .number()
        .int()
        .positive("Số lượng phải là số nguyên dương")
        .min(1, "Số lượng phải ít nhất là 1"),
    status: z.enum(["đã tiêm", "chưa tiêm"], {
        errorMap: () => ({ message: "Trạng thái phải là 'đã tiêm' hoặc 'chưa tiêm'" }),
    }),
    reaction: z.string().nullable(),
    createdAt: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: "Ngày tạo không hợp lệ",
    }),
    updatedAt: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
        message: "Ngày cập nhật không hợp lệ",
    }),
    vaccineId: z.string().uuid("ID vắc-xin phải là UUID hợp lệ"),
    flockId: z.string().uuid({ message: "ID vaccine không hợp lệ, phải là UUID" }),
});

// Export types
export type Vaccine = z.infer<typeof VaccineSchema>;
export type VaccinationLog = z.infer<typeof VaccinationLogSchema>;
