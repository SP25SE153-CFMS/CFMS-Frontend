import { z } from 'zod';

export const EvaluatedTargetSchema = z.object({
    evaluatedTargetId: z.string().uuid({ message: 'Mục tiêu đánh giá không hợp lệ' }),
    targetTypeId: z.string().uuid({ message: 'Loại mục tiêu không hợp lệ' }),
    targetId: z.string().uuid({ message: 'Mục tiêu không hợp lệ' }),
});

export type EvaluatedTarget = z.infer<typeof EvaluatedTargetSchema>;
export const CreateEvaluatedTargetSchema = EvaluatedTargetSchema.omit({ evaluatedTargetId: true });
