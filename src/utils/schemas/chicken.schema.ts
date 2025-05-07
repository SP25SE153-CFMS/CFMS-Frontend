import { z } from 'zod';
import { CommonStatus } from '../enum/status.enum';

export const ChickenSchema = z.object({
    chickenId: z.string().uuid({ message: 'Giống gà không hợp lệ' }),

    chickenCode: z.string().trim().min(1, { message: 'Mã giống gà là bắt buộc' }),

    chickenName: z.string().trim().min(1, { message: 'Tên giống gà là bắt buộc' }),

    // totalQuantity: z.coerce.number().int({ message: 'Tổng số lượng phải là số nguyên' }),

    description: z.string().trim().optional(),

    status: z.nativeEnum(CommonStatus, { message: 'Trạng thái không hợp lệ' }),

    chickenTypeId: z.string().uuid({ message: 'Loại gà không hợp lệ' }),

    // createdDate: z
    //     .string()
    //     .datetime({ message: 'Ngày tạo không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),

    // TODO: Reconfirm this code
    packageId: z.string(),
    packageSize: z.number().positive('Phải lớn hơn 0.'),
    wareId: z.string(),
    unitId: z.string(),
});

export type Chicken = z.infer<typeof ChickenSchema>;

export const CreateChickenSchema = ChickenSchema.omit({ chickenId: true });
