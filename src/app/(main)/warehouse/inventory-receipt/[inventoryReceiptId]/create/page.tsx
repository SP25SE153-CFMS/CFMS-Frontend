'use client';

import SubCateDisplay from '@/components/badge/BadgeReceipt';
import InfoItem from '@/components/info-item';
import { getReceiptById } from '@/services/request.service';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { House } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function CreateStockReceipt() {
    // const farmId = getCookie('farmId') ?? '';
    const { inventoryReceiptId }: { inventoryReceiptId: string } = useParams();
    console.log("ID: ", inventoryReceiptId);

    const { data: receipt } = useQuery({
        queryKey: ['receipt', inventoryReceiptId],
        queryFn: () => getReceiptById(inventoryReceiptId),
    });

    console.log("Receipt: ",receipt);
    return (
        <div>
            {/* Tiêu đề */}
            <div>
                {/* Loại đơn hàng: có thể sử dụng subCateDisplay */}
                <div>
                    <p>Tạo đơn hàng</p>
                </div>

                {/* Trang trại: lấy từ cookie */}
                <div>
                    {/* <InfoItem
                        label="Trang trại"
                        value={JSON.parse(sessionStorage.getItem('activeFarm') || '{}')?.farmName}
                        icon={<House size={16} />}
                    /> */}
                </div>
            </div>

            {/* Chi tiết */}
            <div>
                {/* quantity: nhập input */}
                <div>
                    <p>Số lượng:</p>
                </div>

                {/* unitId: lấy từ receipt by id */}
                <div>
                    <p>Đơn vị:</p>
                    <SubCateDisplay id={receipt?.unitId || ''} mode='input'/>
                </div>

                {/* toWareId lấy từ receipt by id, qua subCateName: nếu import thì lấy wareToId ngc lại wareFromId rồi truyền id đó vào cho toWareId */}
                <div>
                    <p>Kho</p>
                </div>

                {/* resourceId: sử dụng ResourceCard*/}
                <div>
                    <p>Sản phẩm</p>
                </div>

                {/* resourceSupplierIdL tạo một combo box chọn supplier, get thông tin từ getSuppliersByFarmId*/}
                <div>
                    <p>Nhà cung cấp: </p>
                </div>
            </div>
        </div>
    );
}
