'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tractor,
    Plus,
    Search,
    Filter,
    X,
    KeyRound,
    TractorIcon,
    Loader2,
    Send,
    TrendingUp,
    MapPin,
    Sprout,
    BarChart,
    Phone,
    Globe,
} from 'lucide-react';
import Image from '@/components/fallback-image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import config from '@/configs';
import { useMutation, useQuery } from '@tanstack/react-query';
import { enrollToFarm, getFarms, getFarmsForCurrentUser } from '@/services/farm.service';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { scaleLabels } from '@/utils/enum/status.enum';
import { FarmCard } from './card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import toast from 'react-hot-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogTrigger,
} from '@/components/ui/dialog';
import { FarmRole, farmRoleConfigs } from '@/utils/enum';
import InfoItem from '@/components/info-item';
import { Drawer, DrawerContent } from '@/components/ui/drawer';

// Dynamically import the map component with no SSR
const FarmMapWithNoSSR = dynamic(() => import('@/components/map/farm-map'), { ssr: false });

export default function Page() {
    // userFarms: Farms for the current user
    const { data: userFarms, isLoading } = useQuery({
        queryKey: ['farms'],
        queryFn: async () => {
            const farms = await getFarmsForCurrentUser();
            sessionStorage.setItem('farms', JSON.stringify(farms));
            return farms;
        },
    });

    // farmsForSearch: All farms for searching
    const { data: farmsForSearch } = useQuery({
        queryKey: ['allFarms'],
        queryFn: getFarms,
    });

    // Farm code for employee to join
    const [farmCode, setFarmCode] = useState('');
    const [openDrawer, setOpenDrawer] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedScale, setSelectedScale] = useState<number>(-1);
    const [areaRange, setAreaRange] = useState<[number, number]>([0, 10000]);
    const [selectedFarmRole, setSelectedFarmRole] = useState<number>(-1);
    const [showFilters, setShowFilters] = useState(true);

    const farmScales = useMemo(() => {
        if (!userFarms) return [];
        const uniqueScales = Array.from(new Set(userFarms.map((farm) => farm.scale)));
        // Sort scales according to the Scale enum order (SMALL, MEDIUM, LARGE)
        return uniqueScales.sort((a, b) => a - b);
    }, [userFarms]);

    const farmRoles = useMemo(() => {
        if (!userFarms) return [];
        const uniqueRoles = Array.from(new Set(userFarms.map((farm) => farm.farmRole)));
        return uniqueRoles.sort((a, b) => a - b);
    }, [userFarms]);

    // Get max area for slider
    const maxArea = useMemo(() => {
        if (!userFarms) return 100;
        const max = Math.max(...userFarms.map((farm) => farm.area || 0));
        return max > 0 ? max : 100;
    }, [userFarms]);

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedScale(-1);
        setAreaRange([0, maxArea]);
    };

    // Apply filters to farms
    const filteredFarms = useMemo(() => {
        if (!userFarms) return [];

        return userFarms.filter((farm) => {
            // Search term filter (farm name or farm code)
            const matchesSearch =
                searchTerm === '' ||
                farm.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                farm.farmCode.toLowerCase().includes(searchTerm.toLowerCase());

            // Scale filter - show all farms when selectedScale is 0 (all)
            const matchesScale = selectedScale === -1 || farm.scale === selectedScale;

            // Area range filter
            const matchesArea = farm.area >= areaRange[0] && farm.area <= areaRange[1];

            // Farm role filter
            const matchesFarmRole = selectedFarmRole === -1 || farm.farmRole === selectedFarmRole;

            return matchesSearch && matchesScale && matchesArea && matchesFarmRole;
        });
    }, [userFarms, searchTerm, selectedScale, areaRange, selectedFarmRole]);

    // Active filter count - don't count scale if it's set to 'all' (0)
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (searchTerm) count++;
        if (selectedScale > -1) count++;
        if (areaRange[0] > 0 || areaRange[1] < maxArea) count++;
        if (selectedFarmRole !== -1) count++;
        return count;
    }, [searchTerm, selectedScale, areaRange, maxArea, selectedFarmRole]);

    const farmByFarmCode = useMemo(() => {
        if (!farmsForSearch) return null;
        return farmsForSearch.find((farm) => farm.farmCode === farmCode);
    }, [farmsForSearch, farmCode]);

    const enrollMutation = useMutation({
        mutationFn: enrollToFarm,
        onSuccess: (response) => {
            toast.success(response.message);
            // Optionally, you can refresh the farm list or redirect the user
            // window.location.reload();
        },
        onError: (error: any) => {
            console.error(error);
            toast(error?.response?.data?.message, { icon: '⚠️' });
        },
    });

    const handleJoinFarm = async () => {
        if (!farmCode) {
            toast('Vui lòng nhập mã code trang trại', { icon: '⚠️' });
            return;
        }
        await enrollMutation.mutateAsync(farmCode);
        setFarmCode('');
    };

    // Check if farms is loading
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[100vh] gap-4">
                <LoadingSpinner />
                <p className="text-muted-foreground animate-pulse">
                    Đang tải dữ liệu trang trại...
                </p>
            </div>
        );
    }

    if (!userFarms) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <Image
                    src="/no-data.jpg"
                    alt="Không có trang trại"
                    width={400}
                    height={400}
                    className="mb-4"
                />
                <Card className="w-[300px]">
                    <CardHeader>
                        <CardTitle className="text-center">Không có trang trại</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground">
                            Hiện tại chưa có trang trại nào được đăng ký.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Link href={config.routes.farmRegister}>
                            <Button>Đăng ký trang trại mới</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col space-y-4">
                <div className="flex justify-center md:justify-between items-center flex-wrap md:flex-nowrap gap-6">
                    <h1 className="text-3xl font-bold flex items-center">
                        <Tractor className="mr-2" />
                        Danh sách Trang trại
                    </h1>

                    <div className="flex space-x-4">
                        {/* Dialog for joining a farm */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="flex items-center">
                                    <KeyRound size={18} />
                                    Tham gia trang trại
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                                        aria-hidden="true"
                                    >
                                        <KeyRound className="opacity-80 text-primary" size={16} />
                                    </div>
                                    <DialogHeader>
                                        <DialogTitle className="sm:text-center">
                                            Yêu cầu tham gia trang trại
                                        </DialogTitle>
                                        <DialogDescription className="sm:text-center">
                                            Hãy nhập mã trang trại để gửi yêu cầu tham gia làm nhân
                                            viên trang trại.
                                        </DialogDescription>
                                    </DialogHeader>
                                </div>

                                <form className="space-y-5">
                                    <div className="*:not-first:mt-2">
                                        <Label>Mã code trang trại</Label>
                                        <Input
                                            placeholder="Nhập mã code trang trại"
                                            value={farmCode}
                                            onChange={(e) => setFarmCode(e.target.value)}
                                            className="border-primary/20 focus-visible:ring-primary/50"
                                        />
                                        {farmCode !== '' && (
                                            <div
                                                className="flex items-center gap-2 p-2 rounded-lg border-2 border-dashed border-muted-foreground/50 hover:border-primary mt-2 cursor-pointer"
                                                onClick={() => setOpenDrawer(true)}
                                            >
                                                <div className="flex size-8 items-center justify-center rounded-sm border">
                                                    <Image
                                                        src={farmByFarmCode?.imageUrl || ''}
                                                        alt={farmByFarmCode?.farmCode || ''}
                                                        width={20}
                                                        height={20}
                                                    />
                                                </div>
                                                <div className="gap-1 flex-1">
                                                    <p className="font-semibold text-sm">
                                                        {farmByFarmCode?.farmName ||
                                                            'Không tìm thấy trang trại'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {farmByFarmCode?.farmCode || 'Không có mã '}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                <X className="w-4 h-4" />
                                                Hủy
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            type="button"
                                            className="flex-1"
                                            onClick={handleJoinFarm}
                                            disabled={enrollMutation.isPending || !farmCode}
                                        >
                                            {enrollMutation.isPending ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4" />
                                            )}
                                            Gửi yêu cầu
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="relative"
                        >
                            <Filter size={18} className="mr-2" />
                            <span>Bộ lọc</span>
                            {activeFilterCount > 0 && (
                                <Badge
                                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                                    variant="destructive"
                                >
                                    {activeFilterCount}
                                </Badge>
                            )}
                        </Button>

                        <Link href={config.routes.farmRegister}>
                            <Button>
                                <span>Thêm trang trại</span> <Plus size={18} className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filter Section */}
                {showFilters && (
                    <Card className="mb-4">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">Lọc trang trại</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetFilters}
                                    className="h-8 px-2 text-xs"
                                >
                                    <X size={14} className="mr-1" /> Xóa bộ lọc
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                                {/* Search by name or code */}
                                <div className="space-y-2">
                                    <Label htmlFor="search">Tìm kiếm</Label>
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="search"
                                            placeholder="Tên hoặc mã trang trại"
                                            className="pl-8"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Filter by scale */}
                                <div className="space-y-2">
                                    <Label htmlFor="scale">Quy mô</Label>
                                    <Select
                                        value={selectedScale.toString()}
                                        onValueChange={(value) => setSelectedScale(Number(value))}
                                    >
                                        <SelectTrigger id="scale">
                                            <SelectValue placeholder="Tất cả quy mô" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="-1">Tất cả quy mô</SelectItem>
                                            {farmScales.map((scale) => (
                                                <SelectItem key={scale} value={scale.toString()}>
                                                    {scaleLabels[scale]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Filter by farmRole */}
                                <div className="space-y-2">
                                    <Label htmlFor="farmRole">Vai trò</Label>
                                    <Select
                                        value={selectedFarmRole?.toString() || '-1'}
                                        onValueChange={(value) =>
                                            setSelectedFarmRole(Number(value))
                                        }
                                    >
                                        <SelectTrigger id="farmRole">
                                            <SelectValue placeholder="Tất cả vai trò" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="-1">Tất cả vai trò</SelectItem>
                                            {farmRoles?.map((role) => {
                                                const {
                                                    label,
                                                    color,
                                                    icon: RoleIcon,
                                                } = farmRoleConfigs[role] ||
                                                farmRoleConfigs[FarmRole.STAFF];

                                                return (
                                                    <SelectItem key={role} value={role?.toString()}>
                                                        <Badge
                                                            variant="outline"
                                                            className={`${color} flex items-center gap-2 w-fit`}
                                                        >
                                                            <RoleIcon className="h-3 w-3" />
                                                            <span>{label}</span>
                                                        </Badge>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Filter by area range */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label htmlFor="area">Diện tích (ha)</Label>
                                        <span className="text-xs text-muted-foreground">
                                            {areaRange[0]} - {areaRange[1]} ha
                                        </span>
                                    </div>
                                    <Slider
                                        id="area"
                                        min={0}
                                        max={maxArea}
                                        step={1}
                                        value={areaRange}
                                        onValueChange={(value) =>
                                            setAreaRange(value as [number, number])
                                        }
                                        className="py-4"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Results count */}
                <div className="text-sm text-muted-foreground mb-2">
                    Hiển thị {filteredFarms.length} / {userFarms.length} trang trại
                </div>

                {/* Farm cards */}
                {userFarms.length > 0 && (
                    <ScrollArea>
                        {filteredFarms.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <p className="text-muted-foreground mb-4">
                                    Không tìm thấy trang trại phù hợp với bộ lọc
                                </p>
                                <Button variant="outline" onClick={resetFilters}>
                                    Xóa bộ lọc
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                                <div className="md:col-span-2 h-full">
                                    <FarmMapWithNoSSR farms={filteredFarms} />
                                </div>

                                <ScrollArea className="h-[30rem]">
                                    <div className="px-4 overflow-auto h-full border-l border-red-500">
                                        <div className="space-y-2">
                                            {filteredFarms.map((farm) => (
                                                <FarmCard farm={farm} key={farm.farmId} />
                                            ))}
                                        </div>
                                    </div>
                                </ScrollArea>
                            </div>
                        )}
                    </ScrollArea>
                )}

                {userFarms.length === 0 && (
                    <div className="w-full max-w-3xl mx-auto p-4">
                        <Card className="border-2 border-primary/10 bg-primary/5 shadow-md">
                            <CardContent className="pt-6">
                                <Alert className="border-primary/20">
                                    <TractorIcon className="h-5 w-5 text-primary/600" />
                                    <AlertTitle className="text-primary/80 text-lg font-medium mb-2">
                                        Không có trang trại
                                    </AlertTitle>
                                    <AlertDescription className="text-primary/70 space-y-2">
                                        <p className="font-medium">
                                            Danh sách trang trại đang rỗng
                                        </p>
                                        <div className="pl-2 border-l-2 border-primary/20 space-y-2">
                                            <p>
                                                • Hãy tạo trang trại ngay để bắt đầu quản lý trang
                                                trại của bạn
                                            </p>
                                            <p>
                                                • Hoặc bạn có thể nhập mã code để yêu cầu tham gia
                                                làm nhân viên của trang trại
                                            </p>
                                        </div>
                                    </AlertDescription>
                                </Alert>

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <KeyRound className="h-5 w-5 text-primary/60" />
                                        <h3 className="text-primary/80 font-medium">
                                            Nhập mã tham gia trang trại
                                        </h3>
                                    </div>

                                    <div className="flex gap-3">
                                        <Input
                                            placeholder="Nhập mã code trang trại"
                                            value={farmCode}
                                            onChange={(e) => setFarmCode(e.target.value)}
                                            className="border-primary/20 focus-visible:ring-primary/50"
                                        />
                                        <Button
                                            onClick={handleJoinFarm}
                                            className="bg-primary/60 hover:bg-primary/70 text-white"
                                            disabled={enrollMutation.isPending || !farmCode}
                                        >
                                            {enrollMutation.isPending && (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            )}
                                            Tham gia
                                        </Button>
                                    </div>

                                    {farmCode !== '' && (
                                        <div
                                            className="flex items-center gap-2 p-2 rounded-lg border-2 border-dashed border-muted-foreground/50 hover:border-primary mt-2 cursor-pointer"
                                            onClick={() => setOpenDrawer(true)}
                                        >
                                            <div className="flex size-8 items-center justify-center rounded-sm border">
                                                <Image
                                                    src={farmByFarmCode?.imageUrl || ''}
                                                    alt={farmByFarmCode?.farmCode || ''}
                                                    width={20}
                                                    height={20}
                                                />
                                            </div>
                                            <div className="gap-1 flex-1">
                                                <p className="font-semibold text-sm">
                                                    {farmByFarmCode?.farmName ||
                                                        'Không tìm thấy trang trại'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {farmByFarmCode?.farmCode || 'Không có mã '}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            <Drawer direction="right" open={openDrawer} onOpenChange={setOpenDrawer}>
                <DrawerContent className="right-0 left-auto ml-auto top-0 mt-0 !w-[400px]">
                    <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                Thông tin chi tiết
                            </h3>
                        </div>
                        <InfoItem
                            label="Tên trang trại"
                            value={farmByFarmCode?.farmName || '-'}
                            icon={<TrendingUp size={16} />}
                        />

                        <InfoItem
                            label="Mã trang trại"
                            value={farmByFarmCode?.farmCode || '-'}
                            icon={<KeyRound size={16} />}
                        />

                        <InfoItem
                            label="Địa chỉ"
                            value={farmByFarmCode?.address || 'Không có địa chỉ'}
                            icon={<MapPin size={16} />}
                        />

                        <InfoItem
                            label="Diện tích"
                            value={`${farmByFarmCode?.area?.toLocaleString()} m²`}
                            icon={<Sprout size={16} />}
                        />

                        <InfoItem
                            label="Quy mô"
                            value={
                                farmByFarmCode?.scale
                                    ? `${farmByFarmCode.scale} (quy mô)`
                                    : 'Không xác định'
                            }
                            icon={<BarChart size={16} />}
                        />

                        <InfoItem
                            label="Số điện thoại"
                            value={farmByFarmCode?.phoneNumber || 'Không có số điện thoại'}
                            icon={<Phone size={16} />}
                        />

                        <InfoItem
                            label="Website"
                            value={
                                farmByFarmCode?.website ? (
                                    <a
                                        href={farmByFarmCode.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        {farmByFarmCode.website}
                                    </a>
                                ) : (
                                    'Không có website'
                                )
                            }
                            icon={<Globe size={16} />}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
