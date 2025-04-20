import { z } from 'zod';

export const WarehouseSchema = z.object({
    wareId: z.string().uuid({ message: 'ID kho không hợp lệ, phải là UUID' }),
    farmId: z.string().uuid({ message: 'ID trang trại không hợp lệ, phải là UUID' }),
    resourceTypeId: z.string().uuid({ message: 'ID loại tài nguyên không hợp lệ, phải là UUID' }),
    // storageTypeId: z.string().uuid({ message: 'ID loại lưu trữ không hợp lệ, phải là UUID' }),
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
