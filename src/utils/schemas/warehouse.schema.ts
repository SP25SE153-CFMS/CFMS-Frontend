import { z } from 'zod';

export const WarehouseSchema = z.object({
    wareId: z.string().uuid({ message: 'Ko không hợp lệ' }),
    farmId: z.string().uuid({ message: 'Trang trại không hợp lệ' }),
    resourceTypeId: z.string().uuid({ message: 'Loại tài nguyên không hợp lệ' }),
    // storageTypeId: z.string().uuid({ message: 'Loại kho lưu trữ không hợp lệ' }),
    warehouseName: z.string().min(1, { message: 'Tên kho là bắt buộc' }),
    maxQuantity: z.coerce.number().positive({ message: 'Số lượng tối đa phải là số dương' }),
    maxWeight: z.coerce.number().positive({ message: 'Khối lượng tối đa phải là số dương' }),
    currentQuantity: z.coerce.number().nonnegative({ message: 'Số lượng hiện tại không được âm' }),
    currentWeight: z.coerce.number().nonnegative({ message: 'Khối lượng hiện tại không được âm' }),
    description: z.string().optional(),
    status: z.coerce.number().int({ message: 'Trạng thái phải là số nguyên' }),
});

export type Warehouse = z.infer<typeof WarehouseSchema>;
export const CreateWarehouseSchema = WarehouseSchema.omit({ wareId: true });
