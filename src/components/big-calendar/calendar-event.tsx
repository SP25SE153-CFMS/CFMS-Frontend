import { cn } from '@/lib/utils';
import { assignmentBadge } from '@/utils/enum/status.enum';
import { type Event } from './index';

interface CalendarEventProps {
    event: Event;
}

export function CalendarEvent({ event }: CalendarEventProps) {
    return (
        <div
            className={cn(
                'flex items-center px-2 py-1 rounded-md text-[10px] font-medium text-white',
                assignmentBadge[event.status],
            )}
        >
            <span className="truncate">{event.title}</span>
        </div>
    );
}
