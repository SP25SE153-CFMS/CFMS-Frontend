import { z } from 'zod';

export const AssignmentSchema = z.object({
    assignmentId: z.string().uuid({ message: 'Công việc được giao là bắt buộc' }),

    taskId: z.string().uuid({ message: 'Công việc là bắt buộc' }),

    assignedToId: z.string().uuid({ message: 'Cgười được phân công là bắt buộc' }),

    assignedDate: z
        .string()
        .datetime({ message: 'Ngày phân công không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),

    // shiftScheduleId: z.string().uuid({ message: 'Lịch ca là bắt buộc' }),

    // taskScheduleId: z.string().uuid({ message: 'Lịch công việc là bắt buộc' }),

    // status: z.nativeEnum(AssignmentStatus, { message: 'Trạng thái là bắt buộc' }),

    note: z.string().trim().optional(),
});

export type Assignment = z.infer<typeof AssignmentSchema>;

export const CreateAssignmentSchema = AssignmentSchema.omit({
    assignmentId: true,
    assignedToId: true,
});
