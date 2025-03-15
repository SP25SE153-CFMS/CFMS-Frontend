import { z } from 'zod';

export const HarvestLogSchema = z.object({
    harvestLogId: z.string().uuid('ID phải là UUID hợp lệ'),
    chickenCoopId: z.string().uuid('ID chuồng gà phải là UUID hợp lệ'),
    date: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
        message: 'Ngày không hợp lệ',
    }),
    type: z.string().min(1, 'Loại không được để trống'),
    total: z.number().int().min(0, 'Tổng số phải lớn hơn hoặc bằng 0'),
    note: z.string().optional(),
});

export const HarvestDetailSchema = z.object({
    harvestDetailId: z.string().uuid('ID phải là UUID hợp lệ'),
    harvestLogId: z.string().uuid('ID nhật ký thu hoạch phải là UUID hợp lệ'),
    typeProductId: z.string().uuid('ID loại sản phẩm phải là UUID hợp lệ'),
    quantity: z.number().int().min(0, 'Số lượng phải lớn hơn hoặc bằng 0'),
    note: z.string().optional(),
});

export type HarvestLog = z.infer<typeof HarvestLogSchema>;
export type HarvestDetail = z.infer<typeof HarvestDetailSchema>;

export const CreateHarvestLogSchema = HarvestLogSchema.omit({ harvestLogId: true });
export const CreateHarvestDetailSchema = HarvestDetailSchema.omit({ harvestDetailId: true });
