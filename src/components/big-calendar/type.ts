// Event interface
export interface Event {
    id: string;
    title: string;
    date: Date;
    color: string;
    status: number;
    shift?: number; // 1, 2, or 3
}

// Shift interface
export interface Shift {
    id: number;
    name: string;
    timeRange: string;
    startHour: number;
    endHour: number;
}
