import { z } from 'zod';

export const NutritionPlanDetailSchema = z.object({
    nutritionPlanDetailId: z
        .string()
        .uuid({ message: 'ID chi tiết kế hoạch dinh dưỡng không hợp lệ, phải là UUID' }),
    nutritionPlanId: z
        .string()
        .uuid({ message: 'ID kế hoạch dinh dưỡng không hợp lệ, phải là UUID' }),
    foodId: z.string().uuid({ message: 'ID thức ăn không hợp lệ, phải là UUID' }),
    unitId: z.string().uuid({ message: 'ID đơn vị không hợp lệ, phải là UUID' }),
    foodWeight: z.number().positive({ message: 'Trọng lượng thức ăn phải là số dương' }),
    consumptionRate: z.number().positive({ message: 'Tỷ lệ tiêu thụ phải là số dương' }),
});

export type NutritionPlanDetail = z.infer<typeof NutritionPlanDetailSchema>;
export const CreateNutritionPlanDetailSchema = NutritionPlanDetailSchema.omit({
    nutritionPlanDetailId: true,
});
