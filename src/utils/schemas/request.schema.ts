import { z } from "zod";

export const RequestSchema = z.object({
    requestId: z.string().uuid({ message: "Invalid UUID format for requestId" }),
    requestType: z
        .enum(["import", "export", "maintenance", "equipment", 'cancelMaintenance'], { message: "Invalid requestType value" }),
    createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format for createdAt",
    }),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"], { message: "Invalid status value" }),
    content: z.string().min(10, { message: "Content must be at least 10 characters long" }),
    createdBy: z.string().uuid({ message: "Invalid UUID format for createdBy" }),
    approvedBy: z.string().uuid({ message: "Invalid UUID format for approvedBy" }).nullable(),
});

export type Request = z.infer<typeof RequestSchema>;