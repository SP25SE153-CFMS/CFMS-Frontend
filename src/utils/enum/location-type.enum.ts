export enum LocationType {
    WAREHOUSE = 'WARE',
    CHICKEN_COOP = 'COOP',
}

export const locationTypeLabels: Record<string, string> = {
    [LocationType.WAREHOUSE]: 'Nhà kho',
    [LocationType.CHICKEN_COOP]: 'Chuồng nuôi',
};

export const locationTypeVariant: Record<string, string> = {
    [LocationType.WAREHOUSE]: 'outline',
    [LocationType.CHICKEN_COOP]: 'default',
};

export const LOCATION_TYPES = [
    { value: LocationType.WAREHOUSE, label: locationTypeLabels[LocationType.WAREHOUSE] },
    { value: LocationType.CHICKEN_COOP, label: locationTypeLabels[LocationType.CHICKEN_COOP] },
];
