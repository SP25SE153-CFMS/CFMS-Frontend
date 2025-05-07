import { z } from 'zod';

export const NutritionPlanDetailSchema = z.object({
    nutritionPlanDetailId: z.string().uuid({ message: 'Chi tiết chế độ dinh dưỡng không hợp lệ' }),
    nutritionPlanId: z.string().uuid({ message: 'Chế độ dinh dưỡng không hợp lệ' }),
    foodId: z.string().uuid({ message: 'Thức ăn không hợp lệ' }),
    unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }),
    foodWeight: z.coerce.number().positive({ message: 'Trọng lượng thức ăn phải là số dương' }),
});

export type NutritionPlanDetail = z.infer<typeof NutritionPlanDetailSchema>;

export const CreateNutritionPlanDetailSchema = NutritionPlanDetailSchema.omit({
    nutritionPlanDetailId: true,
    nutritionPlanId: true,
});
export type CreateNutritionPlanDetail = z.infer<typeof CreateNutritionPlanDetailSchema>;
