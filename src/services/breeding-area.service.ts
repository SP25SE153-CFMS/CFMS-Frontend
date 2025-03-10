import { breedingAreas } from "@/utils/data/table.data";
import { BreedingArea } from "@/utils/schemas/breeding-area.schema";

export const getBreedingAreas = async () => {
    // Mock API call
    return breedingAreas;
};

export const createBreedingArea = async (breedingArea: BreedingArea) => {
    // Mock API call
    breedingAreas.push(breedingArea);
    return breedingArea;
};

export const updateBreedingArea = async (breedingArea: BreedingArea) => {
    // Mock API call
    const index = breedingAreas.findIndex((area) => area.breedingAreaId === breedingArea.breedingAreaId);
    breedingAreas[index] = breedingArea;
    return breedingArea;
};

export const deleteBreedingArea = async (id: string) => {
    // Mock API call
    const index = breedingAreas.findIndex((area) => area.breedingAreaId === id);
    breedingAreas.splice(index, 1);
    return id;
};