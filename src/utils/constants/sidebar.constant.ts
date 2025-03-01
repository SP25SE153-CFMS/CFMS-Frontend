import config from "@/configs";
import { File, LucideIcon, PanelsTopLeft, Egg, House, UsersRound, Warehouse } from "lucide-react";

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

const basePath = "/";

export const sidebarItems: NavGroup[] = [
    {
        id: 1,
        label: "Quản lý",
        items: [
            {
                title: "Quản lý trang trại",
                path: basePath,
                icon: House,
                subItems: [
                    { title: "Danh sách khu nuôi", path: config.routes.breadingArea },
                    { title: "Danh sách chuồng nuôi", path: config.routes.chickenCoop },
                ]
            },
            {
                title: "Quản lý đàn gà",
                path: basePath,
                icon: Egg,
                subItems: [
                    { title: "Danh sách đàn gà", path: config.routes.flock },
                    { title: "Mục đích nuôi", path: config.routes.breadingArea },
                    { title: "Danh sách giống gà", path: config.routes.breadingArea },
                    { title: "Tiêu chí đánh giá SK", path: config.routes.breadingArea },
                    { title: "Danh sách bệnh gà", path: config.routes.breadingArea },
                    { title: "Danh mục vaccine", path: config.routes.breadingArea },
                    { title: "Nhật ký sức khỏe", path: config.routes.breadingArea },
                    { title: "Chế độ dinh dưỡng", path: config.routes.breadingArea },
                    { title: "Lịch sử tiêm phòng", path: config.routes.breadingArea },
                ]
            },
            {
                title: "Quản lý nhân công",
                path: basePath,
                icon: UsersRound,
                subItems: [
                    { title: "Danh sách nhân công", path: config.routes.breadingArea },
                    { title: "Danh sách công việc", path: config.routes.breadingArea },
                ]
            },
            {
                title: "Quản lý kho",
                path: basePath,
                icon: Warehouse,
                subItems: [
                    { title: "Kho thức ăn", path: config.routes.breadingArea },
                    { title: "Xuất/Nhập kho", path: config.routes.breadingArea },
                    { title: "Danh sách trang thiết bị", path: config.routes.equipment },
                    { title: "Danh sách phiếu yêu cầu", path: config.routes.request },
                ]
            },
        ],
    },
    {
        id: 2,
        label: "Tổng quan",
        items: [
            {
                title: "Trang chủ",
                path: config.routes.dashboard,
                icon: PanelsTopLeft,
            },
            {
                title: "Danh mục dùng chung",
                path: config.routes.breadingArea,
                icon: File,
            },
        ],
    },
];