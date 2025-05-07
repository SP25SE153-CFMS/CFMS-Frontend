import { z } from 'zod';
import { RequestStatus } from '../enum/status.enum';

export const RequestSchema = z.object({
    requestId: z.string().uuid({ message: 'Yêu cầu không hợp lệ' }),
    requestTypeId: z.string().uuid({ message: 'Loại yêu cầu không hợp lệ' }),
    status: z.nativeEnum(RequestStatus, { message: 'Trạng thái không hợp lệ' }),
    approvedById: z.string().uuid({ message: 'Người phê duyệt không hợp lệ' }).nullable(),
    approvedAt: z
        .string()
        .datetime({
            message: 'Thời gian phê duyệt không hợp lệ, phải là định dạng ngày giờ hợp lệ',
        })
        .nullable(),
});

export type Request = z.infer<typeof RequestSchema>;
export const CreateRequestSchema = RequestSchema.omit({ requestId: true });
