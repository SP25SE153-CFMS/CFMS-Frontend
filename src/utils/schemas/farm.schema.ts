import { z } from "zod";

export const FarmSchema = z.object({
    farmId: z
        .string()
        .uuid({ message: "ID trang trại không hợp lệ, phải là UUID" }),

    farmName: z
        .string()
        .trim()
        .min(3, { message: "Tên trang trại phải có ít nhất 3 ký tự" })
        .max(100, { message: "Tên trang trại không được dài quá 100 ký tự" }),

    farmCode: z
        .string()
        .trim()
        .min(3, { message: "Mã trang trại phải có ít nhất 3 ký tự" })
        .max(50, { message: "Mã trang trại không được dài quá 50 ký tự" }),

    address: z
        .string()
        .trim()
        .min(5, { message: "Địa chỉ phải có ít nhất 5 ký tự" })
        .max(200, { message: "Địa chỉ không được dài quá 200 ký tự" }),

    area: z
        .number()
        .positive({ message: "Diện tích phải là số dương" })
        .max(1_000_000, { message: "Diện tích không được vượt quá 1,000,000 m²" }),

    scale: z
        .coerce
        .number()
        .positive({ message: "Quy mô phải là số dương" }),

    phoneNumber: z
        .string()
        .trim()
        .regex(/^\+?\d{10}$/, { message: "Số điện thoại không hợp lệ, phải có 10 chữ số" }),

    website: z
        .string()
        .trim()
        .url({ message: "Địa chỉ website không hợp lệ" })
        .or(z.literal("")),

    farmImage: z
        .string()
        .trim()
        .url({ message: "Hình ảnh trang trại phải là URL hợp lệ" }),
});

export type Farm = z.infer<typeof FarmSchema>;

export const CreateFarmSchema = FarmSchema.omit({ farmId: true });