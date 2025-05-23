import { ChickenGender } from '../enum/gender.enum';
import { BreedingArea } from '../schemas/breeding-area.schema';
import { Category } from '../schemas/category.schema';
import { ChickenBatch } from '../schemas/chicken-batch.schema';
import { ChickenCoop } from '../schemas/chicken-coop.schema';
import { ChickenDetail } from '../schemas/chicken-detail.schema';
import { Chicken } from '../schemas/chicken.schema';
import { CoopEquipment } from '../schemas/coop-equipment.schema';
import { Equipment } from '../schemas/equipment.schema';
import { FarmEmployee } from '../schemas/farm-employee.schema';
import { FeedLog } from '../schemas/feed-log.schema';
import { Food } from '../schemas/food.schema';
import { GrowthBatch } from '../schemas/growth-batch.schema';
import { GrowthStage } from '../schemas/growth-stage.schema';
import { CreateHealthLog, HealthLog } from '../schemas/health-log.schema';
import { Medicine } from '../schemas/medicine.schema';
import { Notification } from '../schemas/notification.schema';
import { QuantityLog } from '../schemas/quantity-log.schema';
import { Resource } from '../schemas/resource.schema';
import { SubCategory } from '../schemas/sub-category.schema';
import { TaskLog } from '../schemas/task-log.schema';
import { Task } from '../schemas/task.schema';
import { User } from '../schemas/user.schema';
import { VaccinationLog } from '../schemas/vaccine.schema';
import { NutritionPlan } from '../schemas/nutrition-plan.schema';
import { NutritionPlanDetail } from '../schemas/nutrition-plan-detail.schema';
import { FeedSession } from '../schemas/feed-session.schema';
import { TaskResource } from '../schemas/task-resource.schema';
import { Warehouse } from '../schemas/warehouse.schema';
import { CreateInventoryReceipt, InventoryReceipt } from '../schemas/inventory-receipt.schema';
import {
    CreateInventoryReceiptDetail,
    InventoryReceiptDetail,
} from '../schemas/inventory-receipt-detail.schema';
import { TaskLocation } from '../schemas/task-location.schema';
import { HarvestProduct } from '../schemas/harvest-product.schema';
import { Request } from '../schemas/request.schema';
import { TaskRequest } from '../schemas/task-request.schema';
import { InventoryRequest } from '../schemas/inventory-request.schema';
import { InventoryRequestDetail } from '../schemas/inventory-request-detail.schema';
import { Farm } from '../schemas/farm.schema';
import { Supplier } from '../schemas/supplier.schema';
import { StockReceiptDetail } from '../schemas/stock-receipt-detail.schema';
import { HarvestLog } from '../schemas/harvest-log.schema';
import { TaskHarvest } from '../schemas/task-harvest.schema';

export type EntityAudit = {
    isDeleted: boolean;
    deletedWhen: string | Date | null;
    createdByUserId: string;
    createdByUser: User | null;
    createdWhen: string | Date | null;
    lastEditedByUserId: string;
    lastEditedByUser: User | null;
    lastEditedWhen: string | Date | null;
};

export type ChickenCoopResponse = ChickenCoop & {
    chickenBatches: ChickenBatch[];
    taskLogs: TaskLogResponse[];
    coopEquipments: CoopEquipment[];
    harvestLogs: HarvestLog[];
};

export type ChickenResponse = Chicken & {
    chickenDetails: ChickenDetail[];
};

export type GrowthStageResponse = GrowthStage & {
    nutritionPlanId: string;
    nutritionPlan: NutritionPlan;
};

export type GrowthBatchResponse = GrowthBatch & {
    growthStage: GrowthStageResponse;
};

export type QuantityLogDetails = {
    quantityLogDetailId: string;
    quantityLogId: string;
    quantity: number;
    gender: ChickenGender;
};

export type QuantityLogResponse = QuantityLog & {
    quantityLogDetails: QuantityLogDetails[];
};

