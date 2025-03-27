import { z } from 'zod';

export const ChickenSchema = z.object({
    chickenId: z.string().uuid({ message: 'ID gà không hợp lệ, phải là UUID' }),

    chickenCode: z.string().trim().min(1, { message: 'Mã gà là bắt buộc' }),

    chickenName: z.string().trim().min(1, { message: 'Tên gà là bắt buộc' }),

    totalQuantity: z.number().int({ message: 'Tổng số lượng phải là số nguyên' }),

    description: z.string().trim().optional(),

    status: z.number().int({ message: 'Trạng thái phải là số nguyên' }),

    chickenTypeId: z.string().uuid({ message: 'ID loại không hợp lệ, phải là UUID' }),

    // createdDate: z
    //     .string()
    //     .datetime({ message: 'Ngày tạo không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
});

export type Chicken = z.infer<typeof ChickenSchema>;

export const CreateChickenSchema = ChickenSchema.omit({ chickenId: true });
