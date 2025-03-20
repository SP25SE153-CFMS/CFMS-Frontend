import { z } from 'zod';

export const EvaluatedTargetSchema = z.object({
    evaluatedTargetId: z
        .string()
        .uuid({ message: 'ID mục tiêu đánh giá không hợp lệ, phải là UUID' }),
    targetTypeId: z.string().uuid({ message: 'ID loại mục tiêu không hợp lệ, phải là UUID' }),
    targetId: z.string().uuid({ message: 'ID mục tiêu không hợp lệ, phải là UUID' }),
});

export type EvaluatedTarget = z.infer<typeof EvaluatedTargetSchema>;
export const CreateEvaluatedTargetSchema = EvaluatedTargetSchema.omit({ evaluatedTargetId: true });
