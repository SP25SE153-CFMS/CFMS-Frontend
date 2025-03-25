import { ChickenBatch } from '../schemas/chicken-batch.schema';
import { ChickenCoop } from '../schemas/chicken-coop.schema';
import { CoopEquipment } from '../schemas/coop-equipment.schema';
import { TaskLog } from '../schemas/task-log.schema';

export type ChickenCoopResponse = ChickenCoop & {
    chickenBatches: ChickenBatch[];
    taskLogs: TaskLog[];
    coopEquipments: CoopEquipment[];
};
