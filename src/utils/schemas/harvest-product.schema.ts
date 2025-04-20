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
});
export type CreateHarvestProduct = z.infer<typeof CreateHarvestProductSchema>;
