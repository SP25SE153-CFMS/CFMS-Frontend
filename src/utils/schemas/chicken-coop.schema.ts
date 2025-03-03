import { z } from "zod";

export const ChickenCoopSchema = z.object({
    chickenCoopId: z
        .string()
        .uuid({ message: "ID chuồng gà không hợp lệ, phải là UUID" }),

    chickenCoopCode: z
        .string()
        .trim()
        .min(3, { message: "Mã chuồng phải có ít nhất 3 ký tự" })
        .max(50, { message: "Mã chuồng không được dài quá 50 ký tự" }),

    chickenCoopName: z
        .string()
        .trim()
        .min(3, { message: "Tên chuồng phải có ít nhất 3 ký tự" })
        .max(100, { message: "Tên chuồng không được dài quá 100 ký tự" }),

    capacity: z
        .number()
        .int({ message: "Sức chứa phải là số nguyên" })
        .positive({ message: "Sức chứa phải là số nguyên dương" })
        .max(500, { message: "Sức chứa tối đa là 500 con" }),

    location: z
        .string()
        .trim()
        .min(5, { message: "Vị trí phải có ít nhất 5 ký tự" })
        .max(200, { message: "Vị trí không được dài quá 200 ký tự" }),

    status: z.enum(["AVAILABLE", "OCCUPIED", "UNDER_MAINTENANCE"], {
        message: "Trạng thái không hợp lệ",
    }),

    breedingAreaId: z
        .string()
        .uuid({ message: "ID khu vực chăn nuôi không hợp lệ, phải là UUID" }),

    image: z
        .string()
        .trim()
        .url({ message: "Hình ảnh phải là URL hợp lệ" })
        .nullable()
        .optional(),

    createdAt: z
        .string()
        .datetime({ message: "Ngày tạo không hợp lệ, phải là định dạng ngày giờ hợp lệ" }),

    updatedAt: z
        .string()
        .datetime({ message: "Ngày cập nhật không hợp lệ, phải là định dạng ngày giờ hợp lệ" })
        .nullable(),
});

export type ChickenCoop = z.infer<typeof ChickenCoopSchema>;
