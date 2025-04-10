import { env } from '@/env';
import { get, post } from '@/utils/functions/axios.function';
import { SignInRequest, SignUpRequest } from '@/utils/schemas/auth.schema';
import { User } from '@/utils/schemas/user.schema';
import { Response } from '@/utils/types';

const PREFIX = '/api/Auth';

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export const signIn = async (body: SignInRequest) => {
    const endpoint = PREFIX + '/signin';
    const response = await post<Response<AuthResponse>>(endpoint, body);
    return response.data;
};

export const signInGoogle = () => {
    const endpoint = env.NEXT_PUBLIC_API_URL + PREFIX + '/google-signin';
    window.location.href = endpoint;
};

export const signUp = async (body: SignUpRequest) => {
    const endpoint = PREFIX + '/signup';
    const response = await post<Response<AuthResponse>>(endpoint, body);
    return response.data;
};

export const signOut = async () => {
    const endpoint = PREFIX + '/signout';
    const response = await post<Response<string>>(endpoint, {});
    return response.data;
};

export const getCurrentUser = async () => {
    const endpoint = PREFIX + '/me';
    const response = await get<Response<User>>(endpoint);
    return response.data.data;
};
