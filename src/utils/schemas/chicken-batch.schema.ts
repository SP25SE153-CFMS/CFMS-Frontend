import { z } from "zod";

export const ChickenBatchSchema = z.object({
    chickenBatchId: z.string().uuid("ID lô gà phải là UUID hợp lệ"),
    chickenCoopId: z.string().uuid("ID chuồng gà phải là UUID hợp lệ"),
    name: z.string().min(3, "Tên phải có ít nhất 3 ký tự").max(100, "Tên không được vượt quá 100 ký tự"),
    startDate: z.string().refine(
        (date) => !isNaN(Date.parse(date)),
        "Ngày bắt đầu không hợp lệ"
    ),
    endDate: z
        .string()
        .optional()
        .nullable()
        .refine((date) => !date || !isNaN(Date.parse(date)), {
            message: "Ngày kết thúc không hợp lệ",
        }),
    note: z.string().max(255, "Ghi chú không được vượt quá 255 ký tự").optional(),
    status: z.enum(["active", "inactive", "completed", "cancelled"], {
        message: "Trạng thái không hợp lệ",
    }),
}).refine((data) => !data.endDate || new Date(data.endDate) >= new Date(data.startDate), {
    message: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu",
    path: ["endDate"],
});

export type ChickenBatch = z.infer<typeof ChickenBatchSchema>;