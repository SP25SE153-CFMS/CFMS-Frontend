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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
    type EvaluationResult,
    CreateEvaluationResultSchema,
} from '@/utils/schemas/evaluation-result.schema';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/functions';
import { vi } from 'date-fns/locale';

interface EvaluationResultFormProps {
    defaultValues?: Partial<EvaluationResult>;
    // eslint-disable-next-line no-unused-vars
    onSubmit: (data: EvaluationResult) => void;
}

export default function EvaluationResultForm({
    defaultValues,
    onSubmit,
}: EvaluationResultFormProps) {
    const form = useForm<EvaluationResult>({
        resolver: zodResolver(CreateEvaluationResultSchema),
        defaultValues: {
            evaluationTemplateId: '',
            evaluatedTargetId: '',
            evaluatedDate: new Date().toISOString(),
            ...defaultValues,
        },
    });

    const handleSubmit = (data: EvaluationResult) => {
        try {
            onSubmit(data);
            toast.success('Form submitted successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit the form.');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-4">
                {/* Evaluation Template ID */}
                <FormField
                    control={form.control}
                    name="evaluationTemplateId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Evaluation Template ID</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter Evaluation Template ID"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Evaluated Target ID */}
                <FormField
                    control={form.control}
                    name="evaluatedTargetId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Evaluated Target ID</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter Evaluated Target ID"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Evaluated Date */}
                <FormField
                    control={form.control}
                    name="evaluatedDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Evaluated Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn('w-full pl-3 text-left font-normal')}
                                        >
                                            {formatDate(field.value)}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value ? new Date(field.value) : new Date()}
                                        onSelect={(date) => field.onChange(date?.toISOString())}
                                        initialFocus
                                        locale={vi}
                                    />
                                </PopoverContent>
                            </Popover>
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
