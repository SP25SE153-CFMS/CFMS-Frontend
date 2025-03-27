import { z } from 'zod';
import { CreateNutritionPlanDetail } from './nutrition-plan-detail.schema';

export const NutritionPlanSchema = z.object({
    nutritionPlanId: z
        .string()
        .uuid({ message: 'ID chế độ dinh dưỡng không hợp lệ, phải là UUID' }),
    name: z.string().min(1, { message: 'Tên kế hoạch là bắt buộc' }),
    description: z.string().optional(),
    // target: z.string().optional(),
});

export type NutritionPlan = z.infer<typeof NutritionPlanSchema> & {
    nutritionPlanDetails: CreateNutritionPlanDetail[];
};
export const CreateNutritionPlanSchema = NutritionPlanSchema.omit({ nutritionPlanId: true });
