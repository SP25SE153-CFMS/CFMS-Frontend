import { create } from 'zustand';

type ImageUploadStore = {
    uploadImage: () => void;
    // eslint-disable-next-line no-unused-vars
    setUploadImage: (fn: () => void) => void;
};

export const useImageUploadStore = create<ImageUploadStore>((set) => ({
    uploadImage: () => {},
    setUploadImage: (fn) => set({ uploadImage: fn }),
}));
