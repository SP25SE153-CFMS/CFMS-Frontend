import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { inventoryReceipts } from '@/utils/data/table.data';
import { requestStatusLabels, requestStatusVariant } from '@/utils/enum/status.enum';

export default function ReceiptDetail({ receiptId }: { receiptId: string }) {
    const receipt = inventoryReceipts.find((receipt) => receipt.inventoryReceiptId === receiptId);
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
                            Mã phiếu:
                            <strong className="flex-1 text-right">{receipt?.inventoryCode}</strong>
                        </div>
                        <div className="flex gap-3 text-sm mb-4">
                            Danh mục:
                            <strong className="flex-1 text-right">
                                {receipt?.subcategoryName}
                            </strong>
                        </div>
                        <div className="flex gap-3 text-sm mb-4">
                            Người tạo:
                            <strong className="flex-1 text-right">Ngọc Anh</strong>
                        </div>
                        <div className="flex gap-3 text-sm mb-4">
                            Ngày tạo:
                            <strong className="flex-1 text-right">{receipt?.createDate}</strong>
                        </div>
                        <div className="flex justify-between gap-3 text-sm mb-4">
                            Trạng thái:
                            <Badge variant={requestStatusVariant[String(receipt?.status)]}>
                                {requestStatusLabels[String(receipt?.status)]}
                            </Badge>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
