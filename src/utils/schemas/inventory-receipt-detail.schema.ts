import { z } from 'zod';

export const InventoryReceiptDetailSchema = z.object({
    inventoryReceiptDetailId: z.string().uuid({ message: 'Chi tiết phiếu nhập không hợp lệ' }),
    inventoryReceiptId: z.string().uuid({ message: 'Phiếu nhập không hợp lệ' }),
    resourceId: z.string().uuid({ message: 'Tài nguyên không hợp lệ' }),
    actualQuantity: z.coerce.number().positive({ message: 'Số lượng thực tế phải là số dương' }),
    unitId: z.string().uuid({ message: 'Đơn vị không hợp lệ' }),
    // reason: z.string().optional(),
    actualDate: z
        .string()
        .datetime({ message: 'Ngày thực tế không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    note: z.string().optional(),
    batchNumber: z.coerce.number().positive({ message: 'Số lứa nuôi phải là số dương' }),
});

export type InventoryReceiptDetail = z.infer<typeof InventoryReceiptDetailSchema>;

export const CreateInventoryReceiptDetailSchema = InventoryReceiptDetailSchema.omit({
    inventoryReceiptDetailId: true,
    actualDate: true,
});
export type CreateInventoryReceiptDetail = z.infer<typeof CreateInventoryReceiptDetailSchema>;
