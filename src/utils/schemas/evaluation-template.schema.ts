import { z } from 'zod';

export const EvaluationTemplateSchema = z.object({
    evaluationTemplateId: z
        .string()
        .uuid({ message: 'ID mẫu đánh giá không hợp lệ, phải là UUID' }),
    templateName: z.string().min(1, { message: 'Tên mẫu đánh giá là bắt buộc' }),
    templateTypeId: z.string().uuid({ message: 'ID loại mẫu đánh giá không hợp lệ, phải là UUID' }),
});

export type EvaluationTemplate = z.infer<typeof EvaluationTemplateSchema>;
export const CreateEvaluationTemplateSchema = EvaluationTemplateSchema.omit({
    evaluationTemplateId: true,
});
