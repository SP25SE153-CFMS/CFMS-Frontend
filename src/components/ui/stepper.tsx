/* eslint-disable no-unused-vars */
'use client';
import { cn } from '@/lib/utils';

interface StepProps {
    title: string;
    index: number;
    active: boolean;
    visit: boolean;
    completed: boolean;
    isLastStep: boolean;
    onClick: (index: number) => void;
}

const Step = ({ title, index, active, visit, completed, isLastStep, onClick }: StepProps) => {
    return (
        <div
            className={cn(
                'relative flex items-center justify-center h-12 transition-colors cursor-pointer',
                active && !completed ? 'bg-sky-400 text-white' : '',
                completed ? 'bg-gray-300 text-gray-600' : '',
                !active && !completed ? 'bg-gray-100 text-gray-400' : '',
                isLastStep ? 'rounded-r-lg' : '',
                index === 0 ? 'rounded-l-lg' : '',
                visit ? 'text-black font-black text-lg' : '',
            )}
            onClick={() => onClick(index)}
        >
            <div className="px-4 font-medium">{title}</div>
            {!isLastStep && (
                <div className={cn('absolute -right-5 top-0 h-full w-10 overflow-hidden z-10')}>
                    <div
                        className={cn(
                            'h-full w-full transform rotate-45 translate-x-[-50%] translate-y-0 transition-colors',
                            active && !completed ? 'bg-sky-400' : '',
                            completed ? 'bg-gray-300' : '',
                            !active && !completed ? 'bg-gray-100' : '',
                            visit ? 'text-black font-black text-lg' : '',
                        )}
                    />
                </div>
            )}
        </div>
    );
};

interface StepperProps {
    steps: string[];
    activeStep: number;
    visitStep: number;
    onStepClick?: (index: number) => void;
    className?: string;
}

export function Stepper({ steps, activeStep, visitStep, onStepClick, className }: StepperProps) {
    console.log(visitStep, activeStep);

    const handleStepClick = (index: number) => {
        if (onStepClick) {
            onStepClick(index);
        }
    };

    return (
        <div className={cn('flex w-full', className)}>
            {steps.map((step, index) => (
                <div
                    key={index}
                    className={cn(
                        'flex-1 relative',
                        index < steps.length - 1 ? 'z-[' + (steps.length - index) + ']' : '',
                    )}
                >
                    <Step
                        title={step}
                        index={index}
                        active={activeStep === index}
                        visit={visitStep === index}
                        completed={activeStep > index}
                        isLastStep={index === steps.length - 1}
                        onClick={handleStepClick}
                    />
                </div>
            ))}
        </div>
    );
}
