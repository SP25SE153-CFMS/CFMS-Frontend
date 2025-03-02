import { z } from "zod";

// Equipment Schema
export const EquipmentSchema = z.object({
    equipmentId: z.string().uuid(),
    equipmentCode: z.string().min(3, "Mã thiết bị phải có ít nhất 3 ký tự"),
    equipmentName: z.string().min(3, "Tên thiết bị phải có ít nhất 3 ký tự"),
    purchaseDate: z.string().datetime(),
    warrantyPeriod: z.number().int().positive("Thời gian bảo hành phải là số nguyên dương"),
    status: z.enum(["IN_USE", "BROKEN", "AVAILABLE", "UNDER_MAINTENANCE"]),
    cost: z.number().positive("Chi phí phải là số dương"),
    quantity: z.number().int().positive("Số lượng phải là số nguyên dương"),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().optional().nullable(),
});

// Coop Equipment Schema (Relation between Chicken Coop and Equipment)
export const coopEquipmentSchema = z.object({
    coopEquipmentId: z.string().uuid(),
    chickenCoopId: z.string().uuid(),
    equipmentId: z.string().uuid(),
    quantity: z.number().int().positive("Số lượng phải là số nguyên dương"),
    assignedDate: z.string().datetime(),
    maintainDate: z.string().datetime().optional().nullable(),
    status: z.enum(["IN_USE", "BROKEN", "UNDER_MAINTENANCE"]),
    note: z.string().optional().nullable(),
});

export type Equipment = z.infer<typeof EquipmentSchema>;
export type CoopEquipment = z.infer<typeof coopEquipmentSchema>;