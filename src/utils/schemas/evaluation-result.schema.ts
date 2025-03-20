import { z } from 'zod';

export const EvaluationResultSchema = z.object({
    evaluationResultId: z
        .string()
        .uuid({ message: 'ID kết quả đánh giá không hợp lệ, phải là UUID' }),
    evaluationTemplateId: z
        .string()
        .uuid({ message: 'ID mẫu đánh giá không hợp lệ, phải là UUID' }),
    evaluatedTargetId: z
        .string()
        .uuid({ message: 'ID mục tiêu được đánh giá không hợp lệ, phải là UUID' }),
    evaluatedDate: z
        .string()
        .datetime({ message: 'Ngày đánh giá không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
});

export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;
export const CreateEvaluationResultSchema = EvaluationResultSchema.omit({
    evaluationResultId: true,
});
