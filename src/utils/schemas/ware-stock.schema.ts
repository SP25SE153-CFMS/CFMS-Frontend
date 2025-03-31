import { z } from 'zod';

export const WareStockSchema = z.object({
    wareStockId: z.string().uuid({ message: 'ID kho hàng không hợp lệ, phải là UUID' }),
    wareId: z.string().uuid({ message: 'ID kho không hợp lệ, phải là UUID' }).optional(),
    resourceId: z.string().uuid({ message: 'ID tài nguyên không hợp lệ, phải là UUID' }).optional(),
    quantity: z.coerce
        .number()
        .int()
        .nonnegative({ message: 'Số lượng phải là số nguyên không âm' }),
    unitId: z.string().uuid({ message: 'ID đơn vị không hợp lệ, phải là UUID' }).optional(),
});

export type WareStock = z.infer<typeof WareStockSchema>;
export const CreateWareStockSchema = WareStockSchema.omit({ wareStockId: true });