export type ChickenBatchResponse = ChickenBatch &
    DashboardChickenBatch & {
        vaccineLogs: VaccinationLog[];
        healthLogs: HealthLog[];
        quantityLogs: QuantityLogResponse[];
        feedLogs: FeedLog[];
        chicken: ChickenResponse;
        growthBatches: GrowthBatchResponse[];
        currentStageId: string;
        chickenDetails: ChickenDetail[];
        minGrowDays: number;
        maxGrowDays: number;
        initChickenQuantity: number;
    };

export type CategoryResponse = Category & {
    subCategories: SubCategory[];
    chickens?: ChickenResponse[];
};

export type ChickenTypeResponse = {
    chickenType: SubCategory;
    chickens: Chicken[];
};

export type BreedingAreaResponse = BreedingArea & {
    chickenCoops: ChickenCoop[];
};

export type StartChickenBatch = {
    chickenCoopId: string;
    chickenId: string;
    chickenBatchName: string;
    stageCode: string;
    startDate: string | Date;
    chickenDetailRequests: ChickenDetailRequest[];
    minGrowDays: number;
    maxGrowDays: number;
};

export type ExportChicken = {
    chickenBatchId: string;
    logDate: string | Date;
    notes: string;
    quantityLogDetails: ChickenDetailRequest[];
    logType: number;
    imageUrl?: string;
};

export type SplitChickenBatch = Omit<StartChickenBatch, 'chickenId'> & {
    parentBatchId: string;
    notes: string;
};

export type FarmEmployeeResponse = FarmEmployee & {
    user: User;
};

export type ResourceResponse = Resource & {
    equipment?: Equipment;
    medicine?: Medicine;
    food?: Food;
    harvestProduct?: HarvestProduct;
    chicken?: Chicken;
    breeding?: Chicken;
    resourceType: string;
    unitSpecification: string;
    description: string;
    price: string;
    productionDate: string;
    expiryDate: string;
    purchaseDate: string;
    disease: string;
    createdWhen: string;
    packageSize: number;
    // Food
    foodCode: string;
    foodName: string;
    note: string;
    // Medicine
    medicineCode: string;
    medicineName: string;
    usage: string;
    dosageForm: string;
    storageCondition: string;
    // Equipment
    equipmentCode: string;
    equipmentName: string;
    material: string;
    warranty: number;
    size: number;
    weight: number;
    // HarvestProduct
    harvestProductCode: string;
    harvestProductName: string;
    // Chicken
    chickenCode: string;
    chickenName: string;
};

export type TaskResourceResponse = TaskResource & {
    // resource: ResourceResponse;
    resourceName: string;
    resourceType: string;
    specQuantity: string;
    unitSpecification: string;
    supplierId: string;
};

export type TaskLocationResponse = TaskLocation & {
    coopId?: string;
    location?: ChickenCoop;
    wareId?: string;
    locationNavigation?: Warehouse;
};

export type AssignmentForTaskResponse = {
    assignmentId: string;
    assignedTo: string;
    assignedDate: string;
    status: number;
    note: string;
};

export type ShiftScheduleResponse = {
    shiftName: string;
    workTime: string;
    startTime: string;
    endTime: string;
};

export type FeedLogFromTask = {
    resourceId: string;
    resourceName: string;
    resourceCode: string;
    unitSpecification: string;
    actualQuantity: number;
    note: string;
};

export type TaskResponse = Task & {
    assignments: AssignmentForTaskResponse[];
    startWorkDate: string;
    endWorkDate: string;
    shiftSchedule: ShiftScheduleResponse;
    taskResources: TaskResourceResponse[];
    taskType: SubCategory;
    taskLocation: TaskLocationResponse;
    feedLogs: FeedLogFromTask[];
    taskHarvests: TaskHarvest[];
};

export type ChickenDetailRequest = {
    gender: ChickenGender;
    quantity: number;
};

export type NotificationResponse = (Notification & EntityAudit) & {
    user: User;
};

export type NutritionPlanDetailResponse = NutritionPlanDetail & {
    food: Food;
};

