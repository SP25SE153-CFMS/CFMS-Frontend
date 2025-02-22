import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tractor, MapPin, Phone, Globe, TreePine, Ruler, Scale3d } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import config from '@/configs';

interface Farm {
    farmId: string;
    farmName: string;
    farmCode: string;
    type: string;
    address: string;
    area: number;
    scale: string;
    phoneNumber: string;
    website: string;
    farmImage: string;
}

export default function TrangTraiList() {
    const farms: Farm[] = [
        {
            farmId: '1',
            farmName: 'Trang trại Xanh',
            farmCode: 'TT001',
            type: 'Hữu cơ',
            address: 'Hà Nội',
            area: 100,
            scale: 'Vừa',
            phoneNumber: '0123456789',
            website: 'https://trangtraixanh.com',
            farmImage:
                'https://www.hcmtoplist.com/wp-content/uploads/2022/05/trang-trai-ga-ta-giong-vuon-nha-tui-hcmtoplist.jpg',
        },
        {
            farmId: '1',
            farmName: 'Trang trại Xanh',
            farmCode: 'TT001',
            type: 'Hữu cơ',
            address: 'Hà Nội',
            area: 100,
            scale: 'Vừa',
            phoneNumber: '0123456789',
            website: 'https://trangtraixanh.com',
            farmImage:
                'https://www.hcmtoplist.com/wp-content/uploads/2022/05/trang-trai-ga-ta-giong-vuon-nha-tui-hcmtoplist.jpg',
        },
        {
            farmId: '1',
            farmName: 'Trang trại Xanh',
            farmCode: 'TT001',
            type: 'Hữu cơ',
            address: 'Hà Nội',
            area: 100,
            scale: 'Vừa',
            phoneNumber: '0123456789',
            website: 'https://trangtraixanh.com',
            farmImage:
                'https://www.hcmtoplist.com/wp-content/uploads/2022/05/trang-trai-ga-ta-giong-vuon-nha-tui-hcmtoplist.jpg',
        },
    ];

    if (farms.length === 0) {
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
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <Tractor className="mr-2" />
                Danh sách Trang trại
            </h1>
            <ScrollArea className="h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {farms.map((farm) => (
                        <Link
                            href={farm.website}
                            key={farm.farmId}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center">
                                            {farm.farmName}
                                        </CardTitle>
                                        <Image
                                            src={farm.farmImage || '/placeholder.svg'}
                                            alt={farm.farmName}
                                            width={50}
                                            height={50}
                                            className="rounded-full"
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Mã: {farm.farmCode}
                                    </p>
                                    <p className="flex items-center mb-1">
                                        <TreePine className="mr-2 h-4 w-4" /> {farm.type}
                                    </p>
                                    <p className="flex items-center mb-1">
                                        <MapPin className="mr-2 h-4 w-4" /> {farm.address}
                                    </p>
                                    <p className="flex items-center mb-1">
                                        <Ruler className="mr-2 h-4 w-4" /> Diện tích: {farm.area} ha
                                    </p>
                                    <p className="flex items-center mb-1">
                                        <Scale3d className="mr-2 h-4 w-4" />
                                        Quy mô: {farm.scale}
                                    </p>
                                    <p className="flex items-center mb-1">
                                        <Phone className="mr-2 h-4 w-4" /> {farm.phoneNumber}
                                    </p>
                                    <p className="flex items-center">
                                        <Globe className="mr-2 h-4 w-4" /> {farm.website}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
