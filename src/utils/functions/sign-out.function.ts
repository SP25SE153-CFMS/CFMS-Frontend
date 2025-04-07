import { deleteCookie } from 'cookies-next';

import config from '@/configs';
import { signOut } from '@/services/auth.service';

export const signOutUser = async () => {
    await signOut();
    deleteCookie(config.cookies.accessToken);
    deleteCookie(config.cookies.farmId);
};
