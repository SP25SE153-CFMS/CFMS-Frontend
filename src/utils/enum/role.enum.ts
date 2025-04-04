/* eslint-disable no-unused-vars */
export enum Role {
    ADMIN = 'Quản trị viên',
    STAFF = 'Nhân viên',
    CUSTOMER = 'Khách hàng',
    UNKNOWN = 'Không xác định',
}

export enum FarmRole {
    OWNER,
    MANAGER,
    STAFF,
    // UNKNOWN,
}

export const farmRoleLabels: Record<string, string> = {
    [FarmRole.OWNER]: 'Chủ trang trại',
    [FarmRole.MANAGER]: 'Quản lý',
    [FarmRole.STAFF]: 'Nhân viên',
    // [FarmRole.UNKNOWN]: 'Không xác định',
};
