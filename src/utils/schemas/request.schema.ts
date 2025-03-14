import { z } from "zod";

export const RequestSchema = z.object({
    requestId: z.string().uuid({ message: "Định dạng UUID không hợp lệ cho requestId" }),
    requestType: z
        .enum(["import", "export", "maintenance", "equipment", 'cancelMaintenance'], { message: "Giá trị requestType không hợp lệ" }),
    createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Định dạng ngày không hợp lệ cho createdAt",
    }),
    status: z.enum(["0", "1", "2"], { message: "Giá trị status không hợp lệ" }),
    content: z.string().min(10, { message: "Nội dung phải có ít nhất 10 ký tự" }),
    createdBy: z.string().uuid({ message: "Định dạng UUID không hợp lệ cho createdBy" }),
    approvedBy: z.string().uuid({ message: "Định dạng UUID không hợp lệ cho approvedBy" }).nullable(),
});

export type Request = z.infer<typeof RequestSchema>;