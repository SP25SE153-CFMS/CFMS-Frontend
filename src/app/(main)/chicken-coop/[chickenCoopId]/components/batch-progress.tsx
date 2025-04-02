import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

// Calculate the duration in days between start date and now
export const calculateDuration = (startDate: Date, endDate: Date | null) => {
    const start = dayjs(startDate);
    const end = endDate ? dayjs(endDate) : dayjs();
    return end.diff(start, 'day');
};

// Progress bar component for batch duration
export default function BatchProgress({
    startDate,
    endDate,
}: {
    startDate: Date;
    endDate: Date | null;
}) {
    const duration = calculateDuration(startDate, null);
    const total = calculateDuration(startDate, endDate);

    const progress = Math.min(Math.round((duration / total) * 100), 100);

    return (
        <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>Ngày nuôi: {duration}</span>
                <span>{progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500 ease-in-out',
                        progress < 30
                            ? 'bg-blue-500'
                            : progress < 70
                              ? 'bg-amber-500'
                              : 'bg-green-500',
                    )}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
