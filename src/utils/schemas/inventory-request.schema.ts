import { z } from 'zod';

export const InventoryRequestSchema = z.object({
    inventoryRequestId: z.string().uuid({ message: 'ID yêu cầu nhập kho không hợp lệ' }),
    requestId: z.string().uuid({ message: 'ID yêu cầu không hợp lệ' }),
    inventoryRequestTypeId: z.string().uuid({ message: 'ID loại yêu cầu nhập kho không hợp lệ' }),
    wareFromId: z.string().uuid({ message: 'ID kho nguồn không hợp lệ' }),
    wareToId: z.string().uuid({ message: 'ID kho đích không hợp lệ' }),
});

export type InventoryRequest = z.infer<typeof InventoryRequestSchema>;
export const CreateInventoryRequestSchema = InventoryRequestSchema.omit({
    inventoryRequestId: true,
});
