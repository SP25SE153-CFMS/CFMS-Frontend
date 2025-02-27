import Image from 'next/image';
import Link from 'next/link';
import configs from '@/configs';
import { IoChevronForward, IoLockClosedSharp } from 'react-icons/io5';

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
        name: 'Liên hệ',
        href: '#contact',
    },
    {
        name: 'Blog',
        href: '#blog',
    },
];

export default function Home() {
    const CFMS = 'CFMS';

    return (
        <>
            <header className="navbar text-navy container relative z-[500] mx-auto flex h-24 items-center justify-between px-4 text-sm font-medium sm:px-6 lg:px-8">
                <Link
                    className="relative z-[60] flex items-center gap-4"
                    href={configs.routes.home}
                >
                    <Image src="/logo.png" alt="Logo" width="46" height="46" />
                    <h2 className="text-xl font-bold">CFMS</h2>
                </Link>

                <nav className="pointer-events-auto hidden items-center justify-end lg:flex xl:w-full">
                    <div className="absolute left-1/2 z-10 flex -translate-x-1/2 items-center rounded-full border border-white/50 bg-white/75 bg-gradient-to-r px-3 text-sm font-medium text-gray-800 shadow-lg shadow-gray-800/5 ring-1 ring-gray-800/[.075] backdrop-blur-xl">
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
                    className="w-36 rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-2 font-semibold leading-5 text-white transition-colors duration-300 focus:outline-none"
                >
                    Đăng nhập
                </Link>
            </header>

            <main className="flex flex-col items-center">
                <div className="mx-auto flex flex-col items-center py-16 text-center">
                    <div className="bg-[200%_200%]animate-glow pointer-events-none absolute top-[-320px] z-10 flex h-[400px] w-[min(600px,100vw)] scale-[1.5] items-center justify-center bg-gradient-to-r  from-primary to-secondary opacity-20 blur-[69px] will-change-transform" />
                    <h1 className="text-5xl font-bold">Hệ Thống Quản Lý Trang Trại Gà</h1>
                    <p className="my-7 max-w-xl text-center text-lg">
                        Bằng cách theo dõi sức khỏe của gà,
                        <strong className="mx-2 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                            {CFMS}
                        </strong>
                        tối ưu hóa hoạt động, lịch cho ăn và nâng cao năng suất tổng thể của trang
                        trại.
                    </p>
                    <Link
                        href={configs.routes.dashboard}
                        className="group relative flex items-center rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 pr-10 font-semibold leading-5 text-white transition-colors duration-300 focus:outline-none"
                    >
                        Khám Phá Ngay
                        <IoChevronForward className="absolute right-5 ml-2 transition-all duration-300 ease-in-out group-hover:right-4" />
                    </Link>
                </div>

                <div className="mb-12 rounded-xl shadow-preview">
                    <div className="flex h-12 items-center justify-between rounded-t-xl bg-gray-100 px-6">
                        <div className="flex gap-2">
                            <span className="block h-3 w-3 cursor-pointer rounded-full bg-red-500" />
                            <span className="block h-3 w-3 cursor-pointer rounded-full bg-yellow-500" />
                            <span className="block h-3 w-3 cursor-pointer rounded-full bg-green-500" />
                        </div>
                        <div className="rounded-md bg-white px-4 py-1 md:px-12 lg:px-20">
                            <div className="flex items-center gap-2">
                                <IoLockClosedSharp size="14" />
                                <span>{CFMS}</span>
                            </div>
                        </div>
                        <div className="w-14" />
                    </div>
                    <Image
                        src="/coming-soon.png"
                        alt="Sắp ra mắt"
                        width="960"
                        height="520"
                        className="rounded-b-xl"
                    />
                </div>

                {/* About Section */}
                <section id="about" className="w-full py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">Về CFMS</h2>
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="md:w-1/2 mb-8 md:mb-0">
                                <Image
                                    src="/coming-soon.png"
                                    alt="Về CFMS"
                                    width={500}
                                    height={300}
                                    className="rounded-lg shadow-lg"
                                />
                            </div>
                            <div className="md:w-1/2 md:pl-8">
                                <p className="text-lg mb-4">
                                    <strong className="mx-2 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                                        {CFMS}
                                    </strong>
                                    là Hệ Thống Quản Lý Trang Trại Gà tiên tiến được thiết kế để
                                    cách mạng hóa ngành công nghiệp gia cầm. Hệ thống của chúng tôi
                                    tận dụng công nghệ tiên tiến để theo dõi sức khỏe gà, tối ưu hóa
                                    lịch cho ăn và nâng cao năng suất tổng thể của trang trại.
                                </p>
                                <p className="text-lg mb-4">
                                    Với
                                    <strong className="mx-2 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                                        {CFMS}
                                    </strong>
                                    , các nhà quản lý trang trại có thể đưa ra quyết định dựa trên
                                    dữ liệu, giảm chi phí hoạt động và đảm bảo tiêu chuẩn cao nhất
                                    về phúc lợi động vật. Sứ mệnh của chúng tôi là trao quyền cho
                                    người chăn nuôi gà với các công cụ cần thiết để thành công trong
                                    thị trường cạnh tranh ngày nay.
                                </p>
                                <Link
                                    href="#"
                                    className="inline-block bg-primary text-white font-semibold px-6 py-2 rounded-md hover:bg-secondary transition-colors duration-300"
                                >
                                    Tìm Hiểu Thêm
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="w-full py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            Liên Hệ Với Chúng Tôi
                        </h2>
                        <div className="max-w-2xl mx-auto">
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block mb-2 font-medium">
                                        Họ Tên
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-slate-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 font-medium">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-slate-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block mb-2 font-medium">
                                        Tin Nhắn
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-slate-100"
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-primary text-white font-semibold px-6 py-2 rounded-md hover:bg-secondary transition-colors duration-300"
                                >
                                    Gửi Tin Nhắn
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Blog Section */}
                <section id="blog" className="w-full py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">Bài Viết Mới Nhất</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((post) => (
                                <div
                                    key={post}
                                    className="bg-white rounded-lg shadow-md overflow-hidden"
                                >
                                    <Image
                                        src="/coming-soon.png"
                                        alt={`Bài Viết ${post}`}
                                        width={400}
                                        height={200}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-2">
                                            Tiêu Đề Bài Viết {post}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                            Sed do eiusmod tempor incididunt ut labore et dolore
                                            magna aliqua.
                                        </p>
                                        <Link
                                            href="#"
                                            className="text-primary font-medium hover:text-secondary transition-colors duration-300"
                                        >
                                            Đọc Thêm
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
