import { z } from 'zod';

export const WarehouseProductSchema = z.object({
    productId: z.string().uuid(),
    productCode: z.string().length(6, "Mã code phải đúng 6 ký tự.").trim(),
    productName: z.string().min(3, 'Tên hàng có ít nhất 3 ký tự.').trim(),
    quantity: z.preprocess((val) => Number(val), z.number().positive()), // số lượng trong kho
    unit: z
        .string()
        .min(1, 'Đơn vị không được để trống.')
        .regex(/^[A-Za-z]/, 'Ký tự đầu tiên phải là chữ cái.')
        .trim(), //đơn vị
    area: z
        .string()
        .min(1, 'Khu vực không được để trống.')
        .regex(/^[A-Za-z]/, 'Ký tự đầu tiên phải là chữ cái.')
        .trim(),
    // khu vực
    expiry: z.preprocess(
        (val) => {
            if (typeof val === 'string' && val.trim() !== '') {
                return new Date(val).toISOString(); // Chuyển thành DateTime
            }
            return undefined; // Nếu giá trị rỗng, trả về undefined để báo lỗi
        },
        z.string().datetime({ message: 'Hạn sử dụng không hợp lệ.' }),
    ),
    dateToImport: z.string().datetime({ message: 'Ngày nhập kho phải là ngày hợp lệ.' }), // ngày nhập kho
    supplier: z.string().trim().min(1, 'Không được để trống').trim(), // nhà cung cấp
    // minimum: z.number().min(100, 'Số lượng tối thiểu là 100'), // tối thiểu
    // maximum: z.number().max(2000, 'Số lượng tối đa là 2000 '), // tối đa
});

export type WarehouseProduct = z.infer<typeof WarehouseProductSchema>;

// Tạo product không có productId
export const CreateProductSchema = WarehouseProductSchema.omit({ productId: true }).refine(
    (data) => {
        const expiryDate = new Date(data.expiry).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);
        return expiryDate > today;
    },
    {
        message: 'Quá hạn sử dụng',
        path: ['expiry'],
    },
);

// .refine((data) => new Date(data.expiry) > new Date(), {
//     message: 'Quá hạn sử dụng',
//     path: ['expiry'], // nếu có lỗi thì lỗi sẽ được hiển thị ở ô input expiry
// });
