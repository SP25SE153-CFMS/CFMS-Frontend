import { z } from 'zod';

export const AssignmentSchema = z.object({
    assignmentId: z.string().uuid({ message: 'ID phân công không hợp lệ, phải là UUID' }),

    taskId: z.string().uuid({ message: 'ID công việc không hợp lệ, phải là UUID' }),

    assignedToId: z
        .string()
        .uuid({ message: 'ID người được phân công không hợp lệ, phải là UUID' }),

    assignedDate: z
        .string()
        .datetime({ message: 'Ngày phân công không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),

    shiftScheduleId: z.string().uuid({ message: 'ID lịch ca không hợp lệ, phải là UUID' }),

    taskScheduleId: z.string().uuid({ message: 'ID lịch công việc không hợp lệ, phải là UUID' }),

    status: z.string().trim().min(1, { message: 'Trạng thái là bắt buộc' }),

    note: z.string().trim().optional(),
});

export type Assignment = z.infer<typeof AssignmentSchema>;

export const CreateAssignmentSchema = AssignmentSchema.omit({ assignmentId: true });
