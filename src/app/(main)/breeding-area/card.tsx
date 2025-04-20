import config from '@/configs';
import Link from 'next/link';
import { BreedingArea } from '@/utils/schemas/breeding-area.schema';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { AlignRight, Trash } from 'lucide-react';
import { getAreaUnit } from '@/utils/functions/category.function';
import Image from '@/components/fallback-image';

interface BreedingAreaCardProps {
    area: BreedingArea;
    // eslint-disable-next-line no-unused-vars
    handleUpdate: (row: BreedingArea) => void;
    // eslint-disable-next-line no-unused-vars
    setOpenDelete: (value: boolean) => void;
    // eslint-disable-next-line no-unused-vars
    setRow: (row: BreedingArea) => void;
}

// Reusable component for rendering breeding area cards
export default function BreedingAreaCard({
    area,
    handleUpdate,
    setOpenDelete,
    setRow,
}: BreedingAreaCardProps) {
    return (
        <Card key={area.breedingAreaId} className="overflow-hidden">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <div>
                    <h3 className="font-semibold">{area.breedingAreaName}</h3>
                    <p className="text-sm text-muted-foreground">
                        {area.breedingAreaCode} ({area.area || 0} {getAreaUnit(area.areaUnitId)})
                    </p>
                </div>
                {/* <Badge variant={breedingAreaStatusVariant[area.status]}>
                    {breedingAreaStatusLabels[area.status]}
                </Badge> */}
                <Image
                    src={area.imageUrl ?? '/breeding-area.png'}
                    alt={area.breedingAreaCode}
                    width={16}
                    height={16}
                    className="w-16 h-16 rounded-sm object-contain"
                    preview
                />

                {/* <Image
                    src={area.imageUrl ?? '/breeding-area.png'}
                    alt={area.breedingAreaCode}
                    className="w-16 h-16 rounded-sm object-contain"
                    width={100}
                    height={100}
                /> */}
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <p className="text-sm text-muted-foreground line-clamp-2 h-12">
                    {area.notes || 'Không có ghi chú'}
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
                <Link
                    // href={`${config.routes.chickenCoop}?breedingAreaId=${area.breedingAreaId}`}
                    href={config.routes.chickenCoop}
                    onClick={() => sessionStorage.setItem('breedingAreaId', area.breedingAreaId)}
                >
                    <Button variant="outline" size="sm">
                        Xem chi tiết
                    </Button>
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <span className="sr-only">Mở menu</span>
                            <AlignRight className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUpdate(area)}>
                            Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                setOpenDelete(true);
                                setRow(area);
                            }}
                            className="text-red-600"
                        >
                            Xóa <Trash size={16} className="ml-auto" />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    );
}
