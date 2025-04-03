import { cn } from '@/lib/utils';

interface Event {
    id: number;
    title: string;
    date: Date;
    color: string;
    shift?: number;
}

interface CalendarEventProps {
    event: Event;
}

export function CalendarEvent({ event }: CalendarEventProps) {
    return (
        <div
            className={cn(
                'flex items-center px-2 py-1 rounded-md text-xs font-medium text-white',
                event.color,
            )}
        >
            <span className="truncate">{event.title}</span>
            {/* {event.shift && (
                <span className="ml-1 bg-white/20 px-1 rounded text-[10px]">Ca {event.shift}</span>
            )} */}
        </div>
    );
}
