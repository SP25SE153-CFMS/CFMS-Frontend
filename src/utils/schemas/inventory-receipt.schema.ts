import { z } from 'zod';

export const InventoryReceiptSchema = z.object({
    inventoryReceiptId: z
        .string()
        .uuid({ message: 'ID phiếu nhập kho không hợp lệ, phải là UUID' }),
    inventoryRequestId: z
        .string()
        .uuid({ message: 'ID yêu cầu nhập kho không hợp lệ, phải là UUID' }),
    receiptTypeId: z.string().uuid({ message: 'ID loại phiếu nhập không hợp lệ, phải là UUID' }),
    wareFromId: z.string().uuid({ message: 'ID kho nguồn không hợp lệ, phải là UUID' }),
    wareToId: z.string().uuid({ message: 'ID kho đích không hợp lệ, phải là UUID' }),
    status: z.number().int({ message: 'Trạng thái phải là số nguyên' }),
});

export type InventoryReceipt = z.infer<typeof InventoryReceiptSchema>;
export const CreateInventoryReceiptSchema = InventoryReceiptSchema.omit({
    inventoryReceiptId: true,
});
