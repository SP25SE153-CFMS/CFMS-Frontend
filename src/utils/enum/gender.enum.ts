/* eslint-disable no-unused-vars */
export enum ChickenGender {
    ROOSTER,
    HEN,
}

export const chickenGenderLabels: Record<string, string> = {
    [ChickenGender.ROOSTER]: 'Gà trống',
    [ChickenGender.HEN]: 'Gà mái',
};

export const chickenGenderVariant: Record<string, any> = {
    [ChickenGender.ROOSTER]: 'default',
    [ChickenGender.HEN]: 'default',
};
