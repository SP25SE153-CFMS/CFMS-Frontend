import { z } from "zod";

export const FarmSchema = z.object({
    farmId: z
        .string()
        .uuid({ message: "ID trang trại không hợp lệ" }),
    farmName: z
        .string()
        .min(1, { message: "Tên trang trại là bắt buộc" })
        .max(100, { message: "Tên trang trại quá dài" }),
    farmCode: z
        .string()
        .min(1, { message: "Mã trang trại là bắt buộc" })
        .max(50, { message: "Mã trang trại quá dài" }),
    type: z
        .string()
        .min(1, { message: "Loại trang trại là bắt buộc" }),
    address: z
        .string()
        .min(1, { message: "Địa chỉ là bắt buộc" }),
    area: z
        .number()
        .positive({ message: "Diện tích phải là số dương" }),
    scale: z
        .string()
        .min(1, { message: "Quy mô là bắt buộc" }),
    phoneNumber: z
        .string()
        .regex(/^\+?\d{10,15}$/, { message: "Số điện thoại không hợp lệ" }),
    website: z
        .string()
        .url({ message: "Địa chỉ website không hợp lệ" })
        .or(z.literal("")),
    farmImage: z
        .string()
        .url({ message: "Hình ảnh trang trại phải là URL hợp lệ" }),
});

export type Farm = z.infer<typeof FarmSchema>;
