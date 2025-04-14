/* eslint-disable no-unused-vars */
'use client';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

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
                active && !completed ? 'bg-sky-400 text-white dark:bg-sky-600' : '',
                completed ? 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-200' : '',
                !active && !completed
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-300'
                    : '',
                isLastStep ? 'rounded-r-lg' : '',
                index === 0 ? 'rounded-l-lg' : '',
                visit ? 'text-black font-black text-lg dark:text-white' : '',
            )}
            onClick={() => onClick(index)}
        >
            <div className="px-4 font-medium">{title}</div>
            {!isLastStep && (
                <div className={cn('absolute -right-5 top-0 h-full w-10 overflow-hidden z-10')}>
                    <div
                        className={cn(
                            'h-full w-full transform rotate-45 translate-x-[-50%] translate-y-0 transition-colors',
                            active && !completed ? 'bg-sky-400 dark:bg-sky-600' : '',
                            completed ? 'bg-gray-300 dark:bg-gray-600' : '',
                            !active && !completed ? 'bg-gray-100 dark:bg-gray-700' : '',
                            visit ? 'text-black font-black text-lg dark:text-white' : '',
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
    const [visibleRange, setVisibleRange] = useState({
        start: 0,
        end: Math.min(2, steps.length - 1),
    });

    // Ensure active step is always visible
    useEffect(() => {
        // For steps 0 and 1, show first 3 steps
        if (activeStep <= 1) {
            setVisibleRange({ start: 0, end: Math.min(2, steps.length - 1) });
        }
        // For last and second-to-last steps, show last 3 steps
        else if (activeStep >= steps.length - 2) {
            setVisibleRange({
                start: Math.max(0, steps.length - 3),
                end: steps.length - 1,
            });
        }
        // Otherwise, center the active step
        else {
            setVisibleRange({
                start: activeStep - 1,
                end: activeStep + 1,
            });
        }
    }, [activeStep, steps.length]);

    const handleStepClick = (index: number) => {
        if (onStepClick) {
            onStepClick(index);
        }
    };

    const handlePrevious = () => {
        if (visibleRange.start > 0) {
            // Only move the window if we're not already showing the first step
            // if (activeStep > 2) {
            setVisibleRange({
                start: visibleRange.start - 1,
                end: visibleRange.end - 1,
            });
            // }
        }
    };

    const handleNext = () => {
        if (visibleRange.end < steps.length - 1) {
            // Only move the window if we're not already showing the last step
            if (activeStep < steps.length - 3) {
                setVisibleRange({
                    start: visibleRange.start + 1,
                    end: visibleRange.end + 1,
                });
            }
        }
    };

    const visibleSteps = steps.slice(visibleRange.start, visibleRange.end + 1);

    return (
        <div className={cn('flex items-center w-full', className)}>
            {/* Previous button */}
            <button
                onClick={handlePrevious}
                disabled={visibleRange.start === 0}
                className={cn(
                    'flex items-center justify-center h-12 w-12 rounded-l-lg mr-2',
                    visibleRange.start === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500',
                )}
            >
                <ChevronLeft size={20} />
            </button>

            {/* Visible steps */}
            <div className="flex flex-1">
                {visibleSteps.map((step, i) => {
                    const actualIndex = i + visibleRange.start;
                    return (
                        <div
                            key={actualIndex}
                            className={cn(
                                'flex-1 relative',
                                i < visibleSteps.length - 1
                                    ? 'z-[' + (visibleSteps.length - i) + ']'
                                    : '',
                            )}
                        >
                            <Step
                                title={step}
                                index={actualIndex}
                                active={activeStep === actualIndex}
                                visit={visitStep === actualIndex}
                                completed={activeStep > actualIndex}
                                isLastStep={i === visibleSteps.length - 1}
                                onClick={handleStepClick}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Next button */}
            <button
                onClick={handleNext}
                disabled={visibleRange.end === steps.length - 1}
                className={cn(
                    'flex items-center justify-center h-12 w-12 rounded-r-lg ml-2',
                    visibleRange.end === steps.length - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500',
                )}
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
