import { z } from 'zod';

export const InventoryRequestSchema = z.object({
    inventoryRequestId: z
        .string()
        .uuid({ message: 'ID yêu cầu nhập kho không hợp lệ, phải là UUID' }),
    requestId: z.string().uuid({ message: 'ID yêu cầu không hợp lệ, phải là UUID' }),
    inventoryRequestTypeId: z
        .string()
        .uuid({ message: 'ID loại yêu cầu nhập kho không hợp lệ, phải là UUID' }),
    wareFromId: z.string().uuid({ message: 'ID kho nguồn không hợp lệ, phải là UUID' }),
    wareToId: z.string().uuid({ message: 'ID kho đích không hợp lệ, phải là UUID' }),
});

export type InventoryRequest = z.infer<typeof InventoryRequestSchema>;
export const CreateInventoryRequestSchema = InventoryRequestSchema.omit({
    inventoryRequestId: true,
});
