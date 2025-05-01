import toast from 'react-hot-toast';

// type FormError = {
//     [key: string]: {
//         message: string;
//     };
// };

/**
 * Handles form errors by logging them to the console
 * and displaying the first error message as a toast notification.
 *
 * @param {FormError} error - The error object containing form validation errors.
 * @returns {void}
 * @example
 *   <form onSubmit={form.handleSubmit(onSubmit, onError)}></form>
 */
export const onError = (error: any) => {
    console.error(error);
    const firstKey = Object.keys(error)[0];
    const firstMessage = error[firstKey].message;
    toast(firstMessage, { icon: '⚠️' });
};
