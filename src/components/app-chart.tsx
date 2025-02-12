'use client';

import { Bar, BarChart } from 'recharts';

import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { chartData } from '@/utils/constants/dummy-data.constant';

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: 'red',
    },
    mobile: {
        label: 'Mobile',
        color: 'orange',
    },
} satisfies ChartConfig;

export function AppChart() {
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}
