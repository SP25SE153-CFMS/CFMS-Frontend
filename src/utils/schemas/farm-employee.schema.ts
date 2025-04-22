import { z } from 'zod';
import { UserStatus } from '../enum/status.enum';

export const FarmEmployeeSchema = z.object({
    farmEmployeeId: z
        .string()
        .uuid({ message: 'ID nhân viên trang trại không hợp lệ, phải là UUID' }),
    farmId: z.string().uuid({ message: 'ID trang trại không hợp lệ, phải là UUID' }),
    userId: z.string().uuid({ message: 'ID người dùng không hợp lệ, phải là UUID' }),
    startDate: z
        .string()
        .datetime({ message: 'Ngày bắt đầu không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    endDate: z
        .string()
        .datetime({ message: 'Ngày kết thúc không hợp lệ, phải là định dạng ngày giờ hợp lệ' })
        .nullable(),
    // status: z.nativeEnum(FarmEmployeeStatus, { message: 'Trạng thái không hợp lệ' }),
    status: z.nativeEnum(UserStatus, { message: 'Trạng thái không hợp lệ' }),
    farmRole: z.coerce.number().int({ message: 'Vai trò trang trại phải là số nguyên' }),
});

export type FarmEmployee = z.infer<typeof FarmEmployeeSchema>;

export const CreateFarmEmployeeSchema = FarmEmployeeSchema.omit({
    farmEmployeeId: true,
    startDate: true,
    endDate: true,
});
export type CreateFarmEmployee = z.infer<typeof CreateFarmEmployeeSchema>;
