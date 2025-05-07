import { z } from 'zod';
import { CreateNutritionPlanDetail } from './nutrition-plan-detail.schema';
import { CreateFSWithoutNutriPlan } from './feed-session.schema';

export const NutritionPlanSchema = z.object({
    nutritionPlanId: z.string().uuid({ message: 'Chế độ dinh dưỡng không hợp lệ' }),
    name: z.string().min(1, { message: 'Tên chế độ là bắt buộc' }),
    description: z.string().optional(),
});

export type NutritionPlan = z.infer<typeof NutritionPlanSchema> & {
    nutritionPlanDetails: CreateNutritionPlanDetail[];
    feedSessions: CreateFSWithoutNutriPlan[];
};
export const CreateNutritionPlanSchema = NutritionPlanSchema.omit({ nutritionPlanId: true });
