import { get } from '@/utils/functions/axios.function';

export const getAddress = async (lat: number, lng: number): Promise<string> => {
    const endpoint = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    try {
        const response: any = await get(endpoint);
        return response?.data?.display_name;
    } catch (error) {
        console.error('Error fetching address:', error);
        return '';
    }
};
