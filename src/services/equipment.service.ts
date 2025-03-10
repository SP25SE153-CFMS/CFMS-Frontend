import { equipments } from "@/utils/data/table.data";
import { Equipment } from "@/utils/schemas/equipment.schema";

export const getEquipments = async () => {
    // Mock API call
    return equipments;
};

export const getEquipmentById = async (id: string) => {
    // Mock API call
    return equipments.find((equipment) => equipment.equipmentId === id);
};

export const createEquipment = async (equipment: Equipment) => {
    // Mock API call
    equipments.push(equipment);
    return equipment;
};

export const updateEquipment = async (equipment: Equipment) => {
    // Mock API call
    const index = equipments.findIndex((equip) => equip.equipmentId === equipment.equipmentId);
    equipments[index] = equipment;
    return equipment;
};

export const deleteEquipment = async (id: string) => {
    // Mock API call
    const index = equipments.findIndex((equip) => equip.equipmentId === id);
    equipments.splice(index, 1);
    return id;
}