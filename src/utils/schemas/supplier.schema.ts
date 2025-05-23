import { z } from 'zod';

export const SupplierSchema = z.object({
    supplierId: z.string().uuid({ message: 'Nhà cung cấp không hợp lệ' }),
    supplierName: z.string().min(1, { message: 'Tên nhà cung cấp là bắt buộc' }).trim(),
    supplierCode: z.string().min(1, { message: 'Mã nhà cung cấp là bắt buộc' }),
    address: z.string().min(1, { message: 'Điền địa chỉ nhà cung cấp' }).trim(),
    phoneNumber: z
        .string()
        .trim()
        // .regex(/^[0-9]{10,11}$/, { message: 'Điền số điện thoại' }),
        .optional(),
    bankAccount: z
        .string()
        .regex(/^\d{8,20}$/, { message: 'Số tài khoản ngân hàng không hợp lệ' })
        .trim(),
    status: z.number().int().default(1),
});

export const CreateSupplierSchema = SupplierSchema.omit({ supplierId: true }).extend({
    farmId: z.string().uuid({ message: 'Trang trại không hợp lệ' }),
});

export type Supplier = z.infer<typeof SupplierSchema>;
export type CreateSupplier = z.infer<typeof CreateSupplierSchema>;
