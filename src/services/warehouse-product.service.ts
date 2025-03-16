import { warehouseProducts } from '@/utils/data/table.data';
import { WarehouseProduct } from '@/utils/schemas/warehouse-product.schema';

export const getProducts = async (): Promise<WarehouseProduct[]> => {
    return warehouseProducts;
};

// Create
export const createProduct = async (warehouseProduct: WarehouseProduct) => {
    // Mock API call
    warehouseProducts.push(warehouseProduct);
    return warehouseProduct;
};

// Update
export const updateProduct = async (warehouseProduct: WarehouseProduct) => {
    const index = warehouseProducts.findIndex(
        (product) => product.productId === warehouseProduct.productId,
    );
    warehouseProducts[index] = warehouseProduct;
    return warehouseProduct;
};

// Delete
export const deleteProduct = async (id: string) => {
    const index = warehouseProducts.findIndex((product) => product.productId === id);
    warehouseProducts.splice(index, 1);
    return id;
};
