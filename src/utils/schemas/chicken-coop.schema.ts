import { z } from "zod";

export const chickenCoopSchema = z.object({
    chickenCoopId: z.string().uuid(),
    chickenCoopCode: z.string().min(3, "Mã chuồng phải có ít nhất 3 ký tự"),
    chickenCoopName: z.string().min(3, "Tên chuồng phải có ít nhất 3 ký tự"),
    capacity: z.number().int().positive("Sức chứa phải là số nguyên dương"),
    location: z.string().min(5, "Vị trí phải có ít nhất 5 ký tự"),
    status: z.enum(["AVAILABLE", "OCCUPIED", "UNDER_MAINTENANCE"]),
    breedingAreaId: z.string().min(1, "Vui lòng chọn khu vực chăn nuôi"),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().nullable(),
});

export type ChickenCoop = z.infer<typeof chickenCoopSchema>;
