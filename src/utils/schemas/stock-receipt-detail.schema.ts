import { z } from 'zod';

export const StockReceiptDetailSchema = z.object({
    quantity: z.coerce
        .number()
        .int()
        .nonnegative({ message: 'Số lượng phải là số nguyên không âm' }),
    unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }),
    toWareId: z.string().uuid({ message: 'Kho không hợp lệ' }),
    resourceId: z.string().uuid({ message: 'ID tài nguyên không hợp lệ' }),
    resourceSupplierId: z.string().uuid({ message: 'ID nhà cung cấp tài nguyên không hợp lệ' }),
});

export type StockReceiptDetail = z.infer<typeof StockReceiptDetailSchema>;
