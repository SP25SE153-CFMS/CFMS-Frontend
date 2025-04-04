import { BreedingArea } from '../schemas/breeding-area.schema';
import { Category } from '../schemas/category.schema';
import { ChickenBatch } from '../schemas/chicken-batch.schema';
import { ChickenCoop } from '../schemas/chicken-coop.schema';
import { ChickenDetail } from '../schemas/chicken-detail.schema';
import { Chicken } from '../schemas/chicken.schema';
import { CoopEquipment } from '../schemas/coop-equipment.schema';
import { FarmEmployee } from '../schemas/farm-employee.schema';
import { FeedLog } from '../schemas/feed-log.schema';
import { HealthLog } from '../schemas/health-log.schema';
import { QuantityLog } from '../schemas/quantity-log.schema';
import { SubCategory } from '../schemas/sub-category.schema';
import { TaskLog } from '../schemas/task-log.schema';
import { User } from '../schemas/user.schema';
import { VaccinationLog } from '../schemas/vaccine.schema';

export type ChickenCoopResponse = ChickenCoop & {
    chickenBatches: ChickenBatch[];
    taskLogs: TaskLog[];
    coopEquipments: CoopEquipment[];
};

export type ChickenResponse = Chicken & {
    chickenDetails: ChickenDetail[];
};

export type ChickenBatchResponse = ChickenBatch & {
    vaccineLogs: VaccinationLog[];
    healthLogs: HealthLog[];
    quantityLogs: QuantityLog[];
    feedLogs: FeedLog[];
    chicken: ChickenResponse;
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
};

export type FarmEmployeeResponse = FarmEmployee & {
    user: User;
};
