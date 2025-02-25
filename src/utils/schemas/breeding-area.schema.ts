import { z } from "zod";

export const BreedingAreaSchema = z.object({
    breedingAreaId: z
        .string()
        .uuid({ message: "ID khu nuôi không hợp lệ" }),
    breedingAreaCode: z
        .string()
        .min(1, { message: "Mã khu nuôi là bắt buộc" })
        .max(50, { message: "Mã khu nuôi quá dài" }),
    breedingAreaName: z
        .string()
        .min(1, { message: "Tên khu nuôi là bắt buộc" })
        .max(100, { message: "Tên khu nuôi quá dài" }),
    mealsPerDay: z
        .number()
        .int()
        .min(1, { message: "Số bữa ăn mỗi ngày phải ít nhất là 1" }),
    humidity: z
        .string()
        .regex(/^\d+(\.\d+)?%$/, { message: "Độ ẩm phải có định dạng phần trăm (VD: 50%)" }),
    temperature: z
        .string()
        .regex(/^\d+(\.\d+)?°C$/, { message: "Nhiệt độ phải có đơn vị °C (VD: 25°C)" }),
    width: z
        .number()
        .positive({ message: "Chiều rộng phải là số dương" }),
    height: z
        .number()
        .positive({ message: "Chiều cao phải là số dương" }),
    image: z
        .string()
        .url({ message: "Hình ảnh phải là URL hợp lệ" }),
    notes: z
        .string()
        .optional(),
    covered: z
        .boolean({ message: "Trạng thái có mái che là bắt buộc" }),
    farmId: z
        .string()
        .uuid({ message: "ID trang trại không hợp lệ" }),
    breedingPurpose: z
        .string()
        .min(1, { message: "Mục đích nuôi là bắt buộc" }),
});

export type BreedingArea = z.infer<typeof BreedingAreaSchema>;