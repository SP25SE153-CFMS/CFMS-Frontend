import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { CalendarIcon } from 'lucide-react';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
interface TimePickerProps {
    value?: string;
    // eslint-disable-next-line no-unused-vars
    onChange: (time: string) => void;
    interval?: number; // default to 15 minutes
    className?: string;
}

const generateTimeOptions = (interval: number) => {
    const times: string[] = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += interval) {
            const hour = h.toString().padStart(2, '0');
            const minute = m.toString().padStart(2, '0');
            times.push(`${hour}:${minute}:00`);
        }
    }
    return times;
};

export const TimePicker: React.FC<TimePickerProps> = ({
    value,
    onChange,
    interval = 15,
    className,
}) => {
    const [open, setOpen] = React.useState(false);

    const times = useMemo(() => generateTimeOptions(interval), [interval]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-40 justify-start text-left', className)}>
                    {value ? value : 'Chọn thời gian'}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Tìm kiếm..." />
                    <CommandList>
                        {times.map((time) => (
                            <CommandItem
                                key={time}
                                onSelect={() => {
                                    onChange(time);
                                    setOpen(false);
                                }}
                            >
                                {time}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
