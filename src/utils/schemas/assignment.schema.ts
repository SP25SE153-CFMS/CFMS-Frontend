import { z } from 'zod';

export const AssignmentSchema = z.object({
    assignmentId: z.string().uuid({ message: 'ID phân công không hợp lệ' }),

    taskId: z.string().uuid({ message: 'ID công việc không hợp lệ' }),

    assignedToId: z.string().uuid({ message: 'ID người được phân công không hợp lệ' }),

    assignedDate: z
        .string()
        .datetime({ message: 'Ngày phân công không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),

    // shiftScheduleId: z.string().uuid({ message: 'ID lịch ca không hợp lệ' }),

    // taskScheduleId: z.string().uuid({ message: 'ID lịch công việc không hợp lệ' }),

    // status: z.nativeEnum(AssignmentStatus, { message: 'Trạng thái không hợp lệ' }),

    note: z.string().trim().optional(),
});

export type Assignment = z.infer<typeof AssignmentSchema>;

export const CreateAssignmentSchema = AssignmentSchema.omit({
    assignmentId: true,
    assignedToId: true,
});
