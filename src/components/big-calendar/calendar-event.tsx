import { cn } from '@/lib/utils';
import { assignmentBadge } from '@/utils/enum/status.enum';
import { Event } from './type';
import Link from 'next/link';
import config from '@/configs';

interface CalendarEventProps {
    event: Event;
}

export function CalendarEvent({ event }: CalendarEventProps) {
    return (
        <Link
            href={`${config.routes.task}/${event.id}`}
            className={cn(
                'flex items-center px-2 py-1 rounded-md text-[10px] font-medium text-white',
                assignmentBadge[event.status],
            )}
        >
            <span className="truncate">{event.title}</span>
        </Link>
    );
}
