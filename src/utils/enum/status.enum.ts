/* eslint-disable no-unused-vars */

// This is a common status enum for all entities
export enum CommonStatus {
    INACTIVE,
    ACTIVE,
}

export const commonStatusLabels: Record<string, string> = {
    [CommonStatus.INACTIVE]: 'Không hoạt động',
    [CommonStatus.ACTIVE]: 'Hoạt động',
};

export const commonStatusVariant: Record<string, any> = {
    [CommonStatus.INACTIVE]: 'destructive',
    [CommonStatus.ACTIVE]: 'default',
};

// Category status
export enum CategoryStatus {
    INACTIVE,
    ACTIVE,
}

export const categoryStatusLabels: Record<string, string> = {
    [CategoryStatus.INACTIVE]: 'Không hooạt động',
    [CategoryStatus.ACTIVE]: 'Hoạt động',
};

export const categoryStatusVariant: Record<string, any> = {
    [CategoryStatus.INACTIVE]: 'outline',
    [CategoryStatus.ACTIVE]: 'default',
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
    INACTIVE,
    ACTIVE,
    BANNED,
    FIRED,
}

export const employeeStatusLabels: Record<string, string> = {
    [EmployeeStatus.INACTIVE]: 'Không hoạt động',
    [EmployeeStatus.ACTIVE]: 'Đang làm việc',
    [EmployeeStatus.BANNED]: 'Bị cấm',
    [EmployeeStatus.FIRED]: 'Đã sa thải',
};

export const employeeStatusVariant: Record<string, any> = {
    [EmployeeStatus.INACTIVE]: 'muted',
    [EmployeeStatus.ACTIVE]: 'default',
    [EmployeeStatus.BANNED]: 'warning',
    [EmployeeStatus.FIRED]: 'destructive',
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
    [RequestStatus.PENDING]: 'Đang chờ duyệt',
    [RequestStatus.REJECTED]: 'Từ chối',
    [RequestStatus.APPROVED]: 'Đã duyệt',
};

export const requestStatusVariant: Record<string, any> = {
    [RequestStatus.PENDING]: 'outline',
    [RequestStatus.REJECTED]: 'destructive',
    [RequestStatus.APPROVED]: 'default',
};

// Chicken batch status
export enum ChickenBatchStatus {
    INACTIVE,
    ACTIVE,
    COMPLETED,
}

export const chickenBatchStatusLabels: Record<string, string> = {
    [ChickenBatchStatus.INACTIVE]: 'Chưa hoạt động',
    [ChickenBatchStatus.ACTIVE]: 'Hoạt động',
    [ChickenBatchStatus.COMPLETED]: 'Kết thúc',
};

export const chickenBatchStatusVariant: Record<string, any> = {
    [ChickenBatchStatus.INACTIVE]: 'outline',
    [ChickenBatchStatus.ACTIVE]: 'default',
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

// Scale
export enum Scale {
    SMALL,
    MEDIUM,
    LARGE,
}

export const scaleLabels: Record<string, string> = {
    [Scale.SMALL]: 'Nhỏ',
    [Scale.MEDIUM]: 'Trung bình',
    [Scale.LARGE]: 'Lớn',
};

export enum BreedingAreaStatus {
    INACTIVE,
    ACTIVE,
}

export const breedingAreaStatusLabels: Record<string, string> = {
    [BreedingAreaStatus.INACTIVE]: 'Tạm ngưng',
    [BreedingAreaStatus.ACTIVE]: 'Đang hoạt động',
};

export const breedingAreaStatusVariant: Record<string, any> = {
    [BreedingAreaStatus.INACTIVE]: 'destructive',
    [BreedingAreaStatus.ACTIVE]: 'default',
};

// Supplier
export enum SuppilerStatus {
    INACTIVE,
    ACTIVE,
}

export const supplierStatusLabels: Record<string, string> = {
    [SuppilerStatus.INACTIVE]: 'Ngừng hoạt động',
    [SuppilerStatus.ACTIVE]: 'Đang hoạt động',
};

export const supplierStatusVariant: Record<string, any> = {
    [SuppilerStatus.INACTIVE]: 'destructive',
    [SuppilerStatus.ACTIVE]: 'default',
};

// Inventory receipt
export enum ReceiptStatus {
    PENDING,
    REJECTED,
    APPROVED,
}

export const receiptStatusLabels: Record<string, string> = {
    [ReceiptStatus.PENDING]: 'Đang chờ duyệt',
    [ReceiptStatus.REJECTED]: 'Từ chối',
    [ReceiptStatus.APPROVED]: 'Đã duyệt',
};

export const receiptStatusVariant: Record<string, any> = {
    [ReceiptStatus.PENDING]: 'outline',
    [ReceiptStatus.REJECTED]: 'destructive',
    [ReceiptStatus.APPROVED]: 'default',
};
