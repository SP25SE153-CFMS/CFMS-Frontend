/* eslint-disable no-unused-vars */
export enum DataType {
    STRING = 'string',
    INT = 'int',
    DECIMAL = 'decimal',
    BOOLEAN = 'boolean',
    DATE = 'date',
}

export const dataTypeLabels: Record<string, string> = {
    [DataType.STRING]: 'Kiểu ký tự (string)',
    [DataType.INT]: 'Kiểu số nguyên (int)',
    [DataType.DECIMAL]: 'Kiểu số thực (decimal)',
    [DataType.BOOLEAN]: 'Kiểu logic (boolean)',
    [DataType.DATE]: 'Kiểu ngày tháng (date)',
};
