import { z } from 'zod';

export const InventoryReceiptSchema = z.object({
    inventoryReceiptId: z
        .string()
        .uuid({ message: 'ID phiếu nhập/xuất kho không hợp lệ, phải là UUID' }),
    inventoryCode: z.string().length(12, { message: 'Mã code k quá 12 kí tự' }).trim(),
    inventoryRequestId: z
        .string()
        .uuid({ message: 'ID yêu cầu nhập/xuất kho không hợp lệ, phải là UUID' }),
    receiptTypeId: z
        .string()
        .uuid({ message: 'ID loại phiếu nhập/xuất không hợp lệ, phải là UUID' }),
    wareFromId: z.string().uuid({ message: 'ID kho nguồn không hợp lệ, phải là UUID' }),
    wareToId: z.string().uuid({ message: 'ID kho đích không hợp lệ, phải là UUID' }),
    status: z.coerce.number().int({ message: 'Trạng thái phải là số nguyên' }),
    createdBy: z.string().uuid(),
    createDate: z.string().datetime({ message: 'Phải là ngày hợp lệ.' }),
    subcategoryName: z.string().optional(),
});

export type InventoryReceipt = z.infer<typeof InventoryReceiptSchema>;

export const CreateInventoryReceiptSchema = InventoryReceiptSchema.omit({
    inventoryReceiptId: true,
    inventoryCode: true,
    createdBy: true,
    createDate: true,
    subcategoryName: true,
});
export type CreateInventoryReceipt = z.infer<typeof CreateInventoryReceiptSchema>;
