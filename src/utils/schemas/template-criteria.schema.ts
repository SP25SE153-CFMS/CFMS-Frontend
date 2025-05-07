import { z } from 'zod';

export const TemplateCriteriaSchema = z.object({
    templateCriteriaId: z.string().uuid({ message: 'Tiêu chí mẫu không hợp lệ' }),
    templateName: z.string().min(1, { message: 'Tên mẫu là bắt buộc' }),
    evaluationTemplateId: z.string().uuid({ message: 'Mẫu đánh giá không hợp lệ' }),
    criteriaId: z.string().uuid({ message: 'Tiêu chí không hợp lệ' }),
    expectedCondition: z.string().optional(),
    expectedUnit: z.string().optional(),
    expectedValue: z.string().optional(),
});

export type TemplateCriteria = z.infer<typeof TemplateCriteriaSchema>;
export const CreateTemplateCriteriaSchema = TemplateCriteriaSchema.omit({
    templateCriteriaId: true,
});
