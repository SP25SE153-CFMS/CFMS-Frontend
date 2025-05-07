import { z } from 'zod';

export const HarvestLogSchema = z.object({
    // harvestLogId: z.string().uuid('Nhật ký thu hoạch hợp lệ'),
    // chickenCoopId: z.string().uuid('Chuồng gà không hợp lệ'),
    // date: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
    //     message: 'Ngày không hợp lệ',
    // }),
    // type: z.string().min(1, 'Loại không được để trống'),
    // total: z.coerce.number().int().min(0, 'Tổng số phải lớn hơn hoặc bằng 0'),
    // note: z.string().optional(),
    harvestProductCode: z.string(),
    harvestProductName: z.string(),
    harvestProductType: z.string(),
    harvestProductQuantity: z.string(),
});
export type HarvestLog = z.infer<typeof HarvestLogSchema>;

export const HarvestDetailSchema = z.object({
    harvestDetailId: z.string().uuid('Chi tiết nhật ký thu hoạch không hợp lệ'),
    harvestLogId: z.string().uuid('Nhật ký thu hoạch không hợp lệ'),
    typeProductId: z.string().uuid('Loại sản phẩm không hợp lệ'),
    quantity: z.coerce.number().int().min(0, 'Số lượng phải lớn hơn hoặc bằng 0'),
    note: z.string().optional(),
});

export type HarvestDetail = z.infer<typeof HarvestDetailSchema>;

// export const CreateHarvestLogSchema = HarvestLogSchema.omit({ harvestLogId: true });
export const CreateHarvestDetailSchema = HarvestDetailSchema.omit({ harvestDetailId: true });
