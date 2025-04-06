// Event interface
export interface Event {
    id: string;
    title: string;
    date: Date;
    color: string;
    status: number;
    shift?: string;
}

// Shift interface
export interface ShiftEvent {
    id: string;
    name: string;
    timeRange: string;
    startHour: number;
    endHour: number;
}
