import { Category } from '@/utils/schemas/category.schema';
import { get, post, put, remove } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { SubCategory } from '@/utils/schemas/sub-category.schema';
import { CategoryResponse, ChickenTypeResponse } from '@/utils/types/custom.type';
import { CategoryType } from '@/utils/enum/category.enum';
import { getCookie } from 'cookies-next';
import config from '@/configs';

const PREFIX = '/api/Category';

export const getCategories = async () => {
    const endpoint = PREFIX;
    const response = await get<Response<CategoryResponse[]>>(endpoint);
    return response.data.data;
};

export const getCategoryById = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await get<Response<CategoryResponse>>(endpoint);
    return response.data.data;
};

export const createCategory = async (body: Category) => {
    const endpoint = PREFIX;
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateCategory = async (body: Category) => {
    const endpoint = PREFIX;
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const deleteCategory = async (id: string) => {
    const endpoint = PREFIX + '/' + id;
    const response = await remove<Response<string>>(endpoint);
    return response.data;
};

export const addSubCategory = async (body: SubCategory) => {
    const endpoint = PREFIX + '/addSub';
    const response = await post<Response<string>>(endpoint, body);
    return response.data;
};

export const updateSubCategory = async (body: SubCategory) => {
    const endpoint = PREFIX + '/updateSub';
    const response = await put<Response<string>>(endpoint, body);
    return response.data;
};

export const getCategoryByType = async (type: CategoryType) => {
    const endpoint = PREFIX + '/categoryType/' + type;
    const response = await get<Response<CategoryResponse>>(endpoint);
    return response.data.data.subCategories;
};

export const getChickenTypes = async () => {
    const farmId = getCookie(config.cookies.farmId);
    const endpoint = `${PREFIX}/Farm/${farmId}/get-chickentypes`;
    const response = await get<Response<ChickenTypeResponse[]>>(endpoint);
    return response.data.data;
};

export const getSubByType = async (categoryType: CategoryType) => {
    const endpoint = PREFIX + '/sub-by-type/' + categoryType;
    const response = await get<Response<SubCategory[]>>(endpoint);
    return response.data.data;
};

export const getSubByTypeAndFarm = async (categoryType: CategoryType) => {
    const farmId = getCookie(config.cookies.farmId);
    const endpoint = PREFIX + '/sub-by-type-and-farm/' + categoryType + '/' + farmId;
    const response = await get<Response<SubCategory[]>>(endpoint);
    return response.data.data;
};

export const getSubBySubId = async (subCategoryId: string) => {
    const endpoint = PREFIX + '/' + 'get-sub-cate' + '/' + subCategoryId;
    const response = await get<Response<SubCategory>>(endpoint);
    return response.data.data;
};

export const getUnits = async () => {
    return await getCategoryByType(CategoryType.UNIT);
};

export const getPurposes = async () => {
    return await getCategoryByType(CategoryType.PURPOSE);
};

export const getPackageUnits = async () => {
    return await getCategoryByType(CategoryType.PACKAGE_UNIT);
};

export const getResources = async () => {
    return await getCategoryByType(CategoryType.RESOURCE);
};

export const getChickens = async () => {
    return await getCategoryByType(CategoryType.CHICKEN);
};

export const getSubCategoriesByType = async (type: CategoryType) => {
    const endpoint = PREFIX + '/sub-by-type/' + type;
    const response = await get<Response<SubCategory[]>>(endpoint);
    return response.data.data;
};

export const getSubPackage = async () => {
    return await getSubByType(CategoryType.PACKAGE_UNIT);
};

export const getSubFoodUnit = async () => {
    return await getSubByType(CategoryType.F_QUANTITY_UNIT);
};

export const getSubEquipmentUnit = async () => {
    return await getSubByType(CategoryType.E_QUANTITY_UNIT);
};

export const getSubMedicineUnit = async () => {
    return await getSubByType(CategoryType.M_QUANTITY_UNIT);
};

export const getSubMaterial = async () => {
    return await getSubByType(CategoryType.MATERIAL);
};

export const getSubSize = async () => {
    return await getSubByType(CategoryType.LENGTH_UNIT);
};

export const getSubWeight = async () => {
    return await getSubByType(CategoryType.WEIGHT_UNIT);
};

export const getSubDisease = async () => {
    return await getSubByType(CategoryType.DISEASE);
};
