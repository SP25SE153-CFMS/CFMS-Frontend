import initials from 'initials';

import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppChart } from '@/components/app-chart';
import { salesData } from '@/utils/data/dashboard.data';

export default function Dashboard() {
    return (
        <div className="flex-col md:flex">
            <div className="flex-1 space-y-4">
                <div className="flex-col items-center justify-between space-y-2 md:flex md:flex-row">
                    <h2 className="text-3xl font-bold tracking-tight">Trang chủ</h2>
                    <div className="flex-col items-center space-y-2 md:flex md:flex-row md:space-x-2 md:space-y-0">
                        <Button className="w-full text-primary-text">Tải xuống</Button>
                    </div>
                </div>
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analytics" disabled>
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="reports" disabled>
                            Reports
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Tổng số lượng gà
                                    </CardTitle>
                                    <DollarSign className="size-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$45,231.89</div>
                                    <p className="text-xs text-muted-foreground">
                                        +20.1% from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Gà chết/loại bỏ
                                    </CardTitle>
                                    <Users className="size-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+2350</div>
                                    <p className="text-xs text-muted-foreground">
                                        +180.1% from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Trứng thu hoạch
                                    </CardTitle>
                                    <CreditCard className="size-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+12,234</div>
                                    <p className="text-xs text-muted-foreground">
                                        +19% from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Số lượng nhân viên
                                    </CardTitle>
                                    <Activity className="size-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+573</div>
                                    <p className="text-xs text-muted-foreground">
                                        +201 since last hour
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-2 lg:col-span-4">
                                <CardHeader>
                                    <CardTitle>Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <AppChart />
                                </CardContent>
                            </Card>
                            <Card className="col-span-2 lg:col-span-3">
                                <CardHeader>
                                    <CardTitle>Danh sách đàn gà</CardTitle>
                                    <CardDescription>Hiện có tổng cộng 365 đàn gà</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8">
                                        {salesData.map((sale) => (
                                            <div key={sale.name} className="flex items-center">
                                                <Avatar className="size-9">
                                                    <AvatarFallback>
                                                        {initials(sale.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">
                                                        {sale.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground md:text-sm">
                                                        Số lượng: {sale.amount}
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-medium">
                                                    {sale.price}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
