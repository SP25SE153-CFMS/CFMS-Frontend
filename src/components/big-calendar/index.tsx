/* eslint-disable no-unused-vars */
'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CalendarEvent } from '@/components/big-calendar/calendar-event';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { assignmentBackground } from '@/utils/enum/status.enum';
import { Badge } from '../ui/badge';
import { Event, ShiftEvent } from './type';

type ViewMode = 'month' | 'week';

export function Calendar({ events, shifts }: { events: Event[]; shifts: ShiftEvent[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [calendarEvents, setCalendarEvents] = useState<Event[]>(events);
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: selectedDate || currentDate,
        color: 'bg-blue-500',
        shift: '',
        status: 0,
    });

    // Get current month and year
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get days in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Get first day of month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    // Get day names in Vietnamese
    const dayNames = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    // Get month names in Vietnamese
    const monthNames = [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
    ];

    // Vietnamese weekday names (full)
    const weekdayNames = [
        'Chủ Nhật',
        'Thứ Hai',
        'Thứ Ba',
        'Thứ Tư',
        'Thứ Năm',
        'Thứ Sáu',
        'Thứ Bảy',
    ];

    // Navigate to previous period (month or week)
    const prevPeriod = () => {
        if (viewMode === 'month') {
            setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
        } else {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 7);
            setCurrentDate(newDate);
        }
    };

    // Navigate to next period (month or week)
    const nextPeriod = () => {
        if (viewMode === 'month') {
            setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
        } else {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 7);
            setCurrentDate(newDate);
        }
    };

    // Get current week dates
    const getWeekDates = () => {
        const dates = [];
        // Find the start of the week (Sunday)
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - day);

        // Get 7 days starting from the start of the week
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            dates.push(date);
        }

        return dates;
    };

    // Check if a date has events
    const getEventsForDate = (date: Date) => {
        return calendarEvents.filter(
            (event) =>
                event.date.getDate() === date.getDate() &&
                event.date.getMonth() === date.getMonth() &&
                event.date.getFullYear() === date.getFullYear(),
        );
    };

    // Get events for a specific date and shift
    const getEventsForDateAndShift = (date: Date, shiftId: string) => {
        return calendarEvents.filter(
            (event) =>
                event.date.getDate() === date.getDate() &&
                event.date.getMonth() === date.getMonth() &&
                event.date.getFullYear() === date.getFullYear() &&
                event.shift === shiftId,
        );
    };

    // Open add event dialog
    const openAddEvent = (date: Date, shift?: string) => {
        setSelectedDate(date);
        setNewEvent({
            title: '',
            date: date,
            color: 'bg-blue-500',
            shift: shift || '',
            status: 0,
        });
        setIsAddEventOpen(true);
    };

    // Handle adding a new event
    const handleAddEvent = () => {
        if (newEvent.title.trim() === '') return;

        const newEventObj: Event = {
            id: Date.now().toString(), // Use timestamp as a simple unique ID
            title: newEvent.title,
            date: selectedDate || currentDate,
            color: newEvent.color,
            status: newEvent.status,
            shift: newEvent.shift,
        };

        setCalendarEvents([...calendarEvents, newEventObj]);
        setIsAddEventOpen(false);
        setNewEvent({
            title: '',
            date: selectedDate || currentDate,
            color: 'bg-blue-500',
            shift: '',
            status: 0,
        });
    };

    // Format time in Vietnamese
    const formatTime = (hour: number) => {
        return `${hour} giờ`;
    };

    // Get shift name by ID
    const getShiftName = (shiftId: string) => {
        const shift = shifts.find((s) => s.id === shiftId);
        return shift ? shift.name : '';
    };

    // Get shift time range by ID
    const getShiftTimeRange = (shiftId: string) => {
        const shift = shifts.find((s) => s.id === shiftId);
        return shift ? shift.timeRange : '';
    };

    // Generate calendar days for month view
    const generateMonthView = () => {
        const calendarDays = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(
                <div
                    key={`empty-${i}`}
                    className="h-28 border border-border p-1 bg-muted/20"
                ></div>,
            );
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateEvents = getEventsForDate(date);
            const isSelected =
                selectedDate &&
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();

            const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === currentMonth &&
                new Date().getFullYear() === currentYear;

            calendarDays.push(
                <div
                    key={`day-${day}`}
                    className={cn(
                        'h-28 border border-border p-2 transition-colors hover:bg-muted/30 group relative',
                        isSelected && 'bg-muted/50 ring-1 ring-primary/20',
                        isToday && 'border-primary',
                    )}
                    onClick={() => setSelectedDate(date)}
                >
                    <div className="flex justify-between">
                        <span
                            className={cn(
                                'inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                                isToday && 'bg-primary text-primary-foreground',
                            )}
                        >
                            {day}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                openAddEvent(date);
                            }}
                        >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Thêm sự kiện</span>
                        </Button>
                    </div>
                    <div className="space-y-1 overflow-y-auto">
                        {dateEvents.slice(0, 2).map((event) => (
                            <CalendarEvent key={event.id} event={event} />
                        ))}
                        {dateEvents.length > 2 && (
                            <Badge
                                variant="outline"
                                className="block w-fit mt-1 text-[10px] text-slate-400 py-0 px-2"
                            >
                                +{dateEvents.length - 2}
                            </Badge>
                        )}
                    </div>
                </div>,
            );
        }

        return <div className="grid grid-cols-7 gap-px bg-muted">{calendarDays}</div>;
    };

    // Generate week view with shifts
    const generateWeekView = () => {
        const weekDates = getWeekDates();

        return (
            <div className="flex flex-col">
                <div className="grid grid-cols-8 gap-px bg-muted border-b">
                    <div className="p-3 text-center text-sm font-medium bg-background"></div>
                    {weekDates.map((date, index) => {
                        const isToday =
                            new Date().getDate() === date.getDate() &&
                            new Date().getMonth() === date.getMonth() &&
                            new Date().getFullYear() === date.getFullYear();

                        const isSelected =
                            selectedDate &&
                            date.getDate() === selectedDate.getDate() &&
                            date.getMonth() === selectedDate.getMonth() &&
                            date.getFullYear() === selectedDate.getFullYear();

                        return (
                            <div
                                key={index}
                                className={cn(
                                    'p-3 text-center bg-background flex flex-col items-center cursor-pointer hover:bg-muted/30 transition-colors',
                                    isSelected && 'bg-muted/50',
                                    isToday && 'border-b-2 border-primary',
                                )}
                                onClick={() => setSelectedDate(date)}
                            >
                                <div className="text-xs text-muted-foreground">
                                    {dayNames[date.getDay()]}
                                </div>
                                <div
                                    className={cn(
                                        'mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                                        isToday && 'bg-primary text-primary-foreground',
                                    )}
                                >
                                    {date.getDate()}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div
                    className="grid grid-cols-8 gap-px bg-muted overflow-y-auto"
                    style={{ height: '600px' }}
                >
                    {/* Shift column */}
                    <div className="bg-background flex flex-col">
                        {shifts.map((shift) => (
                            <div
                                key={shift.id}
                                className="h-[200px] border-b border-r border-border p-2 flex flex-col justify-center"
                            >
                                <div className="font-medium">{shift.name}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {shift.timeRange}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Days columns */}
                    {weekDates.map((date, dateIndex) => (
                        <div key={dateIndex} className="bg-background relative">
                            {shifts.map((shift) => (
                                <div
                                    key={shift.id}
                                    className="h-[200px] border-b border-r border-border group relative p-1"
                                    onClick={() => {
                                        const newDate = new Date(date);
                                        setSelectedDate(newDate);
                                    }}
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const newDate = new Date(date);
                                            openAddEvent(newDate, shift.id);
                                        }}
                                    >
                                        <Plus className="h-3 w-3" />
                                        <span className="sr-only">Thêm sự kiện</span>
                                    </Button>

                                    {/* Events for this day and shift */}
                                    <div className="mt-6 space-y-1 overflow-y-auto max-h-[150px]">
                                        {getEventsForDateAndShift(date, shift.id).map((event) => (
                                            <div
                                                key={event.id}
                                                className={cn(
                                                    'rounded-md px-2 py-1 text-xs font-medium text-white',
                                                    event.color,
                                                )}
                                            >
                                                {event.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Color options for events
    const colorOptions = [
        { value: 'bg-blue-500', label: 'Xanh dương' },
        { value: 'bg-red-500', label: 'Đỏ' },
        { value: 'bg-green-500', label: 'Xanh lá' },
        { value: 'bg-yellow-500', label: 'Vàng' },
        { value: 'bg-purple-500', label: 'Tím' },
        { value: 'bg-pink-500', label: 'Hồng' },
        { value: 'bg-orange-500', label: 'Cam' },
        { value: 'bg-teal-500', label: 'Xanh ngọc' },
    ];

    // Format date in Vietnamese
    const formatDateVN = (date: Date) => {
        return `${weekdayNames[date.getDay()]}, ngày ${date.getDate()} ${monthNames[date.getMonth()]} năm ${date.getFullYear()}`;
    };

    // Get current period title
    const getPeriodTitle = () => {
        if (viewMode === 'month') {
            return `${monthNames[currentMonth]} năm ${currentYear}`;
        } else {
            const weekDates = getWeekDates();
            const startDate = weekDates[0];
            const endDate = weekDates[6];

            // If same month
            if (startDate.getMonth() === endDate.getMonth()) {
                return `${startDate.getDate()} - ${endDate.getDate()} ${monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`;
            } else {
                // Different months
                return `${startDate.getDate()} ${monthNames[startDate.getMonth()]} - ${endDate.getDate()} ${monthNames[endDate.getMonth()]} ${startDate.getFullYear()}`;
            }
        }
    };

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">{getPeriodTitle()}</h2>
                <div className="flex items-center space-x-2">
                    <Tabs
                        value={viewMode}
                        onValueChange={(value) => setViewMode(value as ViewMode)}
                        className="mr-4"
                    >
                        <TabsList>
                            <TabsTrigger value="week">Tuần</TabsTrigger>
                            <TabsTrigger value="month">Tháng</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <Button
                        variant="outline"
                        // size="icon"
                        onClick={() => setIsAddEventOpen(true)}
                        className="mr-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="">Giao việc</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={prevPeriod}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">
                            {viewMode === 'month' ? 'Tháng trước' : 'Tuần trước'}
                        </span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextPeriod}>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">
                            {viewMode === 'month' ? 'Tháng sau' : 'Tuần sau'}
                        </span>
                    </Button>
                </div>
            </div>

            {viewMode === 'month' && (
                <>
                    <div className="grid grid-cols-7 gap-px border-b bg-muted">
                        {dayNames.map((day) => (
                            <div
                                key={day}
                                className="p-3 text-center text-sm font-medium bg-background"
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                    {generateMonthView()}
                </>
            )}

            {viewMode === 'week' && generateWeekView()}

            {selectedDate && (
                <div className="border-t p-6 bg-muted/10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">{formatDateVN(selectedDate)}</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openAddEvent(selectedDate)}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm sự kiện
                        </Button>
                    </div>
                    <div className="mt-4">
                        {getEventsForDate(selectedDate).length > 0 ? (
                            <div className="space-y-3">
                                {getEventsForDate(selectedDate).map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-center space-x-3 p-3 rounded-lg bg-background shadow-sm"
                                    >
                                        <div
                                            className={cn(
                                                'h-4 w-4 rounded-full',
                                                assignmentBackground[event.status],
                                            )}
                                        ></div>
                                        <span className="font-medium">{event.title}</span>
                                        <div className="flex items-center ml-auto">
                                            {event.shift && (
                                                <span className="text-sm bg-muted px-2 py-0.5 rounded mr-2">
                                                    {getShiftName(event.shift)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground p-4 text-center bg-background/50 rounded-lg">
                                <p>Không có sự kiện nào</p>
                                <p className="text-sm mt-1">
                                    Nhấn &ldquo;Thêm sự kiện&rdquo; để tạo mới
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add Event Dialog */}
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Giao công việc mới</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="event-title">Tiêu đề sự kiện</Label>
                            <Input
                                id="event-title"
                                placeholder="Nhập tiêu đề sự kiện"
                                value={newEvent.title}
                                onChange={(e) =>
                                    setNewEvent({ ...newEvent, title: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Ca làm việc</Label>
                            <Select
                                value={newEvent.shift.toString()}
                                onValueChange={(value) =>
                                    setNewEvent({ ...newEvent, shift: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn ca làm việc" />
                                </SelectTrigger>
                                <SelectContent>
                                    {shifts.map((shift) => (
                                        <SelectItem key={shift.id} value={shift.id.toString()}>
                                            {shift.name} ({shift.timeRange})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Màu sắc</Label>
                            <RadioGroup
                                value={newEvent.color}
                                onValueChange={(value) =>
                                    setNewEvent({ ...newEvent, color: value })
                                }
                                className="flex flex-wrap gap-2"
                            >
                                {colorOptions.map((color) => (
                                    <div key={color.value} className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value={color.value}
                                            id={color.value}
                                            className="sr-only"
                                        />
                                        <Label
                                            htmlFor={color.value}
                                            className={cn(
                                                'h-8 w-8 rounded-full cursor-pointer flex items-center justify-center border-2 border-transparent',
                                                newEvent.color === color.value && 'border-primary',
                                            )}
                                        >
                                            <div
                                                className={cn('h-6 w-6 rounded-full', color.value)}
                                            ></div>
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                        <div className="grid gap-2">
                            <Label>Ngày</Label>
                            <div className="p-2 rounded-md bg-muted">
                                {selectedDate && formatDateVN(selectedDate)}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleAddEvent}>Thêm sự kiện</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
