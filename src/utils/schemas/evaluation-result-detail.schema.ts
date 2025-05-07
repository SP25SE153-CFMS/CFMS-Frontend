import { z } from 'zod';

export const EvaluationResultDetailSchema = z.object({
    evaluationResultDetailId: z
        .string()
        .uuid({ message: 'Chi tiết kết quả đánh giá không hợp lệ' }),
    evaluationResultId: z.string().uuid({ message: 'Kết quả đánh giá không hợp lệ' }),
    actualValue: z.string().optional(),
    isPass: z.boolean({ message: 'Trạng thái đạt không hợp lệ' }),
});

export type EvaluationResultDetail = z.infer<typeof EvaluationResultDetailSchema>;
export const CreateEvaluationResultDetailSchema = EvaluationResultDetailSchema.omit({
    evaluationResultDetailId: true,
});
