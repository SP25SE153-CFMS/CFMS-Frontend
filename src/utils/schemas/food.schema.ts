import { z } from 'zod';

export const FoodSchema = z.object({
    foodId: z.string().uuid({ message: 'ID thức ăn không hợp lệ, phải là UUID' }),
    foodCode: z.string().min(1, { message: 'Mã thức ăn là bắt buộc' }),
    foodName: z.string().min(1, { message: 'Tên thức ăn là bắt buộc' }),
    note: z.string().optional(),
    productionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Ngày sản xuất không hợp lệ, định dạng phải là YYYY-MM-DD',
    }),
    expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Hạn sử dụng không hợp lệ, định dạng phải là YYYY-MM-DD',
    }),
});

export type Food = z.infer<typeof FoodSchema>;
export const CreateFoodSchema = FoodSchema.omit({ foodId: true }).extend({
    wareId: z.string().uuid({ message: 'Kho không hợp lệ, phải là UUID' }),
    packageId: z.string().uuid({ message: 'Quy cách đóng gói không hợp lệ, phải là UUID' }),
    unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ, phải là UUID' }),
    packageSize: z.number().default(0),
});

export type CreateFood = z.infer<typeof CreateFoodSchema>;
