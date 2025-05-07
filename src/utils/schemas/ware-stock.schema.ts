import { z } from 'zod';

export const WareStockSchema = z.object({
    wareStockId: z.string().uuid({ message: 'Kho hàng không hợp lệ' }),
    wareId: z.string().uuid({ message: 'Kho không hợp lệ' }).optional(),
    resourceId: z.string().uuid({ message: 'Tài nguyên không hợp lệ' }).optional(),
    quantity: z.coerce
        .number()
        .int()
        .nonnegative({ message: 'Số lượng phải là số nguyên không âm' }),
    unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }).optional(),
});

export type WareStock = z.infer<typeof WareStockSchema>;
export const CreateWareStockSchema = WareStockSchema.omit({ wareStockId: true });
