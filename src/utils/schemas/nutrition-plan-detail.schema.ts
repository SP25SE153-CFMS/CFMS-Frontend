import { z } from 'zod';

export const NutritionPlanDetailSchema = z.object({
    nutritionPlanDetailId: z
        .string()
        .uuid({ message: 'ID chi tiết chế độ dinh dưỡng không hợp lệ' }),
    nutritionPlanId: z.string().uuid({ message: 'ID chế độ dinh dưỡng không hợp lệ' }),
    foodId: z.string().uuid({ message: 'ID thức ăn không hợp lệ' }),
    unitId: z.string().uuid({ message: 'ID đơn vị không hợp lệ' }),
    foodWeight: z.coerce.number().positive({ message: 'Trọng lượng thức ăn phải là số dương' }),
});

export type NutritionPlanDetail = z.infer<typeof NutritionPlanDetailSchema>;

export const CreateNutritionPlanDetailSchema = NutritionPlanDetailSchema.omit({
    nutritionPlanDetailId: true,
    nutritionPlanId: true,
});
export type CreateNutritionPlanDetail = z.infer<typeof CreateNutritionPlanDetailSchema>;
