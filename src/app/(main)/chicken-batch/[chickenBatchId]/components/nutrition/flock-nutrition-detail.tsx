import { nutritions, warehouseProducts } from '@/utils/data/table.data';
import { Card } from '@/components/ui/card';
import dayjs from 'dayjs';

export default function FlockNutritionDetail({ nutritionId }: { nutritionId: string }) {
    const nutrition = nutritions.find((nutrition) => nutrition.nutritionId === nutritionId);
    const food = warehouseProducts.find((product) => product.productId === nutrition?.foodId);

    return (
        <div>
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Nutrition Information */}
                    <div className="col-span-2">
                        <Card>
                            <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                        Thông tin chi tiết
                                    </h3>
                                </div>

                                <div className="flex gap-3 text-sm mb-4">
                                    Dinh dưỡng:{' '}
                                    <strong className="flex-1 text-right">
                                        {nutrition?.name || '-'}
                                    </strong>
                                </div>

                                <div className="flex gap-3 text-sm mb-4">
                                    Mô tả:{' '}
                                    <strong className="flex-1 text-right">
                                        {nutrition?.description || '-'}
                                    </strong>
                                </div>

                                <div className="flex gap-3 text-sm mb-4">
                                    Đối tượng:{' '}
                                    <strong className="flex-1 text-right">
                                        {nutrition?.targetAudience || '-'}
                                    </strong>
                                </div>

                                <div className="flex gap-3 text-sm mb-4">
                                    Giai đoạn phát triển:{' '}
                                    <strong className="flex-1 text-right">
                                        {nutrition?.developmentStage || '-'}
                                    </strong>
                                </div>

                                <div className="flex gap-3 text-sm mb-4">
                                    Thức ăn
                                    <strong className="flex-1 text-right">
                                        {food?.productName || '-'}
                                    </strong>
                                </div>

                                {/* Uncomment this code when you want to update */}
                                {/* <div className="flex flex-row gap-x-3 gap-y-3 sm:flex-col mt-8">
                            <Button
                                component={Link}
                                to={`/dashboard/center/${centerId}/court/${courtId}/update`}
                                className="py-[10px] flex-1"
                                leftSection={<GrUpdate />}
                            >
                                Cập nhật
                            </Button> 
                        </div> */}
                            </div>
                        </Card>
                    </div>

                    {/* Feed Session */}
                    <div className="col-span-3">
                        {/* <CardFeedSession nutritionId={nutritionId} /> */}
                    </div>
                </div>

                {/* Food */}
                {/* <CardFood /> */}
            </div>
        </div>
    );
}

// eslint-disable-next-line no-unused-vars
function OldCardFood(food: any) {
    return (
        <Card>
            <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                        Thức ăn
                    </h3>
                </div>
                <div className="flex gap-3 text-sm mb-4">
                    Mã thức ăn:{' '}
                    <strong className="flex-1 text-right">{food?.productCode || '-'}</strong>
                </div>

                <div className="flex gap-3 text-sm mb-4">
                    Tên thức ăn:{' '}
                    <strong className="flex-1 text-right">{food?.productName || '-'}</strong>
                </div>

                <div className="flex gap-3 text-sm mb-4">
                    Số lượng nhập:{' '}
                    <strong className="flex-1 text-right">
                        {food?.quantity} {food?.unit}
                    </strong>
                </div>

                <div className="flex gap-3 text-sm mb-4">
                    Khu vực bảo quản:{' '}
                    <strong className="flex-1 text-right">{food?.area || '-'}</strong>
                </div>

                <div className="flex gap-3 text-sm mb-4">
                    Ngày nhập kho:{' '}
                    <strong className="flex-1 text-right">
                        {dayjs(food?.dateToImport).format('DD/MM/YYYY')}
                    </strong>
                </div>

                <div className="flex gap-3 text-sm mb-4">
                    Hạn sử dụng:{' '}
                    <strong className="flex-1 text-right">
                        {dayjs(food?.expiry).format('DD/MM/YYYY')}
                    </strong>
                </div>

                <div className="flex gap-3 text-sm mb-4">
                    Nhà cung cấp:{' '}
                    <strong className="flex-1 text-right">{food?.supplier || '-'}</strong>
                </div>
            </div>
        </Card>
    );
}
