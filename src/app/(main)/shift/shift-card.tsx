/* eslint-disable no-unused-vars */
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Shift } from '@/utils/schemas/shift.schema';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Sun, Sunset, Moon, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

dayjs.extend(duration);

interface ShiftCardProps {
    shift: Shift;
    setCurrentShift: (shift: Shift) => void;
    setOpenUpdate: (open: boolean) => void;
    setOpenDelete: (open: boolean) => void;
}

export default function ShiftCard({
    shift,
    setCurrentShift,
    setOpenUpdate,
    setOpenDelete,
}: ShiftCardProps) {
    const { shiftName, startTime, endTime } = shift;

    // Calculate duration in hours and minutes
    const calculateDuration = () => {
        const dummyDate = '1970-01-01'; // Needed to avoid "Invalid Date"

        const start = dayjs(`${dummyDate} ${startTime}`, 'YYYY-MM-DD HH:mm:ss');
        const end = dayjs(`${dummyDate} ${endTime}`, 'YYYY-MM-DD HH:mm:ss');

        const diffMs = end.diff(start); // milliseconds
        const diffDuration = dayjs.duration(diffMs);

        const hours = diffDuration.hours(); // hours
        const minutes = diffDuration.minutes(); // minutes

        return `${hours}h ${minutes ? minutes + 'm' : ''}`;
    };

    // Determine time of day based on start time
    const getTimeOfDay = () => {
        const hour = Number.parseInt(startTime.split(':')[0], 10);

        if (hour >= 5 && hour < 12) {
            return 'morning';
        } else if (hour >= 12 && hour < 18) {
            return 'afternoon';
        } else {
            return 'evening';
        }
    };

    // Get background and border colors based on time of day
    const getTimeBasedStyles = () => {
        const timeOfDay = getTimeOfDay();

        switch (timeOfDay) {
            case 'morning':
                return {
                    bgGradient: 'bg-gradient-to-r from-amber-50 to-yellow-50',
                    borderColor: 'border-l-amber-500',
                    icon: <Sun className="h-4 w-4 text-amber-500" />,
                    label: 'Buổi sáng',
                };
            case 'afternoon':
                return {
                    bgGradient: 'bg-gradient-to-r from-blue-50 to-sky-50',
                    borderColor: 'border-l-blue-500',
                    icon: <Sunset className="h-4 w-4 text-blue-500" />,
                    label: 'Buổi chiều',
                };
            case 'evening':
                return {
                    bgGradient: 'bg-gradient-to-r from-indigo-50 to-purple-50',
                    borderColor: 'border-l-indigo-500',
                    icon: <Moon className="h-4 w-4 text-indigo-500" />,
                    label: 'Buổi tối',
                };
            default:
                return {
                    bgGradient: '',
                    borderColor: 'border-l-primary',
                    icon: null,
                    label: '',
                };
        }
    };

    const { bgGradient, borderColor, icon, label } = getTimeBasedStyles();

    return (
        <Card
            className={cn(
                'w-full max-w-sm transition-all duration-300 overflow-hidden',
                'hover:shadow-lg hover:translate-y-[-2px]',
                'border-l-4 mt-4',
                bgGradient,
                borderColor,
            )}
        >
            <div className="p-5">
                <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between space-y-0">
                    <div>
                        <div className="flex items-center gap-2">
                            {icon}
                            <h3 className="font-semibold text-lg text-slate-700">{shiftName}</h3>
                            {/* <span className="text-xs text-slate-500">{label}</span> */}
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                            {/* <Calendar className="h-3.5 w-3.5" /> */}
                            Thời lượng: {calculateDuration()}
                        </p>
                    </div>
                    <Badge variant="outline" className="text-slate-500">
                        {label}
                    </Badge>
                </CardHeader>

                <CardContent className="p-0 pt-3">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className={cn(
                                    'rounded-lg p-3 border shadow-sm bg-white',
                                    'transition-transform hover:scale-[1.02]',
                                )}
                            >
                                <div className="text-xs uppercase font-medium text-slate-500 mb-1">
                                    Bắt đầu
                                </div>
                                <div className="text-lg font-bold text-slate-500">{startTime}</div>
                            </div>

                            <div
                                className={cn(
                                    'rounded-lg p-3 border shadow-sm bg-white',
                                    'transition-transform hover:scale-[1.02]',
                                )}
                            >
                                <div className="text-xs uppercase font-medium text-slate-500 mb-1">
                                    Kết thúc
                                </div>
                                <div className="text-lg font-bold text-slate-500">{endTime}</div>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <div className="flex justify-end gap-2 mt-4" onClick={() => setCurrentShift(shift)}>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => setOpenUpdate(true)}
                    >
                        <Edit className="h-4 w-4" />
                        Cập nhật
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-red-500"
                        onClick={() => setOpenDelete(true)}
                    >
                        <Trash className="h-4 w-4 " />
                        Xóa
                    </Button>
                </div>
            </div>
        </Card>
    );
}
