import { z } from 'zod';

export const HarvestProductSchema = z.object({
    harvestProductId: z.string().uuid(),
    harvestProductCode: z
        .string({ message: 'Sản phẩm thu hoạch không được để trống' })
        .min(1, { message: 'Sản phẩm thu hoạch không được để trống' }),
    harvestProductName: z
        .string({ message: 'Tên sản phẩm thu hoạch không được để trống' })
        .min(1, { message: 'Tên sản phẩm thu hoạch không được để trống' }),
    harvestProductTypeId: z.string().uuid(),
    harvestProductTypeName: z.string().optional(),
});
export type HarvestProduct = z.infer<typeof HarvestProductSchema>;

export const CreateHarvestProductSchema = HarvestProductSchema.omit({
    harvestProductId: true,
}).extend({
    wareId: z.string().uuid({ message: 'Kho không hợp lệ' }),
    packageId: z.string().uuid({ message: 'Quy cách đóng gói không hợp lệ' }),
    unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }),
    packageSize: z.number().positive('Phải lớn hơn 0.'),
});
export type CreateHarvestProduct = z.infer<typeof CreateHarvestProductSchema>;
