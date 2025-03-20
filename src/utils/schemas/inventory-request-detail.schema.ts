import { z } from 'zod';

export const InventoryRequestDetailSchema = z.object({
    inventoryRequestDetailId: z
        .string()
        .uuid({ message: 'ID chi tiết yêu cầu nhập kho không hợp lệ, phải là UUID' }),
    inventoryRequestId: z
        .string()
        .uuid({ message: 'ID yêu cầu nhập kho không hợp lệ, phải là UUID' }),
    resourceId: z.string().uuid({ message: 'ID tài nguyên không hợp lệ, phải là UUID' }),
    expectedQuantity: z.number().positive({ message: 'Số lượng mong đợi phải là số dương' }),
    unitId: z.string().uuid({ message: 'ID đơn vị không hợp lệ, phải là UUID' }),
    reason: z.string().optional(),
    expectedDate: z
        .string()
        .datetime({ message: 'Ngày mong đợi không hợp lệ, phải là định dạng ngày giờ hợp lệ' }),
    note: z.string().optional(),
});

export type InventoryRequestDetail = z.infer<typeof InventoryRequestDetailSchema>;
export const CreateInventoryRequestDetailSchema = InventoryRequestDetailSchema.omit({
    inventoryRequestDetailId: true,
});
