import { z } from 'zod';
import { CategoryStatus } from '../enum/status.enum';

export const SubCategorySchema = z.object({
    subCategoryId: z.string().uuid({ message: 'ID danh mục con không hợp lệ' }),
    subCategoryName: z.string().min(1, { message: 'Tên danh mục con là bắt buộc' }),
    description: z.string().optional(),
    status: z.nativeEnum(CategoryStatus, { message: 'Trạng thái không hợp lệ' }),
    dataType: z.string().optional(),
    categoryId: z.string().uuid({ message: 'ID danh mục không hợp lệ' }),
});

export type SubCategory = z.infer<typeof SubCategorySchema>;
export const CreateSubCategorySchema = SubCategorySchema.omit({
    subCategoryId: true,
    status: true,
});
