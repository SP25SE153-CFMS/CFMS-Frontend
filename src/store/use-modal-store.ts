import { create } from 'zustand';

// State types
interface States {
    open: boolean;
}

// Action types
interface Actions {
    openModal: () => void;
    closeModal: () => void;
}

// Store
export const useModalStore = create<States & Actions>((set) => ({
    open: false,
    openModal: () => set({ open: true }),
    closeModal: () => set({ open: false }),
}));