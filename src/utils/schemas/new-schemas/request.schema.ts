import { z } from 'zod';

export const RequestSchema = z.object({
    requestId: z.string().uuid({ message: 'ID yêu cầu không hợp lệ, phải là UUID' }),
    requestTypeId: z.string().uuid({ message: 'ID loại yêu cầu không hợp lệ, phải là UUID' }),
    status: z.number().int({ message: 'Trạng thái phải là số nguyên' }),
    approvedById: z
        .string()
        .uuid({ message: 'ID người phê duyệt không hợp lệ, phải là UUID' })
        .nullable(),
    approvedAt: z
        .string()
        .datetime({
            message: 'Thời gian phê duyệt không hợp lệ, phải là định dạng ngày giờ hợp lệ',
        })
        .nullable(),
});

export type Request = z.infer<typeof RequestSchema>;
export const CreateRequestSchema = RequestSchema.omit({ requestId: true });
