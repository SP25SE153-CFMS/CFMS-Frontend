import { z } from 'zod';

export const RequestSchema = z.object({
    requestId: z.string().uuid({ message: 'ID yêu cầu không hợp lệ, phải là UUID' }),
    requestTypeId: z.string().uuid({ message: 'ID loại yêu cầu không hợp lệ, phải là UUID' }),
    status: z.enum(['0', '1', '2'], { message: 'Giá trị status không hợp lệ' }),
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
