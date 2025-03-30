import { Card } from '@/components/ui/card';

export default function SupplierDetail() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <Card>
                    <div className="flex w-full p-3 relative flex-col sm:px-6 sm:py-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold pl-3 text-lg relative before:content-[''] before:absolute before:top-[3px] before:left-0 before:w-[4px] before:h-full before:bg-primary inline-block">
                                Thông tin chi tiết
                            </h3>
                        </div>

                        <div className="flex gap-3 text-sm mb-4">
                            <strong className="flex-1 text-right"></strong>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
