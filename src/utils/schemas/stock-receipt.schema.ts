import { z } from 'zod';

export const StockReceiptSchema = z.object({
    receiptTypeId: z.string().uuid({ message: 'ID loại phiếu nhập/xuất không hợp lệ' }),
    farmId: z.string().uuid({ message: 'ID trang trại không hợp lệ' }),
});

export type StockReceipt = z.infer<typeof StockReceiptSchema>;

export const CreateStockReceiptSchema = StockReceiptSchema.extend({
    stockReceiptDetails: z.array(
        z.object({
            quantity: z.coerce
                .number()
                .int()
                .nonnegative({ message: 'Số lượng phải là số nguyên không âm' }),
            // unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }).optional(),
            unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }).nullable().optional(),
            toWareId: z.string().uuid({ message: 'Kho không hợp lệ' }),
            resourceId: z.string().uuid({ message: 'ID tài nguyên không hợp lệ' }),
            supplierId: z.string().uuid({ message: 'ID nhà cung cấp tài nguyên không hợp lệ' }),
        }),
    ),
});
export type CreateStockReceipt = z.infer<typeof CreateStockReceiptSchema>;
