import { z } from 'zod';

export const FoodSchema = z.object({
    foodId: z.string().uuid({ message: 'ID thức ăn không hợp lệ' }),
    foodCode: z.string().min(1, { message: 'Mã thức ăn là bắt buộc' }),
    foodName: z.string().min(1, { message: 'Tên thức ăn là bắt buộc' }),
    note: z.string().optional(),
    productionDate: z.string().min(1, { message: 'Ngày sản xuất là bắt buộc' }),
    expiryDate: z.string().min(1, { message: 'Hạn sử dụng là bắt buộc' }),
});

export type Food = z.infer<typeof FoodSchema>;
export const CreateFoodSchema = FoodSchema.omit({ foodId: true }).extend({
    wareId: z.string().uuid({ message: 'Kho không hợp lệ' }),
    packageId: z.string().uuid({ message: 'Quy cách đóng gói không hợp lệ' }),
    unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }),
    packageSize: z.number().default(0),
});

export type CreateFood = z.infer<typeof CreateFoodSchema>;
