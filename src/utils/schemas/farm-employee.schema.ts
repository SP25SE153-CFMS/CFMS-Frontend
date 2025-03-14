import { z } from "zod";

export const FarmEmployeeSchema = z.object({
    farmEmployeeId: z.string().uuid({ message: "farmEmployeeId phải là UUID hợp lệ" }),
    farmId: z.string().uuid({ message: "farmId phải là UUID hợp lệ" }),
    employeeId: z.string().uuid({ message: "employeeId phải là UUID hợp lệ" }),
    startDate: z.string().datetime({ message: "startDate phải là ngày hợp lệ (ISO 8601)" }),
    endDate: z.string().datetime({ message: "endDate phải là ngày hợp lệ (ISO 8601)" }).nullable(),
    status: z.enum(["0", "1"], { message: "status chỉ có thể là '0' (Nghỉ việc) hoặc '1' (Đang làm việc)" }),
    roleName: z
        .string()
        .min(1, "Vai trò không được để trống")
        .max(255, "Vai trò không được vượt quá 255 ký tự"),
});

export type FarmEmployee = z.infer<typeof FarmEmployeeSchema>;

export const CreateFarmEmployeeSchema = FarmEmployeeSchema.omit({ farmEmployeeId: true });