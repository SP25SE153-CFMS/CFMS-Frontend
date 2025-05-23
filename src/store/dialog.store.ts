/* eslint-disable no-unused-vars */
import { create } from 'zustand';

// State types
interface States {
    open: boolean;
}

// Action types
interface Actions {
    openDialog: () => void;
    closeDialog: () => void;
    onOpenChange: (open: boolean) => void;
}

// Store
export const useDialogStore = create<States & Actions>((set) => ({
    open: false,
    openDialog: () => set({ open: true }),
    closeDialog: () => set({ open: false }),
    onOpenChange: (open: boolean) => set({ open }),
}));
