import { z } from 'zod';
import { TaskStatus } from '../enum/status.enum';

export const TaskSchema = z.object({
    taskId: z.string().uuid({ message: 'Công việc không hợp lệ' }),
    taskName: z.string().min(1, { message: 'Tên công việc là bắt buộc' }),
    taskTypeId: z.string().uuid({ message: 'Loại công việc không hợp lệ' }),
    description: z.string().optional(),
    isHavest: z.boolean().default(false),
    status: z.nativeEnum(TaskStatus, { message: 'Trạng thái không hợp lệ' }),
});
export type Task = z.infer<typeof TaskSchema>;

export const CreateTaskSchema = TaskSchema.omit({ taskId: true }).extend({
    frequency: z.number().int().min(0),
    timeUnitId: z
        .string()
        //      .uuid({
        //          message: 'Vui lòng chọn đơn vị thời gian hợp lệ.',
        //      })
        .optional(),
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
            supplierId: z.string().uuid(),
            suppliedQuantity: z.coerce.number().int().default(0),
            consumedQuantity: z.coerce.number().int().default(0),
        }),
    ),
});
export type CreateTask = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = TaskSchema.extend({
    startWorkDate: z.date({
        required_error: 'Ngày bắt đầu là bắt buộc.',
    }),
    endWorkDate: z.date({
        required_error: 'Ngày kết thúc là bắt buộc.',
    }),
    shiftId: z.string().uuid({ message: 'Ca làm việc không hợp lệ' }),
    locationType: z.string().min(1, {
        message: 'Loại vị trí là bắt buộc.',
    }),
    locationId: z.string().uuid({
        message: 'Vui lòng chọn vị trí hợp lệ.',
    }),
    taskResources: z.array(
        z.object({
            resourceId: z.string().uuid(),
            supplierId: z.string().uuid(),
            suppliedQuantity: z.coerce.number().int().default(0),
            consumedQuantity: z.coerce.number().int().default(0),
        }),
    ),
    assignedTos: z.array(z.object({})).optional(),
    shiftName: z.string().optional(),
    assignedDate: z.date().optional(),
    note: z.string().optional(),
});

export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
