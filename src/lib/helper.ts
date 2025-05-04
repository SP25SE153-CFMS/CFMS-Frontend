import { RequestResponse } from '@/utils/types/custom.type';

export const getRequestTitle = (requestDetail: RequestResponse) => {
    if (requestDetail.taskRequests?.length > 0) {
        return requestDetail.taskRequests[0].title;
    }
    if (requestDetail.inventoryRequests?.length > 0) {
        const inventory = requestDetail.inventoryRequests[0];
        if (inventory.wareTo?.farm?.farmName) {
            return inventory.wareTo.farm.farmName;
        }
        if (inventory.wareFrom?.farm?.farmName) {
            return inventory.wareFrom.farm.farmName;
        }
    }
    return 'Phiếu yêu cầu';
};

export const getRequestType = (request: RequestResponse) => {
    if (!request) return 'Phiếu khác';
    if (request.taskRequests?.length > 0) {
        return 'Báo cáo, đánh giá';
    }
    return 'Nhập xuất kho';
};
