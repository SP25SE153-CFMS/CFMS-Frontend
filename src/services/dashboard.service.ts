import { get } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';
import { DashboardResponse } from '@/utils/types/custom.type';

const PREFIX = '/api/Dashboard';

export const getDashboardByFarmId = async (farmId: string) => {
    const endpoint = PREFIX + '/Farm/' + farmId;
    const response = await get<Response<DashboardResponse>>(endpoint);
    return response.data.data;
};
