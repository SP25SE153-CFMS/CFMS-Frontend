import { z } from 'zod';

export const InventoryReceiptDetailSchema = z.object({
    inventoryReceiptDetailId: z
        .string()
        .uuid({ message: 'ID chi tiết phiếu nhập không hợp lệ, phải là UUID' }),
    inventoryReceiptId: z.string().uuid({ message: 'ID phiếu nhập không hợp lệ, phải là UUID' }),
    resourceId: z.string().uuid({ message: 'ID tài nguyên không hợp lệ, phải là UUID' }),
    actualQuantity: z.coerce.number().positive({ message: 'Số lượng thực tế phải là số dương' }),
    unitId: z.string().uuid({ message: 'ID đơn vị không hợp lệ, phải là UUID' }),
    reason: z.string().optional(),
    actualDate: z
        .string()
        .datetime({ message: 'Ngày thực tế không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    note: z.string().optional(),
});

export type InventoryReceiptDetail = z.infer<typeof InventoryReceiptDetailSchema>;
export const CreateInventoryReceiptDetailSchema = InventoryReceiptDetailSchema.omit({
    inventoryReceiptDetailId: true,
});
