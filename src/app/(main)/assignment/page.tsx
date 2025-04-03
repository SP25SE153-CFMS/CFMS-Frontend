import { Calendar } from '@/components/big-calendar';

export default function Home() {
    const events = [
        { id: 1, title: 'Chăm sóc gà', date: new Date(2025, 3, 5), color: 'bg-blue-500', shift: 1 },
        {
            id: 2,
            title: 'Thu hoạch trứng',
            date: new Date(2025, 3, 15),
            color: 'bg-red-500',
            shift: 2,
        },
        {
            id: 3,
            title: 'Kiểm tra thiết bị',
            date: new Date(2025, 3, 20),
            color: 'bg-yellow-500',
            shift: 1,
        },
        {
            id: 3,
            title: 'Tiêm vắc xin',
            date: new Date(2025, 3, 20),
            color: 'bg-green-500',
            shift: 1,
        },
        {
            id: 4,
            title: 'Kiểm tra thiết bị',
            date: new Date(2025, 3, 25),
            color: 'bg-purple-500',
            shift: 3,
        },
        {
            id: 5,
            title: 'Cho gà ăn',
            date: new Date(2025, 3, 10),
            color: 'bg-yellow-500',
            shift: 2,
        },
    ];

    const shifts = [
        { id: 1, name: 'Ca 1', timeRange: '6:00 - 14:00', startHour: 6, endHour: 14 },
        { id: 2, name: 'Ca 2', timeRange: '14:00 - 22:00', startHour: 14, endHour: 22 },
        { id: 3, name: 'Ca 3', timeRange: '22:00 - 6:00', startHour: 22, endHour: 6 },
    ];

    return (
        <main className="container mx-auto py-10 px-4">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Công việc được giao</h1>
                    <p className="text-muted-foreground">
                        Quản lý công việc được giao và thêm công việc mới vào lịch.
                    </p>
                </div>
                <Calendar events={events} shifts={shifts} />
            </div>
        </main>
    );
}
