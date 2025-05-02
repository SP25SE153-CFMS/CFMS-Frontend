import { z } from 'zod';

export const InventoryReceiptSchema = z.object({
    inventoryReceiptId: z.string().uuid({ message: 'ID phiếu nhập/xuất kho không hợp lệ' }),
    inventoryCode: z.string().length(12, { message: 'Mã code k quá 12 kí tự' }).trim(),
    inventoryRequestId: z.string().uuid({ message: 'ID yêu cầu nhập/xuất kho không hợp lệ' }),
    receiptTypeId: z.string().uuid({ message: 'ID loại phiếu nhập/xuất không hợp lệ' }),
    wareFromId: z.string().uuid({ message: 'ID kho nguồn không hợp lệ' }),
    wareToId: z.string().uuid({ message: 'ID kho đích không hợp lệ' }),
    status: z.coerce.number().int({ message: 'Trạng thái phải là số nguyên' }),
    createdBy: z.string().uuid(),
    createDate: z.string().datetime({ message: 'Phải là ngày hợp lệ.' }),
    subcategoryName: z.string().optional(),
});

export type InventoryReceipt = z.infer<typeof InventoryReceiptSchema>;

// const ReceiptDetailSchema = z.object({
//     resourceId: z.string().uuid({ message: 'ID không hợp lệ, phải là UUID' }),
//     actualQuantity: z.number(),
//     unitId: z.string().uuid({ message: 'ID không hợp lệ, phải là UUID' }),
//     note: z.string(),
// });

export const CreateInventoryReceiptSchema = InventoryReceiptSchema.omit({
    inventoryReceiptId: true,
    inventoryCode: true,
    createdBy: true,
    createDate: true,
    subcategoryName: true,
    status: true,
}).extend({
    batchNumber: z.number(),
    requestId: z.string().uuid({ message: 'ID không hợp lệ, phải là UUID' }),
    receiptDetails: z.array(
        z.object({
            resourceId: z.string().uuid({ message: 'ID không hợp lệ, phải là UUID' }),
            actualQuantity: z.number(),
            unitId: z.string().uuid({ message: 'ID không hợp lệ, phải là UUID' }),
            note: z.string(),
        }),
    ),
});
export type CreateInventoryReceipt = z.infer<typeof CreateInventoryReceiptSchema>;
