'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/configs';
import { scaleLabels } from '@/utils/enum/status.enum';
import type { Farm } from '@/utils/schemas/farm.schema';
import { setCookie } from 'cookies-next';
import { Download, Ruler, Scale3d, Smartphone } from 'lucide-react';
import Image from '@/components/fallback-image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import Link from 'next/link';
import { FarmResponse } from '@/utils/types/custom.type';
import { FarmRole, farmRoleConfigs } from '@/utils/enum';

export function FarmCard({ farm }: { farm: FarmResponse }) {
    const router = useRouter();
    const [showMobileDialog, setShowMobileDialog] = useState(false);

    // Get role config or default to employee if role is undefined
    const role = farm.farmRole !== undefined ? farm.farmRole : FarmRole.STAFF;
    const {
        label,
        color,
        border,
        icon: RoleIcon,
    } = farmRoleConfigs[role] || farmRoleConfigs[FarmRole.STAFF];

    const handleCardClick = () => {
        // If employee that should use mobile app, show dialog instead of navigating
        if (role === FarmRole.STAFF) {
            setShowMobileDialog(true);
            return;
        }

        sessionStorage.setItem('activeFarm', JSON.stringify(farm));
        setCookie(config.cookies.farmId, farm.farmId);
        if (role === FarmRole.OWNER) {
            router.push(`${config.routes.farmOwner.dashboard}?farmCode=${farm.farmCode}`);
        } else if (role === FarmRole.MANAGER) {
            router.push(`${config.routes.welcome}?farmCode=${farm.farmCode}`);
        }
    };

    return (
        <>
            <div onClick={handleCardClick} className="cursor-pointer">
                <Card
                    className={`hover:shadow-lg transition-shadow duration-300 relative overflow-hidden border-t-4 ${border}`}
                >
                    {/* Role indicator ribbon in the top-right corner */}
                    {/* <div className={`absolute top-0 right-0 w-24 h-24 overflow-hidden`}>
                    <div
                        className={`${color} absolute transform rotate-45 text-xs font-semibold py-1 text-center shadow-sm w-32 top-5 right-[-32px]`}
                    >
                        {label}
                    </div>
                </div> */}

                    <CardHeader>
                        <div className="flex items-center justify-between relative">
                            <div className="flex flex-col gap-2">
                                <CardTitle className="flex items-center">{farm.farmName}</CardTitle>
                                <Badge
                                    variant="outline"
                                    className={`${color} flex items-center gap-2 w-fit`}
                                >
                                    <RoleIcon className="h-3 w-3" />
                                    <span>{label}</span>
                                </Badge>
                            </div>
                            <Image
                                src={farm.imageUrl || '/assets/logo/logo.png'}
                                alt={farm.farmCode}
                                width={50}
                                height={50}
                                className="rounded-md object-cover absolute right-0 mt-0"
                                preview
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground mb-2">
                            Mã: {farm.farmCode}
                        </div>
                        <div className="flex items-center mb-1">
                            <Ruler className="mr-2 h-4 w-4" />
                            <span className="truncate font-medium">Diện tích: {farm.area} ha</span>
                        </div>
                        <div className="flex items-center mb-1">
                            <Scale3d className="mr-2 h-4 w-4" />
                            <span className="truncate font-medium">
                                Quy mô: {scaleLabels[farm.scale]}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Mobile App Dialog */}
            <MobileAppDialog
                farm={farm}
                open={showMobileDialog}
                onClose={() => setShowMobileDialog(false)}
            />
        </>
    );
}

// QR Code Dialog Component
function MobileAppDialog({
    farm,
    open,
    onClose,
}: {
    farm: Farm;
    open: boolean;
    onClose: () => void;
}) {
    // In a real app, you would generate this URL dynamically based on the farm
    const url = `https://yourfarmapp.com/download?farmCode=${farm.farmCode}`;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Smartphone className="h-5 w-5 text-primary/50" />
                        Tải ứng dụng di động
                    </DialogTitle>
                    <DialogDescription>
                        Để truy cập trang trại{' '}
                        <span className="font-medium text-primary/60">{farm.farmName}</span>, bạn
                        cần sử dụng ứng dụng di động dành cho nhân viên.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center p-4">
                    <Link
                        href={url}
                        className="bg-white p-4 rounded-lg shadow-md mb-4 hover:shadow-xl transition-shadow duration-300"
                    >
                        <QRCode value={url} className="h-48 w-48 text-primary/80" />
                    </Link>

                    {/* <p className="text-center text-sm text-gray-500 mb-4">
                        Quét mã QR hoặc nhấn vào nút bên dưới để tải ứng dụng
                    </p> */}

                    <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                        <Button className="flex-1 bg-primary/80 hover:bg-primary">
                            <Download className="mr-2 h-4 w-4" />
                            Tải cho Android
                        </Button>
                        {/* <Button className="flex-1 bg-primary/60 hover:bg-primary/70">
                            <Download className="mr-2 h-4 w-4" />
                            Tải cho iOS
                        </Button> */}
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm font-medium">Mã trang trại của bạn</p>
                        <p className="text-lg font-bold text-primary/70">{farm.farmCode}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {/* Bạn sẽ cần mã này khi đăng nhập vào ứng dụng */}
                            Quét mã QR hoặc nhấn vào nút bên trên để tải ứng dụng
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
