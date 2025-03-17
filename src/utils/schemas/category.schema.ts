import { z } from 'zod';

// Enum for status
const StatusEnum = z.enum(['0', '1'], {
    errorMap: () => ({ message: 'Trạng thái phải là 0 (ACTIVE) hoặc 1 (INACTIVE)' }),
});

// Category Schema
export const CategorySchema = z.object({
    categoryId: z.string().uuid({ message: 'ID danh mục không hợp lệ, phải là UUID' }),
    categoryName: z.string().min(1, { message: 'Tên danh mục không được để trống' }),
    categoryType: z.string().min(1, { message: 'Loại danh mục không được để trống' }),
    categoryCode: z.string().min(1, { message: 'Mã danh mục không được để trống' }),
    description: z.string().optional(),
    status: StatusEnum,
});

// SubCategory Schema
export const SubCategorySchema = z.object({
    subCategoryId: z.string().uuid({ message: 'ID danh mục con không hợp lệ, phải là UUID' }),
    subCategoryName: z.string().min(1, { message: 'Tên danh mục con không được để trống' }),
    description: z.string().optional(),
    status: StatusEnum,
    dataType: z.string().min(1, { message: 'Kiểu dữ liệu không được để trống' }),
    createdDate: z.coerce.date({
        errorMap: () => ({ message: 'Ngày tạo không hợp lệ, phải đúng định dạng ngày tháng' }),
    }),
    categoryId: z.string().uuid({ message: 'ID danh mục không hợp lệ, phải là UUID' }),
});

export type Category = z.infer<typeof CategorySchema>;
export type SubCategory = z.infer<typeof SubCategorySchema>;

export const CreateCategorySchema = CategorySchema.omit({ categoryId: true });
export const CreateSubCategorySchema = SubCategorySchema.omit({ subCategoryId: true });
