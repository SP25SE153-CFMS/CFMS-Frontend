import config from '@/configs';
import { LucideIcon, Egg, House, UsersRound, Warehouse } from 'lucide-react';

export interface NavSubItem {
    title: string;
    path: string;
}

export interface NavMainItem {
    title: string;
    path: string;
    icon?: LucideIcon;
    isActive?: boolean;
    subItems?: NavSubItem[];
}

export interface NavGroup {
    id: number;
    label: string;
    items: NavMainItem[];
}

const basePath = '/';

export const sidebarItems: NavGroup[] = [
    {
        id: 1,
        label: 'Quản lý',
        items: [
            {
                title: 'Quản lý trang trại',
                path: basePath,
                icon: House,
                subItems: [
                    { title: 'Danh sách khu nuôi', path: config.routes.breadingArea },
                    { title: 'Danh sách chuồng nuôi', path: config.routes.chickenCoop },
                ],
            },
            {
                title: 'Quản lý lứa nuôi',
                path: basePath,
                icon: Egg,
                subItems: [
                    { title: 'Danh sách lứa nuôi', path: config.routes.chickenBatch },
                    // { title: 'Danh sách giống gà', path: config.routes.chicken },
                    { title: 'Giai đoạn phát triển', path: config.routes.growthStage },
                    { title: 'Chế độ dinh dưỡng', path: config.routes.nutritionPlan },
                ],
            },
            {
                title: 'Quản lý nhân công',
                path: basePath,
                icon: UsersRound,
                subItems: [
                    // { title: 'Danh sách nhân công', path: config.routes.employee },
                    { title: 'Danh sách công việc', path: config.routes.task },
                    { title: 'Danh sách nhân công', path: config.routes.farmEmployee },
                    // { title: 'Lịch trình công việc', path: config.routes.assignment },
                    { title: 'Ca làm việc', path: config.routes.shift },
                ],
            },
            {
                title: 'Quản lý kho',
                path: basePath,
                icon: Warehouse,
                subItems: [
                    { title: 'Danh sách kho', path: config.routes.ware },
                    // { title: 'Danh sách thức ăn', path: config.routes.food },
                    // { title: 'Danh sách trang thiết bị', path: config.routes.equipment },
                    { title: 'Danh sách nhà cung cấp', path: config.routes.supplier },
                    { title: 'Danh sách phiếu yêu cầu', path: config.routes.request },
                    // {
                    //     title: 'DS phiếu nhập/xuất kho',
                    //     path: config.routes.inventoryReceipt,
                    // },
                ],
            },
        ],
    },
];
