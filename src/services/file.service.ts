/* eslint-disable no-unused-vars */
import { v4 } from 'uuid';
import { storage } from '@/configs/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { post } from '@/utils/functions/axios.function';
import { env } from '@/env';

export type UploadProgressCallback = (progress: number) => void;
export type UploadErrorCallback = (error: Error) => void;
export type UploadSuccessCallback = (url: string) => void;

export const uploadToFirebase = (
    file: File,
    path: string,
    onProgress?: UploadProgressCallback,
    onError?: UploadErrorCallback,
    onSuccess?: UploadSuccessCallback,
) => {
    // Create a storage reference
    const storageRef = ref(storage, `${path}/${file.name}-${v4}`);

    // Create the upload task
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Set up task event listeners
    uploadTask.on(
        'state_changed',
        (snapshot) => {
            // Calculate and report progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress?.(progress);
        },
        (error) => {
            // Handle errors
            console.error('Upload error:', error);
            onError?.(error);
        },
        async () => {
            // Upload completed successfully, get download URL
            try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                onSuccess?.(downloadURL);
            } catch (error) {
                console.error('Error getting download URL:', error);
                onError?.(error as Error);
            }
        },
    );

    // Return the task so it can be managed externally if needed
    return uploadTask;
};
