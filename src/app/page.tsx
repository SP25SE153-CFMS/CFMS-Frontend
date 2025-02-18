import Image from 'next/image';
import Link from 'next/link';
import configs from '@/configs';
import { IoChevronForward, IoLockClosedSharp } from 'react-icons/io5';

const NAV_BAR = [
    {
        name: 'Home',
        href: '/',
    },
    {
        name: 'About',
        href: '#about',
    },
    {
        name: 'Contact',
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
                    href={configs.routes.login}
                    className="rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-2 font-semibold leading-5 text-black transition-colors duration-300 focus:outline-none"
                >
                    Login
                </Link>
            </header>

            <main className="flex flex-col items-center">
                <div className="mx-auto flex flex-col items-center py-16 text-center">
                    <div className="bg-[200%_200%]animate-glow pointer-events-none absolute top-[-320px] z-10 flex h-[400px] w-[min(600px,100vw)] scale-[1.5] items-center justify-center bg-gradient-to-r  from-primary to-secondary opacity-20 blur-[69px] will-change-transform" />
                    <h1 className="text-5xl font-bold">Chicken Farm Management System</h1>
                    <p className="my-7 max-w-lg text-center text-lg">
                        By monitoring chicken health,
                        <strong className="mx-2 text-primary bg-clip-text">
                            {CFMS}
                        </strong>
                        optimizes operations, feed schedules, and enhances overall farm
                        productivity.
                    </p>
                    <Link
                        href={configs.routes.login}
                        className="group relative flex items-center rounded-md bg-gradient-to-r from-primary to-secondary px-6 py-3 pr-10 font-semibold leading-5 text-black transition-colors duration-300 focus:outline-none"
                    >
                        Discover Now
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
                        alt="Coming soon"
                        width="960"
                        height="520"
                        className="rounded-b-xl"
                    />
                </div>
            </main>
        </>
    );
}
