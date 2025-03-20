import { z } from 'zod';

export const TemplateCriteriaSchema = z.object({
    templateCriteriaId: z.string().uuid({ message: 'ID tiêu chí mẫu không hợp lệ, phải là UUID' }),
    templateName: z.string().min(1, { message: 'Tên mẫu là bắt buộc' }),
    evaluationTemplateId: z
        .string()
        .uuid({ message: 'ID mẫu đánh giá không hợp lệ, phải là UUID' }),
    criteriaId: z.string().uuid({ message: 'ID tiêu chí không hợp lệ, phải là UUID' }),
    expectedCondition: z.string().optional(),
    expectedUnit: z.string().optional(),
    expectedValue: z.string().optional(),
});

export type TemplateCriteria = z.infer<typeof TemplateCriteriaSchema>;
export const CreateTemplateCriteriaSchema = TemplateCriteriaSchema.omit({
    templateCriteriaId: true,
});
