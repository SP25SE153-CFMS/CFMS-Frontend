import { z } from 'zod';

export const WareTransactionSchema = z.object({
    transactionId: z.string().uuid({ message: 'ID giao dịch không hợp lệ, phải là UUID' }),
    wareId: z.string().uuid({ message: 'ID kho không hợp lệ, phải là UUID' }).optional(),
    resourceId: z.string().uuid({ message: 'ID tài nguyên không hợp lệ, phải là UUID' }).optional(),
    quantity: z.number().int().optional(),
    unitId: z.string().uuid({ message: 'ID đơn vị không hợp lệ, phải là UUID' }).optional(),
    batchNumber: z.string().optional(),
    transactionType: z
        .string()
        .uuid({ message: 'ID loại giao dịch không hợp lệ, phải là UUID' })
        .optional(),
    reason: z.string().optional(),
    transactionDate: z
        .string()
        .datetime({ message: 'Ngày giao dịch không hợp lệ, phải là định dạng ngày giờ hợp lệ' })
        .optional(),
    locationFromId: z
        .string()
        .uuid({ message: 'ID vị trí nguồn không hợp lệ, phải là UUID' })
        .optional(),
    locationToId: z
        .string()
        .uuid({ message: 'ID vị trí đích không hợp lệ, phải là UUID' })
        .optional(),
});

export type WareTransaction = z.infer<typeof WareTransactionSchema>;
export const CreateWareTransactionSchema = WareTransactionSchema.omit({ transactionId: true });
