import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import config from '@/configs';
import { scaleLabels } from '@/utils/enum/status.enum';
import { Farm } from '@/utils/schemas/farm.schema';
import { setCookie } from 'cookies-next';
import { Ruler, Scale3d } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function FarmCard({ farm }: { farm: Farm }) {
    const router = useRouter();

    return (
        <div
            // href={`${config.routes.dashboard}?farmCode=${farm.farmCode}`}
            onClick={() => {
                sessionStorage.setItem('activeFarm', JSON.stringify(farm));
                setCookie(config.cookies.farmId, farm.farmId);
                router.push(`${config.routes.dashboard}?farmCode=${farm.farmCode}`);
            }}
        >
            <Card className="hover:shadow-lg transition-shadow duration-300 mb-4">
                <CardHeader>
                    <div className="flex items-center justify-between relative">
                        <CardTitle className="flex items-center">{farm.farmName}</CardTitle>
                        <Image
                            src={farm.imageUrl || '/assets/logo/logo.png'}
                            alt={farm.farmCode}
                            width={50}
                            height={50}
                            className="rounded-md object-cover absolute right-0 mt-6"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground mb-2">Mã: {farm.farmCode}</div>
                    {/* <div className="flex items-center mb-1">
                        <MapPin className="mr-2 h-4 w-4" />{' '}
                        <span className="truncate font-medium">{farm.address}</span>
                    </div> */}
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
                    {/*<div className="flex items-center mb-1">
                        <Phone className="mr-2 h-4 w-4" />
                        <span className="truncate font-medium">SĐT: {farm.phoneNumber}</span>
                    </div>
                    <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />{' '}
                        <span className="truncate font-medium">{farm.website}</span>
                    </div> */}
                </CardContent>
            </Card>
        </div>
    );
}
