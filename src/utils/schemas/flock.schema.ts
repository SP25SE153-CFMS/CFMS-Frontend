import { z } from "zod";

export const FlockSchema = z.object({
    flockId: z.number().int().positive("Mã đàn phải là số nguyên dương"),
    quantity: z.number().int().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
    name: z.string().min(1, "Tên là bắt buộc").max(255, "Tên không được dài quá 255 ký tự"),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Ngày bắt đầu không hợp lệ",
    }),
    status: z.enum(["in_farm", "sold", "removed", "dead"], {
        errorMap: () => ({ message: "Trạng thái không hợp lệ" }),
    }),
    description: z.string().max(500, "Mô tả không được dài quá 500 ký tự").optional(),
    endDate: z
        .string()
        .nullable()
        .refine((date) => !date || !isNaN(Date.parse(date)), {
            message: "Ngày kết thúc không hợp lệ",
        }),
    avgWeight: z.number().min(0, "Trọng lượng trung bình phải lớn hơn hoặc bằng 0"),
    mortalityRate: z
        .number()
        .min(0, "Tỷ lệ tử vong không thể nhỏ hơn 0")
        .max(100, "Tỷ lệ tử vong không thể lớn hơn 100"),
    lastHealthCheck: z
        .string()
        .nullable()
        .refine((date) => !date || !isNaN(Date.parse(date)), {
            message: "Ngày kiểm tra sức khỏe không hợp lệ",
        }),
    gender: z.enum(["male", "female", "mixed"], {
        errorMap: () => ({ message: "Giới tính không hợp lệ" }),
    }).optional(),
    purposeId: z.number().int().positive("Mã mục đích phải là số nguyên dương"),
    breedId: z.number().int().positive("Mã giống phải là số nguyên dương"),
    housingId: z.number().int().positive("Mã chuồng trại phải là số nguyên dương"),
});

export type Flock = z.infer<typeof FlockSchema>;