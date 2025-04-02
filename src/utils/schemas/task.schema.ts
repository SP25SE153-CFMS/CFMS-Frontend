import { z } from 'zod';

export const TaskSchema = z.object({
    taskId: z.string().uuid({ message: 'ID công việc không hợp lệ, phải là UUID' }),
    taskName: z.string().min(1, { message: 'Tên công việc là bắt buộc' }),
    taskTypeId: z.string().uuid({ message: 'ID loại công việc không hợp lệ, phải là UUID' }),
    description: z.string().optional(),
});

export const CreateTaskSchema = z.object({
    taskName: z.string().min(2, {
        message: 'Tên công việc phải có ít nhất 2 ký tự.',
    }),
    taskTypeId: z.string().uuid({
        message: 'Vui lòng chọn loại công việc hợp lệ.',
    }),
    description: z.string().optional(),
    isHavest: z.boolean().default(false),
    status: z.number().int().min(0).max(2),
    frequency: z.number().int().min(0),
    timeUnitId: z.string().uuid({
        message: 'Vui lòng chọn đơn vị thời gian hợp lệ.',
    }),
    startWorkDate: z.date({
        required_error: 'Ngày bắt đầu là bắt buộc.',
    }),
    endWorkDate: z.date({
        required_error: 'Ngày kết thúc là bắt buộc.',
    }),
    shiftIds: z.array(z.string().uuid()).min(1, {
        message: 'Vui lòng chọn ít nhất một ca làm việc.',
    }),
    locationType: z.string().min(1, {
        message: 'Loại vị trí là bắt buộc.',
    }),
    locationId: z.string().uuid({
        message: 'Vui lòng chọn vị trí hợp lệ.',
    }),
    taskResources: z.array(
        z.object({
            resourceId: z.string().uuid(),
            quantity: z.number().int().min(0),
        }),
    ),
});

export type Task = z.infer<typeof TaskSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
