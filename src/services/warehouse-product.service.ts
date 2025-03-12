import { warehouseProducts } from '@/utils/data/table.data';
import { WarehouseProduct } from '@/utils/schemas/warehouse-product.schema';

export const getProducts = async (): Promise<WarehouseProduct[]> => {
    return warehouseProducts;
};

export const createProducts = async (warehouseProduct: WarehouseProduct) => {
    // Mock API call
    warehouseProducts.push(warehouseProduct);
    return warehouseProduct;
};
