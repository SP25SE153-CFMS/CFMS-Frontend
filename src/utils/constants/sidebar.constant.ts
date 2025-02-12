import config from "@/configs";
import { File, LucideIcon, PanelsTopLeft, Egg, House, UsersRound, Warehouse, Settings } from "lucide-react";

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
        label: "Tổng quan",
        items: [
            {
                title: "Trang chủ",
                path: config.routes.dashboard,
                icon: PanelsTopLeft,
            },
        ],
    },
    {
        id: 2,
        label: "Quản lý",
        items: [
            {
                title: "Quản lý trang trại",
                path: basePath,
                icon: House,
                subItems: [
                    { title: "Danh sách trang trại", path: config.routes.chickenFlock },
                    { title: "Danh sách khu nuôi", path: config.routes.chickenFlock },
                    { title: "Danh sách chuồng nuôi", path: config.routes.chickenFlock },
                ]
            },
            {
                title: "Quản lý đàn gà",
                path: basePath,
                icon: Egg,
                subItems: [
                    { title: "Danh sách đàn gà", path: config.routes.chickenFlock },
                    { title: "Danh sách mục đích nuôi", path: config.routes.chickenFlock },
                    { title: "Danh sách giống gà", path: config.routes.chickenFlock },
                    { title: "Danh sách tiêu chí đánh giá sức khỏe gà", path: config.routes.chickenFlock },
                    { title: "Danh sách bệnh gà", path: config.routes.chickenFlock },
                    { title: "Danh mục vaccine", path: config.routes.chickenFlock },
                    { title: "Nhật ký sức khỏe", path: config.routes.chickenFlock },
                    { title: "Chế độ dinh dưỡng", path: config.routes.chickenFlock },
                    { title: "Lịch sử tiêm phòng", path: config.routes.chickenFlock },
                    { title: "Danh sách tiêu chí đánh giá sức khỏe gà", path: config.routes.chickenFlock },
                ]
            },
            {
                title: "Quản lý nhân công",
                path: basePath,
                icon: UsersRound,
                subItems: [
                    { title: "Danh sách nhân công", path: config.routes.chickenFlock },
                    { title: "Danh sách công việc", path: config.routes.chickenFlock },
                ]
            },
            {
                title: "Quản lý kho",
                path: basePath,
                icon: Warehouse,
                subItems: [
                    { title: "Kho thức ăn", path: config.routes.chickenFlock },
                    { title: "Xuất/Nhập kho", path: config.routes.chickenFlock },
                ]
            },
        ],
    },
    {
        id: 3,
        label: "Cấu hình",
        items: [
            {
                title: "Cài đặt ứng dụng",
                path: config.routes.chickenFlock,
                icon: Settings,
            },
            {
                title: "Danh mục dùng chung",
                path: config.routes.chickenFlock,
                icon: File,
            },
        ],
    },
];