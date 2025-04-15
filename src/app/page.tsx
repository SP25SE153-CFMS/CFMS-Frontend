import Image from 'next/image';
import Link from 'next/link';
import configs from '@/configs';
import { IoChevronForward, IoLockClosedSharp } from 'react-icons/io5';
import {
    CheckCircle,
    BarChart2,
    Users,
    Calendar,
    ClipboardList,
    Shield,
    ChevronRight,
    ArrowRight,
    ExternalLink,
} from 'lucide-react';
import { ThemeSwitch } from '@/components/theme-switch';

const NAV_BAR = [
    {
        name: 'Trang chủ',
        href: '/',
    },
    {
        name: 'Giới thiệu',
        href: '#about',
    },
    {
        name: 'Giải pháp',
        href: '#solution',
    },
    {
        name: 'Tính năng',
        href: '#features',
    },
    {
        name: 'Công nghệ',
        href: '#technology',
    },
];

export default function Home() {
    const projectName = {
        en: 'Chicken Farm Management System',
        vi: 'Hệ thống quản lý trại gà',
        abbr: 'CFMS',
    };

    return (
        <>
            <header className="navbar text-navy dark:text-white container relative z-[500] mx-auto flex h-24 items-center justify-between px-4 text-sm font-medium sm:px-6 lg:px-8">
                <Link
                    className="relative z-[60] flex items-center gap-4"
                    href={configs.routes.home}
                >
                    <Image src="/assets/logo/logo.png" alt="Logo" width="46" height="46" />
                    <h2 className="text-xl font-bold">{projectName.abbr}</h2>
                </Link>

                <nav className="pointer-events-auto hidden items-center justify-end lg:flex xl:w-full">
                    <div className="absolute left-1/2 z-10 flex -translate-x-1/2 items-center rounded-full border border-white/50 bg-white/75 dark:bg-gray-800/75 dark:border-gray-700/50 bg-gradient-to-r px-3 text-sm font-medium text-gray-800 dark:text-gray-200 shadow-lg shadow-gray-800/5 ring-1 ring-gray-800/[.075] dark:ring-white/[.075] backdrop-blur-xl">
                        {NAV_BAR.map((item) => (
                            <Link
                                key={item.name}
                                className="hover:primary group relative block flex-none px-4 py-2.5 transition duration-300"
                                href={item.href}
                            >
                                {item.name}
                                <span className="absolute inset-x-1 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-primary/50 to-primary/60 opacity-0 transition duration-300 group-hover:scale-x-100 group-hover:opacity-100"></span>
                                <span className="absolute inset-0 origin-bottom scale-0 overflow-hidden opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100">
                                    <span className="absolute inset-x-4 -bottom-2 h-full rounded-t-full bg-gradient-to-t from-primary/20 to-transparent blur"></span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </nav>

                <Link
                    href={configs.routes.signIn}
                    className="w-36 rounded-md bg-gradient-to-r from-primary to-secondary text-center p-2 font-semibold leading-5 text-white transition-colors duration-300 focus:outline-none"
                >
                    Đăng nhập
                </Link>
            </header>

            <main className="flex flex-col items-center">
                <div className="mx-auto flex flex-col items-center py-12 text-center">
                    <div className="bg-[200%_200%]animate-glow pointer-events-none absolute top-[-320px] z-10 flex h-[400px] w-[min(600px,100vw)] scale-[1.5] items-center justify-center bg-gradient-to-r from-primary to-secondary opacity-20 blur-[69px] will-change-transform" />
                    <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary mb-4">
                        Giải pháp quản lý trang trại thông minh
                    </div>
                    <h1 className="leading-[inherit] text-5xl font-bold uppercase bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary to-gray-900 dark:from-gray-100 dark:via-primary dark:to-gray-100">
                        Hệ Thống Quản Lý Trang Trại Vịt
                    </h1>
                    <p className="mb-8 mt-4 max-w-xl text-center text-lg dark:text-gray-300">
                        Bằng cách theo dõi sức khỏe của gà,
                        <strong className="mx-2 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                            {projectName.abbr}
                        </strong>
                        tối ưu hóa hoạt động, lịch cho ăn và nâng cao năng suất tổng thể của trang
                        trại.
                    </p>
                    <Link
                        href={configs.routes.signIn}
                        className="group relative flex items-center rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 pr-10 font-semibold leading-5 text-white transition-colors duration-300 focus:outline-none"
                    >
                        Đăng Nhập Ngay
                        <IoChevronForward className="absolute right-5 ml-2 transition-all duration-300 ease-in-out group-hover:right-4" />
                    </Link>
                </div>

                <div className="mb-12 rounded-xl shadow-preview">
                    <div className="flex h-12 items-center justify-between rounded-t-xl bg-gray-100 dark:bg-gray-800 px-6">
                        <div className="flex gap-2">
                            <span className="block h-3 w-3 cursor-pointer rounded-full bg-red-500" />
                            <span className="block h-3 w-3 cursor-pointer rounded-full bg-yellow-500" />
                            <span className="block h-3 w-3 cursor-pointer rounded-full bg-green-500" />
                        </div>
                        <div className="rounded-md bg-white dark:bg-gray-700 px-4 py-1 md:px-12 lg:px-20">
                            <div className="flex items-center gap-2">
                                <IoLockClosedSharp size="14" />
                                <span>{projectName.abbr}</span>
                            </div>
                        </div>
                        <div className="w-14" />
                    </div>
                    <Image
                        src="/preview-light.png"
                        alt="Sắp ra mắt"
                        width="960"
                        height="520"
                        className="rounded-b-xl block dark:hidden"
                    />
                    <Image
                        src="/preview-dark.png"
                        alt="Sắp ra mắt"
                        width="960"
                        height="520"
                        className="rounded-b-xl hidden dark:block"
                    />
                </div>

                {/* Problem Statement Section */}
                <section
                    id="about"
                    className="w-full py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
                >
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col items-center mb-12 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                <ClipboardList className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase dark:text-white">
                                Vấn Đề Hiện Tại
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-6"></div>
                            <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-400">
                                Hiểu rõ những thách thức trong quản lý trang trại gà hiện nay và
                                cách CFMS giải quyết chúng
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="md:w-1/2 mb-8 md:mb-0 relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-70"></div>
                                <div className="relative">
                                    <Image
                                        src="/preview-light.png"
                                        alt="Vấn đề hiện tại"
                                        width={600}
                                        height={400}
                                        className="rounded-xl shadow-xl object-cover dark:hidden"
                                    />
                                    <Image
                                        src="/preview-dark.png"
                                        alt="Vấn đề hiện tại"
                                        width={600}
                                        height={400}
                                        className="rounded-xl shadow-xl object-cover hidden dark:block"
                                    />
                                    <div className="absolute -bottom-5 -right-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                            &quot;Phương pháp thủ công không còn hiệu quả với quy mô
                                            trang trại hiện đại&quot;
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-lg">
                                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                            Dữ Liệu Phi Tập Trung
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Quản lý trang trại gà hiện đang đối mặt với nhiều thách
                                            thức do phụ thuộc vào phương pháp thủ công, dẫn đến việc
                                            lưu trữ dữ liệu phi tập trung khiến việc truy xuất và
                                            phân tích thông tin về chuồng trại, đàn gà, nguồn lực và
                                            chi phí trở nên khó khăn.
                                        </p>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-lg">
                                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                            Thiếu Công Cụ Giám Sát
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Thiếu các công cụ giám sát và theo dõi hiệu quả khiến
                                            chủ trang trại khó phát hiện sớm các vấn đề như dịch
                                            bệnh, thiếu hụt nguồn lực hoặc công việc bị trì hoãn.
                                            Điều này làm giảm khả năng đưa ra quyết định nhanh chóng
                                            và tối ưu.
                                        </p>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-lg">
                                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                            Bối Cảnh Ngành
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Chăn nuôi gia cầm đóng vai trò quan trọng trong ngành
                                            nông nghiệp, cung cấp nguồn thực phẩm và thu nhập đáng
                                            kể cho nông dân. Tuy nhiên, khi quy mô hoạt động tăng
                                            lên, phương pháp quản lý thủ công truyền thống khó theo
                                            kịp với sự phức tạp của nhu cầu canh tác hiện đại.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Solution Section */}
                <section
                    id="solution"
                    className="w-full py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900"
                >
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col items-center mb-16 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                <CheckCircle className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase dark:text-white">
                                Giải Pháp Toàn Diện
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-6"></div>
                            <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-400">
                                CFMS cung cấp giải pháp toàn diện để giải quyết các thách thức trong
                                quản lý trang trại gà
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:border-primary/20">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                                        <BarChart2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300 dark:text-white">
                                        Tối Ưu Hóa Quy Trình
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Phần mềm sẽ tối ưu hóa quy trình quản lý bằng cách tích hợp
                                        lịch trình công việc (cho ăn, tiêm vắc-xin, vệ sinh chuồng
                                        trại), theo dõi tiến độ và giám sát sức khỏe đàn gà.
                                    </p>
                                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center text-primary font-medium">
                                            <span>Tìm hiểu thêm</span>
                                            <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>

                                <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:border-primary/20">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                                        <ClipboardList className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300 dark:text-white">
                                        Báo Cáo Chi Tiết
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Cung cấp báo cáo chi tiết và bảng điều khiển trực quan để
                                        theo dõi điều kiện chuồng trại, tình trạng đàn gà và xác
                                        định các vấn đề như dịch bệnh hoặc thiếu hụt nguồn lực.
                                    </p>
                                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center text-primary font-medium">
                                            <span>Tìm hiểu thêm</span>
                                            <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>

                                <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:border-primary/20">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                                        <CheckCircle className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300 dark:text-white">
                                        Hỗ Trợ Ra Quyết Định
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Bằng cách tận dụng dữ liệu và phân tích, phần mềm sẽ hỗ trợ
                                        việc ra quyết định, đề xuất cải tiến, tối ưu hóa chi phí và
                                        tăng năng suất.
                                    </p>
                                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center text-primary font-medium">
                                            <span>Tìm hiểu thêm</span>
                                            <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>

                                <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:border-primary/20">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                                        <Users className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300 dark:text-white">
                                        Quản Lý Nhân Lực
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Tạo điều kiện quản lý lực lượng lao động hiệu quả bằng cách
                                        theo dõi hiệu suất của nhân viên và đảm bảo phân công vai
                                        trò rõ ràng, cải thiện hiệu quả và năng suất tổng thể của
                                        trang trại.
                                    </p>
                                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center text-primary font-medium">
                                            <span>Tìm hiểu thêm</span>
                                            <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section
                    id="features"
                    className="w-full py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
                >
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col items-center mb-16 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase dark:text-white">
                                Tính Năng Chính
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-6"></div>
                            <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-400">
                                CFMS cung cấp các tính năng toàn diện cho tất cả các vai trò trong
                                trang trại, từ chủ trang trại đến nhân viên chăm sóc gà
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-6 text-primary">
                                    Chủ Trang Trại
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Xem báo cáo hiệu suất công việc của từng nhóm nhân viên
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Theo dõi tình trạng đàn gà (nhập mới, bán, loại bỏ)
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Phân tích tốc độ tăng trưởng và dự báo sản lượng
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Quản lý thông tin nhân viên và phân quyền
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Ra quyết định chiến lược về nhập/xuất đàn gà
                                        </span>
                                    </li>
                                </ul>
                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <Link
                                        href="#"
                                        className="inline-flex items-center text-primary font-medium hover:underline"
                                    >
                                        Xem chi tiết
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
                                    <ClipboardList className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-6 text-primary">
                                    Quản Lý Trang Trại
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Lập lịch công việc hàng ngày/hàng tuần cho nhân viên
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Theo dõi tiến độ công việc và gửi nhắc nhở
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Quản lý chuồng trại và theo dõi tình trạng
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Giám sát sức khỏe đàn gà và lịch tiêm vắc-xin
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Quản lý nhập/xuất đàn gà và tổng hợp báo cáo
                                        </span>
                                    </li>
                                </ul>
                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <Link
                                        href="#"
                                        className="inline-flex items-center text-primary font-medium hover:underline"
                                    >
                                        Xem chi tiết
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
                                    <Calendar className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-6 text-primary">
                                    Nhân Viên Chăm Sóc Gà
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Theo dõi lịch cho ăn và cập nhật lượng thức ăn
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Ghi nhận tình trạng vệ sinh chuồng trại
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Cập nhật số lượng gà (khỏe mạnh, bệnh, tử vong)
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Báo cáo bằng hình ảnh và ghi chú về tình trạng
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Cập nhật tiến độ công việc và báo cáo vấn đề
                                        </span>
                                    </li>
                                </ul>
                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <Link
                                        href="#"
                                        className="inline-flex items-center text-primary font-medium hover:underline"
                                    >
                                        Xem chi tiết
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Technology Section */}
                <section
                    id="technology"
                    className="w-full py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900"
                >
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col items-center mb-16 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase dark:text-white">
                                Công Nghệ Sử Dụng
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-6"></div>
                            <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-400">
                                CFMS được xây dựng trên nền tảng công nghệ hiện đại, đảm bảo hiệu
                                suất và độ tin cậy cao
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
                                    <Shield className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-6 text-primary">
                                    Công Nghệ Phía Máy Chủ
                                </h3>
                                <ul className="space-y-6">
                                    <li className="flex items-center">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 mr-4">
                                            <div className="h-3 w-3 rounded-full bg-primary"></div>
                                        </div>
                                        <div>
                                            <span className="block font-semibold dark:text-white">
                                                ASP.NET Web API
                                            </span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Nền tảng máy chủ mạnh mẽ và bảo mật
                                            </span>
                                        </div>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 mr-4">
                                            <div className="h-3 w-3 rounded-full bg-primary"></div>
                                        </div>
                                        <div>
                                            <span className="block font-semibold dark:text-white">
                                                PostgreSQL
                                            </span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Hệ quản trị cơ sở dữ liệu hiệu suất cao
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
                                    <Calendar className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-6 text-primary">
                                    Công Nghệ Phía Người Dùng
                                </h3>
                                <ul className="space-y-6">
                                    <li className="flex items-center">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 mr-4">
                                            <div className="h-3 w-3 rounded-full bg-primary"></div>
                                        </div>
                                        <div>
                                            <span className="block font-semibold dark:text-white">
                                                Next.js
                                            </span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Framework React hiện đại cho ứng dụng web
                                            </span>
                                        </div>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 mr-4">
                                            <div className="h-3 w-3 rounded-full bg-primary"></div>
                                        </div>
                                        <div>
                                            <span className="block font-semibold dark:text-white">
                                                React Native
                                            </span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Phát triển ứng dụng di động đa nền tảng
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-16 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 max-w-4xl mx-auto">
                            <h3 className="text-xl font-semibold mb-6 text-center dark:text-white">
                                Yêu Cầu Phi Chức Năng
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors duration-300 hover:bg-primary/5 dark:hover:bg-primary/10">
                                    <CheckCircle className="h-8 w-8 text-primary mb-3" />
                                    <p className="font-medium text-center dark:text-white">
                                        Khả Năng Bảo Trì
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                                        Mã nguồn được thiết kế theo mô-đun và có tài liệu đầy đủ
                                    </p>
                                </div>
                                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors duration-300 hover:bg-primary/5 dark:hover:bg-primary/10">
                                    <CheckCircle className="h-8 w-8 text-primary mb-3" />
                                    <p className="font-medium text-center dark:text-white">
                                        Khả Năng Kiểm Toán
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                                        Nhật ký chi tiết và theo dõi hoạt động người dùng
                                    </p>
                                </div>
                                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors duration-300 hover:bg-primary/5 dark:hover:bg-primary/10">
                                    <CheckCircle className="h-8 w-8 text-primary mb-3" />
                                    <p className="font-medium text-center dark:text-white">
                                        Tính Toàn Vẹn Dữ Liệu
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                                        Đảm bảo dữ liệu chính xác và nhất quán
                                    </p>
                                </div>
                                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors duration-300 hover:bg-primary/5 dark:hover:bg-primary/10">
                                    <CheckCircle className="h-8 w-8 text-primary mb-3" />
                                    <p className="font-medium text-center dark:text-white">
                                        Khả Năng Sử Dụng
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                                        Giao diện thân thiện với người dùng
                                    </p>
                                </div>
                                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors duration-300 hover:bg-primary/5 dark:hover:bg-primary/10">
                                    <CheckCircle className="h-8 w-8 text-primary mb-3" />
                                    <p className="font-medium text-center dark:text-white">
                                        Hiệu Suất
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                                        Xử lý nhanh với khối lượng dữ liệu lớn
                                    </p>
                                </div>
                                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors duration-300 hover:bg-primary/5 dark:hover:bg-primary/10">
                                    <CheckCircle className="h-8 w-8 text-primary mb-3" />
                                    <p className="font-medium text-center dark:text-white">
                                        Độ Tin Cậy
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                                        Hoạt động ổn định và xử lý lỗi an toàn
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="w-full py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col items-center mb-16 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase dark:text-white">
                                Khách Hàng Nói Gì
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-6"></div>
                            <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-400">
                                Những trải nghiệm thực tế từ các chủ trang trại đã sử dụng CFMS
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center mb-6">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
                                    <div>
                                        <h4 className="font-semibold dark:text-white">
                                            Phạm Huy Anh Dũng
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Chủ Trang Trại Gà Miền Bắc
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 italic">
                                    &quot;CFMS đã giúp tôi tiết kiệm 30% thời gian quản lý và tăng
                                    năng suất trang trại lên đáng kể. Việc theo dõi sức khỏe đàn gà
                                    trở nên dễ dàng hơn bao giờ hết.&quot;
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center mb-6">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
                                    <div>
                                        <h4 className="font-semibold dark:text-white">
                                            Trần Hải Đăng
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Quản Lý Trang Trại Gà Miền Bắc
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 italic">
                                    &quot;CFMS đã giúp tôi quản lý trang trại gà một cách chuyên
                                    nghiệp hơn. Việc theo dõi thức ăn, thuốc men và lịch tiêm phòng
                                    trở nên dễ dàng.&quot;
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center mb-6">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
                                    <div>
                                        <h4 className="font-semibold dark:text-white">
                                            Phạm Thị Ngọc Anh
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Quản Lý Trang Trại Gà Miền Trung
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 italic">
                                    &quot;Hệ thống báo cáo và phân tích dữ liệu của CFMS giúp tôi
                                    đưa ra quyết định nhanh chóng và chính xác. Tỷ lệ tử vong của
                                    đàn gà đã giảm 25% kể từ khi chúng tôi sử dụng phần mềm
                                    này.&quot;
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center mb-6">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
                                    <div>
                                        <h4 className="font-semibold dark:text-white">
                                            Trương Đình Đông Dương
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Chủ Trang Trại Gà Miền Nam
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 italic">
                                    &quot;Quản lý nhân viên và phân công công việc trở nên hiệu quả
                                    hơn nhiều với CFMS. Tôi có thể theo dõi tiến độ công việc từ xa
                                    và đảm bảo mọi thứ đều đúng kế hoạch.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-20 bg-gradient-to-r from-primary to-secondary text-white">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 uppercase">
                                Sẵn Sàng Tối Ưu Hóa Trang Trại Gà Của Bạn?
                            </h2>
                            <p className="text-xl mb-8">
                                Hãy đăng nhập vào hệ thống CFMS ngay hôm nay để trải nghiệm cách
                                quản lý trang trại gà hiệu quả và thông minh.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={configs.routes.signIn}
                                    className="group relative overflow-hidden bg-white text-primary font-semibold px-8 py-3 rounded-md hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
                                >
                                    <span className="relative z-10">Đăng Nhập Ngay</span>
                                    <span className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out opacity-10"></span>
                                </Link>
                                <Link
                                    href="#"
                                    className="group relative overflow-hidden border-2 border-white bg-transparent text-white font-semibold px-8 py-3 rounded-md hover:bg-white/10 transition-colors duration-300 flex items-center justify-center"
                                >
                                    <span className="relative z-10">Liên Hệ Tư Vấn</span>
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full py-12 bg-gray-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10 p-1 mr-3">
                                    <Image
                                        src="/assets/logo/logo.png"
                                        alt="Logo"
                                        width="36"
                                        height="36"
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl">{projectName.abbr}</h3>
                                    <p className="text-xs text-gray-400">{projectName.en}</p>
                                </div>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Giải pháp quản lý trang trại gà toàn diện, giúp tối ưu hóa hoạt động
                                và tăng năng suất.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">Liên Kết</h4>
                            <ul className="space-y-2">
                                {NAV_BAR.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-gray-400 hover:text-white transition-colors duration-300"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">Liên Hệ</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    Email:{' '}
                                    <a
                                        href="mailto:cfms.corp@gmail.com"
                                        className="border-b border-transparent hover:border-white dark:hover:border-black"
                                    >
                                        cfms.corp@gmail.com
                                    </a>
                                </li>
                                <li>
                                    Điện thoại:{' '}
                                    <a
                                        href="tel:+84866914464"
                                        className="border-b border-transparent hover:border-white dark:hover:border-black"
                                    >
                                        (84) 866 914 464
                                    </a>
                                </li>
                                <li>Địa chỉ: Đường D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">Đăng Ký Nhận Tin</h4>
                            <p className="text-gray-400 mb-4">
                                Nhận thông tin cập nhật mới nhất về CFMS
                            </p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="px-4 py-2 rounded-l-md w-full focus:outline-none text-gray-800 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                />
                                <button className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-r-md transition-colors duration-300">
                                    Gửi
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
                        <div className="text-sm text-gray-400 mb-4 md:mb-0">
                            &copy; {new Date().getFullYear()} CFMS. Đã đăng ký bản quyền.
                        </div>
                        <div className="flex space-x-6">
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors duration-300"
                            >
                                Điều khoản sử dụng
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors duration-300"
                            >
                                Chính sách bảo mật
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>

            <div className="fixed bottom-4 right-4 z-50">
                <div className="border rounded-full shadow-md bg-white dark:bg-gray-800">
                    <ThemeSwitch />
                </div>
            </div>
        </>
    );
}
