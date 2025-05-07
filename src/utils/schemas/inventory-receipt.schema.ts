import { z } from 'zod';

export const InventoryReceiptSchema = z.object({
    inventoryReceiptId: z.string().uuid({ message: 'Phiếu nhập/xuất kho không hợp lệ' }),
    receiptCodeNumber: z.string().length(12, { message: 'Mã code không quá 12 kí tự' }).trim(),
    inventoryRequestId: z.string().uuid({ message: 'Yêu cầu nhập/xuất kho không hợp lệ' }),
    receiptTypeId: z.string().uuid({ message: 'Loại phiếu nhập/xuất không hợp lệ' }),
    wareFromId: z
        .string()
        .uuid({ message: 'Kho nguồn không hợp lệ' })
        .optional() // undefined
        .or(z.literal('')), // null
    wareToId: z.string().uuid({ message: 'Kho đích không hợp lệ' }).optional().or(z.literal('')),
    status: z.coerce.number().int({ message: 'Trạng thái phải là số nguyên' }),
    createdBy: z.string().uuid(),
    createDate: z.string().datetime({ message: 'Phải là ngày hợp lệ.' }),
    subcategoryName: z.string().optional(),
});

export type InventoryReceipt = z.infer<typeof InventoryReceiptSchema>;

export const CreateInventoryReceiptSchema = InventoryReceiptSchema.omit({
    inventoryReceiptId: true,
    receiptCodeNumber: true,
    createdBy: true,
    createDate: true,
    subcategoryName: true,
    status: true,
}).extend({
    batchNumber: z.number(),
    requestId: z.string().uuid({ message: 'Phiếu yêu cầu không hợp lệ' }),
    receiptDetails: z.array(
        z.object({
            resourceId: z.string().uuid({ message: 'Tài nguyên không hợp lệ' }),
            actualQuantity: z.number(),
            unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }),
            note: z.string(),
        }),
    ),
});
export type CreateInventoryReceipt = z.infer<typeof CreateInventoryReceiptSchema>;
