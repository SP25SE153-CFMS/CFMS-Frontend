import { z } from 'zod';

export const FoodSchema = z.object({
    foodId: z.string().uuid({ message: 'ID thức ăn không hợp lệ, phải là UUID' }),
    foodCode: z.string().min(1, { message: 'Mã thức ăn là bắt buộc' }),
    foodName: z.string().min(1, { message: 'Tên thức ăn là bắt buộc' }),
    note: z.string().optional(),
    foodIngredientId: z
        .string()
        .uuid({ message: 'ID thành phần thức ăn không hợp lệ, phải là UUID' }),
    productionDate: z
        .string()
        .datetime({ message: 'Ngày sản xuất không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    expiryDate: z
        .string()
        .datetime({ message: 'Ngày hết hạn không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
});

export type Food = z.infer<typeof FoodSchema>;
export const CreateFoodSchema = FoodSchema.omit({ foodId: true });
