import { z } from "zod";

// Equipment Schema
export const EquipmentSchema = z.object({
    equipmentId: z
        .string()
        .uuid({ message: "ID thiết bị không hợp lệ, phải là UUID" }),

    equipmentCode: z
        .string()
        .trim()
        .min(3, { message: "Mã thiết bị phải có ít nhất 3 ký tự" })
        .max(50, { message: "Mã thiết bị không được dài quá 50 ký tự" }),

    equipmentName: z
        .string()
        .trim()
        .min(3, { message: "Tên thiết bị phải có ít nhất 3 ký tự" })
        .max(100, { message: "Tên thiết bị không được dài quá 100 ký tự" }),

    purchaseDate: z
        .string()
        .datetime({ message: "Ngày mua không hợp lệ, phải là định dạng ngày giờ hợp lệ" }),

    warrantyPeriod: z
        .coerce
        .number()
        .int({ message: "Thời gian bảo hành phải là số nguyên" })
        .positive({ message: "Thời gian bảo hành phải là số nguyên dương" })
        .max(120, { message: "Thời gian bảo hành không được quá 120 tháng (10 năm)" }),

    status: z.enum(["IN_USE", "BROKEN", "AVAILABLE", "UNDER_MAINTENANCE"], {
        message: "Trạng thái thiết bị không hợp lệ",
    }),

    cost: z
        .coerce
        .number()
        .positive({ message: "Chi phí phải là số dương" })
        .max(1_000_000_000, { message: "Chi phí không được vượt quá 1 tỷ" }),

    quantity: z
        .number()
        .int({ message: "Số lượng phải là số nguyên" })
        .positive({ message: "Số lượng phải là số nguyên dương" })
        .max(10_000, { message: "Số lượng không được quá 10,000" }),

    createdAt: z
        .string()
        .datetime({ message: "Ngày tạo không hợp lệ, phải là định dạng ngày giờ hợp lệ" }),

    updatedAt: z
        .string()
        .datetime({ message: "Ngày cập nhật không hợp lệ, phải là định dạng ngày giờ hợp lệ" })
        .nullable()
        .optional(),
});

// Coop Equipment Schema (Relation between Chicken Coop and Equipment)
export const CoopEquipmentSchema = z.object({
    coopEquipmentId: z
        .string()
        .uuid({ message: "ID thiết bị chuồng không hợp lệ, phải là UUID" }),

    chickenCoopId: z
        .string()
        .uuid({ message: "ID chuồng gà không hợp lệ, phải là UUID" }),

    equipmentId: z
        .string()
        .uuid({ message: "ID thiết bị không hợp lệ, phải là UUID" }),

    quantity: z
        .number()
        .int({ message: "Số lượng phải là số nguyên" })
        .positive({ message: "Số lượng phải là số nguyên dương" })
        .max(1000, { message: "Số lượng không được vượt quá 1000" }),

    assignedDate: z
        .string()
        .datetime({ message: "Ngày gán không hợp lệ, phải là định dạng ngày giờ hợp lệ" }),

    maintainDate: z
        .string()
        .datetime({ message: "Ngày bảo trì không hợp lệ, phải là định dạng ngày giờ hợp lệ" })
        .nullable()
        .optional(),

    status: z.enum(["IN_USE", "BROKEN", "UNDER_MAINTENANCE"], {
        message: "Trạng thái thiết bị chuồng không hợp lệ",
    }),

    note: z
        .string()
        .trim()
        .max(500, { message: "Ghi chú không được dài quá 500 ký tự" })
        .optional()
        .nullable(),
});

export type Equipment = z.infer<typeof EquipmentSchema>;
export type CoopEquipment = z.infer<typeof CoopEquipmentSchema>;

export const CreateEquipmentSchema = EquipmentSchema.omit({ equipmentId: true, createdAt: true, updatedAt: true });