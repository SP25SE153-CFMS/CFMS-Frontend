import { z } from 'zod';

export const warehouseProductSchema = z
    .object({
        productId: z.string().uuid(),
        productCode: z.string().min(3, 'Mã hàng có ít nhất 3 ký tự'),
        productName: z.string().min(3, 'Tên hàng có ít nhất 3 ký tự'),
        currentQuantity: z.number().nonnegative(), // số lượng tồn kho
        unit: z.string().min(1, 'Đơn vị không được để trống'), //đơn vị
        area: z.string(), // khu vực
        expiry: z.string().datetime({ message: 'Hạn sử dụng phải là ngày hợp lệ' }), // hạn sử dụng
        dateToImport: z.string().datetime({ message: 'Ngày nhập kho phải là ngày hợp lệ' }), // ngày nhập kho
        supplier: z.string().trim().min(1, 'Không được để trống'), // nhà cung cấp
        // minimum: z.number().min(100, 'Số lượng tối thiểu là 100'), // tối thiểu
        // maximum: z.number().max(2000, 'Số lượng tối đa là 2000 '), // tối đa
    })
    .refine((data) => new Date(data.dateToImport) < new Date(data.expiry), {
        message: 'Quá hạn sử dụng',
        path: ['dateToImport'],
    });

export type WarehouseProduct = z.infer<typeof warehouseProductSchema>;
