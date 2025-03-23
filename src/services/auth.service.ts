import { post } from '@/utils/functions/axios.function';
import { Response } from '@/utils/types';

const PREFIX = '/api/Auth';

interface SigninResponse {
    accessToken: string;
    refreshToken: string;
}

export const signIn = async (body: { mail: string; password: string }) => {
    const endpoint = PREFIX + '/signin';
    const response = await post<Response<SigninResponse>>(endpoint, body);
    return response.data;
};
