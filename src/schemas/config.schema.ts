import * as z from 'zod';

export const ConfigSchema = z.object({
    systemConfigId: z.string().uuid(),
    settingName: z.string().min(1, 'Tên cấu hình là bắt buộc'),
    settingValue: z.number().min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
    description: z.string().min(1, 'Mô tả là bắt buộc'),
    effectedDateFrom: z.string(),
    effectedDateTo: z.string(),
    entityType: z.string().nullable(),
    entityId: z.string().uuid().nullable(),
    status: z.number().min(0).max(1),
});

export type SystemConfig = z.infer<typeof ConfigSchema>;

export const CreateConfigSchema = ConfigSchema.omit({ systemConfigId: true });
export type CreateConfig = z.infer<typeof CreateConfigSchema>;
