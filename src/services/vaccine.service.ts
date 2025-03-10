import { vaccines } from "@/utils/data/table.data";
import { Vaccine } from "@/utils/schemas/vaccine.schema";

export const getVaccines = async () => {
    // Mock API call
    return vaccines;
};

export const createVaccine = async (vaccine: Vaccine) => {
    // Mock API call
    vaccines.push(vaccine);
    return vaccine;
};

export const updateVaccine = async (vaccine: Vaccine) => {
    // Mock API call
    const index = vaccines.findIndex((v) => v.vaccineId === vaccine.vaccineId);
    vaccines[index] = vaccine;
    return vaccine;
};

export const deleteVaccine = async (id: string) => {
    // Mock API call
    const index = vaccines.findIndex((v) => v.vaccineId === id);
    vaccines.splice(index, 1);
    return id;
};