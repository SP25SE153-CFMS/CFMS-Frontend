'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    EvaluatedTargetSchema,
    type EvaluatedTarget,
} from '@/utils/schemas/evaluated-target.schema';
import toast from 'react-hot-toast';

interface EvaluatedTargetFormProps {
    defaultValues?: Partial<EvaluatedTarget>;
    // eslint-disable-next-line no-unused-vars
    onSubmit: (data: EvaluatedTarget) => void;
}

export default function EvaluatedTargetForm({ defaultValues, onSubmit }: EvaluatedTargetFormProps) {
    const form = useForm<EvaluatedTarget>({
        resolver: zodResolver(EvaluatedTargetSchema),
        defaultValues: {
            targetTypeId: '',
            targetId: '',
            ...defaultValues,
        },
    });

    const handleSubmit = (data: EvaluatedTarget) => {
        try {
            onSubmit(data);
            toast.success('Form submitted successfully!');
        } catch (error: any) {
            console.error(error);
            toast(error?.response?.data?.message, { icon: '⚠️' });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-4">
                {/* Target Type ID */}
                <FormField
                    control={form.control}
                    name="targetTypeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Target Type ID</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Enter Target Type ID" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Target ID */}
                <FormField
                    control={form.control}
                    name="targetId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Target ID</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Enter Target ID" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </form>
        </Form>
    );
}
