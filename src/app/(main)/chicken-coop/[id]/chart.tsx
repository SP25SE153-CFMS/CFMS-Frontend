'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
const chartData = [
    { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
    { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
    { browser: 'firefox', visitors: 287, fill: 'var(--color-firefox)' },
    { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
    { browser: 'other', visitors: 190, fill: 'var(--color-other)' },
];

const chartConfig = {
    visitors: {
        label: 'Visitors',
    },
    chrome: {
        label: 'Đồ ăn',
        color: 'hsl(var(--chart-1))',
    },
    safari: {
        label: 'Thuốc',
        color: 'hsl(var(--chart-2))',
    },
    firefox: {
        label: 'Gà',
        color: 'hsl(var(--chart-3))',
    },
    edge: {
        label: 'Thiết bị',
        color: 'hsl(var(--chart-4))',
    },
    other: {
        label: 'Khác',
        color: 'hsl(var(--chart-5))',
    },
} satisfies ChartConfig;

const data = [
    { label: 'DOANH THU', value: '22.500.000đ' },
    { label: 'CHÍ PHÍ', value: '18.000.000đ' },
    { label: 'LỢI NHUẬN', value: '4.500.000đ' },
];

export function Chart() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Biểu đồ phân bố chi phí</CardTitle>
                <CardDescription>Tháng Một - Tháng Sáu 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={chartData}
                            dataKey="visitors"
                            nameKey="browser"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-sm font-bold"
                                                >
                                                    {data[0].value}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    VNĐ
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="browser" />}
                            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center text-xs"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                {data.map((item, index) => (
                    <div key={index} className="flex flex-1 flex-col p-2 border gap-2">
                        <h4 className="text-xs uppercase font-semibold">{item.label}</h4>
                        <p className="text-xs text-muted-foreground">{item.value}</p>
                    </div>
                ))}
            </CardFooter>
        </Card>
    );
}
