import { z } from "zod";

export const BreedingAreaSchema = z.object({
    breedingAreaId: z
        .string()
        .uuid({ message: "ID khu nuôi không hợp lệ, phải là UUID" }),

    breedingAreaCode: z
        .string()
        .trim()
        .min(1, { message: "Mã khu nuôi là bắt buộc" })
        .max(50, { message: "Mã khu nuôi quá dài, tối đa 50 ký tự" }),

    breedingAreaName: z
        .string()
        .trim()
        .min(1, { message: "Tên khu nuôi là bắt buộc" })
        .max(100, { message: "Tên khu nuôi quá dài, tối đa 100 ký tự" }),

    mealsPerDay: z
        .coerce
        .number()
        .int()
        .min(1, { message: "Số bữa ăn mỗi ngày phải ít nhất là 1" })
        .max(10, { message: "Số bữa ăn mỗi ngày không thể quá 10" }),

    width: z
        .coerce
        .number()
        .positive({ message: "Chiều rộng phải là số dương" })
        .max(100, { message: "Chiều rộng không thể vượt quá 100m" }),

    height: z
        .coerce
        .number()
        .positive({ message: "Chiều cao phải là số dương" })
        .max(50, { message: "Chiều cao không thể vượt quá 50m" }),

    image: z
        .string()
        .trim()
        .url({ message: "Hình ảnh phải là URL hợp lệ" }),

    notes: z
        .string()
        .max(500, { message: "Ghi chú không được vượt quá 500 ký tự" })
        .optional(),

    covered: z.boolean(),

    farmId: z
        .string()
        .uuid({ message: "ID trang trại không hợp lệ, phải là UUID" }),

    breedingPurpose: z
        .string()
        .trim()
        .min(1, { message: "Mục đích nuôi là bắt buộc" })
        .max(200, { message: "Mục đích nuôi không được dài quá 200 ký tự" }),
});

export type BreedingArea = z.infer<typeof BreedingAreaSchema>;

// Schema for creating a new breeding area (without breedingAreaId)
export const CreateBreedingAreaSchema = BreedingAreaSchema.omit({ breedingAreaId: true });