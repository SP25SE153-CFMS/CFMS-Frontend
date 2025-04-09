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
    [CategoryStatus.INACTIVE]: 'Không hoạt động',
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

// User status
export enum UserStatus {
    INACTIVE,
    ACTIVE,
    BANNED,
    FIRED,
}

export const userStatusLabels: Record<string, string> = {
    [UserStatus.INACTIVE]: 'Không hoạt động',
    [UserStatus.ACTIVE]: 'Đang làm việc',
    [UserStatus.BANNED]: 'Bị cấm',
    [UserStatus.FIRED]: 'Nghỉ việc',
};

export const userStatusVariant: Record<string, any> = {
    [UserStatus.INACTIVE]: 'muted',
    [UserStatus.ACTIVE]: 'default',
    [UserStatus.BANNED]: 'warning',
    [UserStatus.FIRED]: 'destructive',
};

// Farm employee status
export enum FarmEmployeeStatus {
    INACTIVE,
    ACTIVE,
}

export const farmEmployeeStatusLabels: Record<string, string> = {
    [FarmEmployeeStatus.INACTIVE]: 'Không hoạt động',
    [FarmEmployeeStatus.ACTIVE]: 'Đang làm việc',
};

export const farmEmployeeStatusVariant: Record<string, any> = {
    [FarmEmployeeStatus.INACTIVE]: 'muted',
    [FarmEmployeeStatus.ACTIVE]: 'default',
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

// Task status
export enum TaskStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED,
}

export const taskStatusLabels: Record<string, string> = {
    [TaskStatus.PENDING]: 'Chờ xử lý',
    [TaskStatus.IN_PROGRESS]: 'Đang thực hiện',
    [TaskStatus.COMPLETED]: 'Hoàn thành',
};

export const taskStatusVariant: Record<string, any> = {
    [TaskStatus.PENDING]: 'outline',
    [TaskStatus.IN_PROGRESS]: 'default',
    [TaskStatus.COMPLETED]: 'success',
};

// Assignment status
export enum AssignmentStatus {
    PENDING,
    ASSIGNED,
    COMPLETED,
    CANCELLED,
}

export const assignmentStatusLabels: Record<string, string> = {
    [AssignmentStatus.PENDING]: 'Chưa giao',
    [AssignmentStatus.ASSIGNED]: 'Đã giao',
    [AssignmentStatus.COMPLETED]: 'Hoàn thành',
    [AssignmentStatus.CANCELLED]: 'Đã hủy',
};

export const assignmentStatusVariant: Record<string, any> = {
    [AssignmentStatus.PENDING]: 'outline',
    [AssignmentStatus.ASSIGNED]: 'default',
    [AssignmentStatus.COMPLETED]: 'success',
    [AssignmentStatus.CANCELLED]: 'destructive',
};

export const assignmentBackground: Record<string, string> = {
    [AssignmentStatus.PENDING]: 'bg-yellow-500',
    [AssignmentStatus.ASSIGNED]: 'bg-blue-500',
    [AssignmentStatus.COMPLETED]: 'bg-green-500',
    [AssignmentStatus.CANCELLED]: 'bg-red-500',
};

export const assignmentBorder: Record<string, string> = {
    [AssignmentStatus.PENDING]: 'border-l-yellow-500',
    [AssignmentStatus.ASSIGNED]: 'border-l-blue-500',
    [AssignmentStatus.COMPLETED]: 'border-l-green-500',
    [AssignmentStatus.CANCELLED]: 'border-l-red-500',
};

export const assignmentBadge: Record<string, any> = {
    [AssignmentStatus.PENDING]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    [AssignmentStatus.ASSIGNED]: 'bg-blue-50 text-blue-700 border-blue-200',
    [AssignmentStatus.COMPLETED]: 'bg-green-50 text-green-700 border-green-200',
    [AssignmentStatus.CANCELLED]: 'bg-red-50 text-red-700 border-red-200',
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