export type NutritionPlanResponse = NutritionPlan & {
    nutritionPlanDetails: NutritionPlanDetailResponse[];
    feedSessions: FeedSession[];
};

export type DashboardResponse = {
    totalChicken: number;
    totalEmployee: number;
    totalChickenDeath: number;
    chickenBatches: ChickenBatchResponse[];
};

export type WareStockResponse = Warehouse &
    Food &
    Equipment &
    Medicine &
    Chicken &
    HarvestProduct & {
        foods?: Food;
        equipments?: Equipment;
        medicine?: Medicine;
        breeding?: Chicken;
        specQuantity: string;
        unitSpecification: string;
        resourceTypeName: string;
        resourceId: string;
        disease: string;
        currentSupplierId: string;
        currentSupplierName: string;
        currentSupplierCode: string;
        supplierName: string;
        suppliersName: Supplier[];
        chickenTypeName?: string;
    };

export type WarestockResourceByType = Food &
    Equipment &
    Medicine &
    HarvestProduct &
    Chicken & {
        specQuantity: string;
        unitSpecification: string;
        supplierName: string;
        resourceId: string;
        currentSupplierId: string;
        currentSupplierName: string;
        currentSupplierCode: string;
    };

export type InventoryReceiptRequest = CreateInventoryReceipt & {
    requestId: string;
    receiptDetails: CreateInventoryReceiptDetail[];
};

export type DashboardChickenBatch = {
    aliveChicken: number;
    deadthChicken: number;
    totalChicken: number;
};

export type InventoryRequestDetailResponse = InventoryRequestDetail & {
    unit: SubCategory;
    unitId: string;
    resource: ResourceResponse;
    resourceSupplierId: string;
};

export type WarehouseResponse = Warehouse & {
    farm: Farm;
    resourceTypeName: string;
};

export type InventoryRequestResponse = InventoryRequest & {
    inventoryRequestDetails: InventoryRequestDetailResponse[];
    wareFrom: WarehouseResponse;
    wareTo: WarehouseResponse;
    inventoryReceipts: InventoryReceipt[];
};

export type RequestResponse = EntityAudit &
    Request & {
        taskRequests: TaskRequest[];
        inventoryRequests: InventoryRequestResponse[];
    };

export type FarmResponse = Farm & {
    farmRole: number;
};

type EmployeeInvitation = {
    userId: string;
};

export type InviteEnrollRequest = {
    farmCode: string;
    methodAccess: string;
    farmRole: number;
    employeesInvitation: EmployeeInvitation[];
};

export type InviteEnrollDecisionRequest = {
    notificationId: string;
    decision: number;
};

type ExtendedInventoryReceiptDetail = InventoryReceiptDetail & {
    resourceSupplierId: string | null;
};

export type ReceiptResponse = InventoryReceipt &
    EntityAudit &
    Resource & {
        inventoryReceiptDetails: ExtendedInventoryReceiptDetail[];
        receiptCodeNumber: string;
        wareFrom: WarehouseResponse;
        wareTo: WarehouseResponse;
        batchNumber: number;
        userId: string;
    };

export type ResetPasswordRequest = {
    email: string;
    newPassword?: string;
    confirmPassword?: string;
    otp: string;
};

export type HealthLogDetails = {
    criteriaId: string;
    result: string;
};

export type HealthLogRequest = CreateHealthLog & {
    healthLogDetails: HealthLogDetails[];
};

export type TaskLogResponse = TaskLog & {
    task: TaskResponse;
};

export type HealthLogResponse = HealthLog & {
    healthLogDetails: HealthLogDetails[];
    taskId: string;
};

export type ChickenBatchChart = {
    date: string;
    totalFeed: number;
};

export type StockReceipt = StockReceipt[] & StockReceiptDetail[];

export type StockReceiptResponse = EntityAudit &
    StockReceipt & {
        stockReceiptId: string;
        stockReceiptDetails: StockReceiptDetail[];
        stockReceiptCode: string;
    };
