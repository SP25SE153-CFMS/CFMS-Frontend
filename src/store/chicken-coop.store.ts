import { ChickenCoop } from '@/utils/schemas/chicken-coop.schema';
import { create } from 'zustand';

// State types
interface States {
    chickenCoop: ChickenCoop | null
}

// Action types
interface Actions {
    // eslint-disable-next-line no-unused-vars
    setChickenCoop: (chickenCoop: ChickenCoop) => void;
}

// Store
export const useChickenCoopStore = create<States & Actions>((set) => ({
    chickenCoop: null,
    setChickenCoop: (chickenCoop) => set({ chickenCoop }),
}));