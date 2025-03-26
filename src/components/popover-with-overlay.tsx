'use client';

import { useState, ReactNode } from 'react';
import { Popover } from '@/components/ui/popover';

interface PopoverWithOverlayProps {
    children: ReactNode;
}

const PopoverWithOverlay = ({ children }: PopoverWithOverlayProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black opacity-70 z-40 !mt-0"
                    onClick={() => setOpen(false)}
                />
            )}

            <Popover open={open} onOpenChange={setOpen}>
                {children}
            </Popover>
        </>
    );
};

export default PopoverWithOverlay;
