import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CartesianGrid, Line, LineChart, Tooltip as ChartTooltip, XAxis } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import dayjs from 'dayjs';
import { getChickenBatchChart } from '@/services/chicken-batch.service';
import { TrendingUpIcon } from 'lucide-react';

const chartConfig = {
    totalFeed: { label: 'Lượng cho ăn', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

interface ChartProps {
    chickenBatchId: string;
}

export function Chart({ chickenBatchId }: ChartProps) {
    const { data: chartData, isLoading } = useQuery({
        queryKey: ['chicken-batch-chart', chickenBatchId],
        queryFn: () => getChickenBatchChart(chickenBatchId),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Biểu đồ tiêu thụ thức ăn</CardTitle>
                <CardDescription>Biểu đồ thể hiện mức độ tiêu thụ của lứa nuôi</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[300px] space-y-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
                    </div>
                ) : chartData === undefined || chartData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] space-y-4 bg-muted/20 rounded-lg">
                        <div className="rounded-full bg-muted p-4">
                            <TrendingUpIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium">Không có dữ liệu biểu đồ</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Chưa có dữ liệu tiêu thụ thức ăn này
                            </p>
                        </div>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            accessibilityLayer
                            data={chartData.map((chart) => ({
                                ...chart,
                                date: dayjs(chart.date).format('DD/MM/YYYY'),
                            }))}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => dayjs(value).format('M/D')}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Line
                                dataKey="totalFeed"
                                type="monotone"
                                stroke="hsl(var(--chart-1))"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}

// export function Chart({ chickenBatchId }: ChartProps) {
//     const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

//     const { data: chartData, isLoading } = useQuery({
//         queryKey: ['chicken-batch-chart', chickenBatchId, timeRange],
//         queryFn: () => getChickenBatchChart(chickenBatchId),
//         staleTime: 5 * 60 * 1000, // 5 minutes
//     });

//     // Calculate summary metrics if data is available
//     const summaryMetrics =
//         chartData && chartData.length > 0
//             ? {
//                   total: chartData.reduce((sum, item) => sum + item.totalFeed, 0),
//                   average:
//                       chartData.reduce((sum, item) => sum + item.totalFeed, 0) / chartData.length,
//                   trend:
//                       chartData[chartData.length - 1].totalFeed > chartData[0].totalFeed
//                           ? 'up'
//                           : 'down',
//                   percentChange:
//                       chartData.length > 1
//                           ? Math.abs(
//                                 ((chartData[chartData.length - 1].totalFeed -
//                                     chartData[0].totalFeed) /
//                                     chartData[0].totalFeed) *
//                                     100,
//                             ).toFixed(1)
//                           : '0',
//               }
//             : null;

//     return (
//         <Card className="overflow-hidden">
//             <CardHeader className="pb-2">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//                     <div>
//                         <CardTitle>Biểu đồ tiêu thụ thức ăn</CardTitle>
//                         <CardDescription>
//                             Biểu đồ thể hiện mức độ tiêu thụ theo thời gian
//                         </CardDescription>
//                     </div>
//                     <Tabs
//                         defaultValue={timeRange}
//                         className="w-full sm:w-auto"
//                         onValueChange={(value) => setTimeRange(value as any)}
//                     >
//                         <TabsList className="grid grid-cols-3 w-full sm:w-auto">
//                             <TabsTrigger value="week">Tuần</TabsTrigger>
//                             <TabsTrigger value="month">Tháng</TabsTrigger>
//                             <TabsTrigger value="year">Năm</TabsTrigger>
//                         </TabsList>
//                     </Tabs>
//                 </div>
//             </CardHeader>

//             {summaryMetrics && !isLoading && chartData && chartData.length > 0 && (
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 py-2 bg-muted/30">
//                     <div className="flex flex-col">
//                         <span className="text-sm text-muted-foreground">Tổng lượng thức ăn</span>
//                         <span className="text-2xl font-bold">
//                             {summaryMetrics.total.toLocaleString()} kg
//                         </span>
//                     </div>
//                     <div className="flex flex-col">
//                         <span className="text-sm text-muted-foreground">Trung bình mỗi ngày</span>
//                         <span className="text-2xl font-bold">
//                             {summaryMetrics.average.toFixed(1)} kg
//                         </span>
//                     </div>
//                     <div className="flex flex-col">
//                         <div className="flex items-center gap-1">
//                             <span className="text-sm text-muted-foreground">Xu hướng</span>
//                             {summaryMetrics.trend === 'up' ? (
//                                 <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
//                             ) : (
//                                 <ArrowDownIcon className="h-4 w-4 text-rose-500" />
//                             )}
//                         </div>
//                         <span className="text-2xl font-bold flex items-center">
//                             {summaryMetrics.percentChange}%
//                             <span
//                                 className={`text-xs ml-1 ${summaryMetrics.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}
//                             >
//                                 {summaryMetrics.trend === 'up' ? 'tăng' : 'giảm'}
//                             </span>
//                         </span>
//                     </div>
//                 </div>
//             )}

//             <CardContent className="pt-6">
//                 {isLoading ? (
//                     <div className="flex flex-col items-center justify-center h-[300px] space-y-3">
//                         <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
//                         <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
//                     </div>
//                 ) : chartData === undefined || chartData.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center h-[300px] space-y-4 bg-muted/20 rounded-lg">
//                         <div className="rounded-full bg-muted p-4">
//                             <TrendingUpIcon className="h-8 w-8 text-muted-foreground" />
//                         </div>
//                         <div className="text-center">
//                             <p className="text-lg font-medium">Không có dữ liệu biểu đồ</p>
//                             <p className="text-sm text-muted-foreground mt-1">
//                                 Chưa có dữ liệu tiêu thụ thức ăn cho giai đoạn này
//                             </p>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="h-[300px] w-full">
//                         <ChartContainer config={chartConfig}>
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <AreaChart
//                                     data={chartData.map((chart) => ({
//                                         ...chart,
//                                         date: dayjs(chart.date).format('DD/MM/YYYY'),
//                                     }))}
//                                     margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
//                                 >
//                                     <defs>
//                                         <linearGradient
//                                             id="totalFeedGradient"
//                                             x1="0"
//                                             y1="0"
//                                             x2="0"
//                                             y2="1"
//                                         >
//                                             <stop
//                                                 offset="5%"
//                                                 stopColor="hsl(var(--chart-1))"
//                                                 stopOpacity={0.3}
//                                             />
//                                             <stop
//                                                 offset="95%"
//                                                 stopColor="hsl(var(--chart-1))"
//                                                 stopOpacity={0}
//                                             />
//                                         </linearGradient>
//                                     </defs>
//                                     <CartesianGrid
//                                         strokeDasharray="3 3"
//                                         vertical={false}
//                                         stroke="hsl(var(--muted))"
//                                     />
//                                     <XAxis
//                                         dataKey="date"
//                                         tickLine={false}
//                                         axisLine={false}
//                                         tickMargin={8}
//                                         tick={{ fontSize: 12 }}
//                                         tickFormatter={(value) => {
//                                             const date = dayjs(value, 'DD/MM/YYYY');
//                                             return timeRange === 'week'
//                                                 ? date.format('ddd')
//                                                 : timeRange === 'month'
//                                                   ? date.format('D/M')
//                                                   : date.format('D/M');
//                                         }}
//                                     />
//                                     <YAxis
//                                         tickLine={false}
//                                         axisLine={false}
//                                         tickMargin={8}
//                                         tick={{ fontSize: 12 }}
//                                         tickFormatter={(value) => `${value}kg`}
//                                     />
//                                     <ChartTooltip
//                                         cursor={{ stroke: 'hsl(var(--muted))' }}
//                                         content={<ChartTooltipContent indicator="line" />}
//                                     />
//                                     <Area
//                                         type="monotone"
//                                         dataKey="totalFeed"
//                                         stroke="hsl(var(--chart-1))"
//                                         strokeWidth={2}
//                                         fillOpacity={1}
//                                         fill="url(#totalFeedGradient)"
//                                         activeDot={{ r: 6, strokeWidth: 2, stroke: 'white' }}
//                                         animationDuration={1000}
//                                     />
//                                 </AreaChart>
//                             </ResponsiveContainer>
//                         </ChartContainer>
//                     </div>
//                 )}
//             </CardContent>

//             {!isLoading && chartData && chartData.length > 0 && (
//                 <CardFooter className="flex justify-between border-t px-6 py-4">
//                     <div className="flex items-center text-sm text-muted-foreground">
//                         <CalendarIcon className="mr-1 h-4 w-4" />
//                         <span>
//                             {timeRange === 'week'
//                                 ? '7 ngày qua'
//                                 : timeRange === 'month'
//                                   ? '30 ngày qua'
//                                   : '12 tháng qua'}
//                         </span>
//                     </div>
//                     <Button variant="outline" size="sm" className="gap-1">
//                         <DownloadIcon className="h-4 w-4" />
//                         <span>Xuất dữ liệu</span>
//                     </Button>
//                 </CardFooter>
//             )}
//         </Card>
//     );
// }
