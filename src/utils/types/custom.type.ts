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
import { HealthLog } from '../schemas/health-log.schema';
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
import { CreateInventoryReceipt } from '../schemas/inventory-receipt.schema';
import { CreateInventoryReceiptDetail } from '../schemas/inventory-receipt-detail.schema';
import { TaskLocation } from '../schemas/task-location.schema';

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
    taskLogs: TaskLog[];
    coopEquipments: CoopEquipment[];
};

export type ChickenResponse = Chicken & {
    chickenDetails: ChickenDetail[];
};

export type GrowthStageResponse = GrowthStage & {
    nutritionPlanId: string;
};

export type GrowthBatchResponse = GrowthBatch & {
    growthStage: GrowthStageResponse;
};

export type ChickenBatchResponse = ChickenBatch & {
    vaccineLogs: VaccinationLog[];
    healthLogs: HealthLog[];
    quantityLogs: QuantityLog[];
    feedLogs: FeedLog[];
    chicken: ChickenResponse;
    growthBatches: GrowthBatchResponse[];
    currentStageId: string;
    chickenDetails: ChickenDetail[];
};

export type CategoryResponse = Category & {
    subCategories: SubCategory[];
    chickens?: ChickenResponse[];
};

export type ChickenTypeResponse = SubCategory & {
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

export type SplitChickenBatch = StartChickenBatch & {
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
    resourceType: string;
    unitSpecification: string;
    description: string;
    price: string;
    productionDate: string;
    expiryDate: string;
    purchaseDate: string;
    disease: string;
    foodCode: string;
    foodName: string;
    note: string;
    medicineCode: string;
    medicineName: string;
    usage: string;
    dosageForm: string;
    storageCondition: string;
    equipmentCode: string;
    equipmentName: string;
    material: string;
    warranty: number;
    size: number;
    weight: number;
};

export type TaskResourceResponse = TaskResource & {
    // resource: ResourceResponse;
    resourceName: string;
    resourceType: string;
    specQuantity: string;
    unitSpecification: string;
};

export type TaskLocationResponse = TaskLocation & {
    coopId?: string;
    coop?: ChickenCoop;
    wareId?: string;
    ware?: Warehouse;
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

export type TaskResponse = Task & {
    assignments: AssignmentForTaskResponse[];
    startWorkDate: string;
    endWorkDate: string;
    shiftSchedule: ShiftScheduleResponse;
    taskResources: TaskResourceResponse[];
    taskType: SubCategory;
    taskLocation: TaskLocationResponse;
};

export type ChickenDetailRequest = {
    gender: ChickenGender;
    quantity: number;
};

export type NotificationResponse = (Notification & EntityAudit) & {
    user: User;
};

export type NutritionPlanResponse = NutritionPlan & {
    nutritionPlanDetails: NutritionPlanDetail[];
    feedSessions: FeedSession[];
};

export type DashboardResponse = {
    totalChicken: number;
    totalEmployee: number;
    totalChickenDeath: number;
    chickenBatches: ChickenBatchResponse[];
};

export type WareStockResponse = Warehouse & {
    foods?: Food;
    equipments?: Equipment;
    medicine?: Medicine;
    specQuantity: string;
    unitSpecification: string;
    resourceTypeName: string;
    resourceId: string;
    disease: string;
};

export type InventoryReceiptRequest = CreateInventoryReceipt & {
    requestId: string;
    receiptDetails: CreateInventoryReceiptDetail[];
};

export type DashboardChickenBatch = {
    activeChicken: number;
    deadthChicken: number;
    totalChicken: number;
};
