import { ChickenBatch } from '../schemas/chicken-batch.schema';
import { ChickenCoop } from '../schemas/chicken-coop.schema';
import { Chicken } from '../schemas/chicken.schema';
import { CoopEquipment } from '../schemas/coop-equipment.schema';
import { FeedLog } from '../schemas/feed-log.schema';
import { HealthLog } from '../schemas/health-log.schema';
import { QuantityLog } from '../schemas/quantity-log.schema';
import { TaskLog } from '../schemas/task-log.schema';
import { VaccinationLog } from '../schemas/vaccine.schema';

export type ChickenCoopResponse = ChickenCoop & {
    chickenBatches: ChickenBatch[];
    taskLogs: TaskLog[];
    coopEquipments: CoopEquipment[];
};

export type ChickenBatchResponse = ChickenBatch & {
    vaccineLogs: VaccinationLog[];
    healthLogs: HealthLog[];
    quantityLogs: QuantityLog[];
    feedLogs: FeedLog[];
    chickens: Chicken[];
};
