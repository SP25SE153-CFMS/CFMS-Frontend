import { z } from 'zod';

export const TaskLogSchema = z.object({
    taskLogId: z.string().uuid('ID không hợp lệ'),
    type: z.string().min(1, 'Loại công việc không được để trống'),
    chickenCoopId: z.string().uuid('ID chuồng gà không hợp lệ'),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Ngày bắt đầu không hợp lệ',
    }),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Ngày kết thúc không hợp lệ',
    }),
});

export const TaskDetailSchema = z.object({
    taskDetailId: z.string().uuid('ID không hợp lệ'),
    taskLogId: z.string().uuid('ID nhật ký công việc không hợp lệ'),
    typeProductId: z.string().uuid('ID loại sản phẩm không hợp lệ'),
    quantity: z.number().int().min(1, 'Số lượng phải là số nguyên dương'),
    note: z.string().optional(),
});

export type TaskLog = z.infer<typeof TaskLogSchema>;
export type TaskDetail = z.infer<typeof TaskDetailSchema>;

export const CreateTaskLogSchema = TaskLogSchema.omit({ taskLogId: true });
export const CreateTaskDetailSchema = TaskDetailSchema.omit({ taskDetailId: true });
