import { warehouseProduct } from '@/utils/data/table.data';
import { WarehouseProduct } from '@/utils/schemas/warehouse-product.schema';

export const getProducts = async (): Promise<WarehouseProduct[]> => {
    return warehouseProduct;
};
