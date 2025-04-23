import { Crown, ShieldCheck, User } from 'lucide-react';

/* eslint-disable no-unused-vars */
export enum Role {
    ADMIN = 'Quản trị viên',
    STAFF = 'Nhân viên',
    CUSTOMER = 'Khách hàng',
    UNKNOWN = 'Không xác định',
}

export enum FarmRole {
    // UNKNOWN,
    ADMIN,
    STAFF,
    MANAGER,
    OWNER,
}

export const farmRoleLabels: Record<string, string> = {
    // [FarmRole.UNKNOWN]: 'Không xác định',
    [FarmRole.ADMIN]: 'Quản trị viên',
    [FarmRole.STAFF]: 'Nhân viên',
    [FarmRole.MANAGER]: 'Quản lý',
    [FarmRole.OWNER]: 'Chủ trang trại',
};

export const farmRoleConfigs: Record<string, any> = {
    [FarmRole.STAFF]: {
        label: 'Nhân viên',
        color: 'bg-green-100 text-green-800 hover:bg-green-200',
        border: 'border-green-200',
        icon: User,
    },
    [FarmRole.MANAGER]: {
        label: 'Quản lý',
        color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        border: 'border-blue-200',
        icon: ShieldCheck,
    },
    [FarmRole.OWNER]: {
        label: 'Chủ trang trại',
        color: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
        border: 'border-amber-200',
        icon: Crown,
    },
};
