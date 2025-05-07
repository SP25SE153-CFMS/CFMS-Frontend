import { z } from 'zod';

export const WareTransactionSchema = z.object({
    transactionId: z.string().uuid({ message: 'Giao dịch không hợp lệ' }),
    wareId: z.string().uuid({ message: 'Kho không hợp lệ' }).optional(),
    resourceId: z.string().uuid({ message: 'Tài nguyên không hợp lệ' }).optional(),
    quantity: z.coerce.number().int().optional(),
    unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }).optional(),
    batchNumber: z.string().optional(),
    transactionType: z.string().uuid({ message: 'Loại giao dịch không hợp lệ' }).optional(),
    reason: z.string().optional(),
    transactionDate: z
        .string()
        .datetime({ message: 'Ngày giao dịch không hợp lệ, phải là định dạng ngày giờ hợp lệ' })
        .optional(),
    locationFromId: z.string().uuid({ message: 'Vị trí nguồn không hợp lệ' }).optional(),
    locationToId: z.string().uuid({ message: 'Vị trí đích không hợp lệ' }).optional(),
});

export type WareTransaction = z.infer<typeof WareTransactionSchema>;
export const CreateWareTransactionSchema = WareTransactionSchema.omit({ transactionId: true });
