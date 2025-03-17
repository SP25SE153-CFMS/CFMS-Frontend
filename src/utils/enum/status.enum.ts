/* eslint-disable no-unused-vars */

// Category status
export enum CategoryStatus {
    ACTIVE,
    INACTIVE,
}

export const categoryStatusLabels: Record<string, string> = {
    [CategoryStatus.ACTIVE]: 'Hoạt động',
    [CategoryStatus.INACTIVE]: 'Không hooạt động',
};

export const categoryStatusVariant: Record<string, any> = {
    [CategoryStatus.ACTIVE]: 'default',
    [CategoryStatus.INACTIVE]: 'outline',
};

// Chicken coop status
export enum ChickenCoopStatus {
    AVAILABLE,
    OCCUPIED,
    UNDER_MAINTENANCE,
}

export const chickenCoopStatusLabels: Record<string, string> = {
    [ChickenCoopStatus.AVAILABLE]: 'Còn trống',
    [ChickenCoopStatus.OCCUPIED]: 'Đang sử dụng',
    [ChickenCoopStatus.UNDER_MAINTENANCE]: 'Bảo trì',
};

export const chickenCoopStatusVariant: Record<string, any> = {
    [ChickenCoopStatus.AVAILABLE]: 'default',
    [ChickenCoopStatus.OCCUPIED]: 'outline',
    [ChickenCoopStatus.UNDER_MAINTENANCE]: 'warning',
};

// Employee status
export enum EmployeeStatus {
    WORKING,
    RESIGNED,
}

export const employeeStatusLabels: Record<string, string> = {
    [EmployeeStatus.WORKING]: 'Đang làm việc',
    [EmployeeStatus.RESIGNED]: 'Nghỉ việc',
};

export const employeeStatusVariant: Record<string, any> = {
    [EmployeeStatus.WORKING]: 'default',
    [EmployeeStatus.RESIGNED]: 'outline',
};

// Equipment status
export enum EquipmentStatus {
    IN_USE,
    BROKEN,
    UNDER_MAINTENANCE,
}

export const equipmentStatusLabels: Record<string, string> = {
    [EquipmentStatus.IN_USE]: 'Đang sử dụng',
    [EquipmentStatus.BROKEN]: 'Hỏng',
    [EquipmentStatus.UNDER_MAINTENANCE]: 'Bảo trì',
};

export const equipmentStatusVariant: Record<string, any> = {
    [EquipmentStatus.IN_USE]: 'default',
    [EquipmentStatus.BROKEN]: 'destructive',
    [EquipmentStatus.UNDER_MAINTENANCE]: 'warning',
};

// Flock status
export enum FlockStatus {
    IN_FARM,
    SOLD,
    REMOVED,
    DEAD,
}

export const flockStatusLabels: Record<string, string> = {
    [FlockStatus.IN_FARM]: 'Trong trang trại',
    [FlockStatus.SOLD]: 'Đã bán',
    [FlockStatus.REMOVED]: 'Đã loại bỏ',
    [FlockStatus.DEAD]: 'Đã chết',
};

export const flockStatusVariant: Record<string, any> = {
    [FlockStatus.IN_FARM]: 'default',
    [FlockStatus.SOLD]: 'outline',
    [FlockStatus.REMOVED]: 'muted',
    [FlockStatus.DEAD]: 'destructive',
};

// Request status
export enum RequestStatus {
    PENDING,
    REJECTED,
    APPROVED,
}

export const requestStatusLabels: Record<string, string> = {
    [RequestStatus.PENDING]: 'Đang duyệt',
    [RequestStatus.REJECTED]: 'Từ chối',
    [RequestStatus.APPROVED]: 'Đã duyệt',
};

export const requestStatusVariant: Record<string, any> = {
    [RequestStatus.PENDING]: 'success',
    [RequestStatus.REJECTED]: 'destructive',
    [RequestStatus.APPROVED]: 'default',
};

// Chicken batch status
export enum ChickenBatchStatus {
    ACTIVE,
    INACTIVE,
    COMPLETED,
}

export const chickenBatchStatusLabels: Record<string, string> = {
    [ChickenBatchStatus.ACTIVE]: 'Hoạt động',
    [ChickenBatchStatus.INACTIVE]: 'Chưa hoạt động',
    [ChickenBatchStatus.COMPLETED]: 'Kết thúc',
};

export const chickenBatchStatusVariant: Record<string, any> = {
    [ChickenBatchStatus.ACTIVE]: 'default',
    [ChickenBatchStatus.INACTIVE]: 'outline',
    [ChickenBatchStatus.COMPLETED]: 'destructive',
};

// Vaccination log status
export enum VaccinationLogStatus {
    ACTIVE,
    INACTIVE,
}

export const vaccinationLogStatusLabels: Record<string, string> = {
    [VaccinationLogStatus.ACTIVE]: 'Đã tiêm',
    [VaccinationLogStatus.INACTIVE]: 'Chưa tiêm',
};

export const vaccinationLogStatusVariant: Record<string, any> = {
    [VaccinationLogStatus.ACTIVE]: 'default',
    [VaccinationLogStatus.INACTIVE]: 'outline',
};
