'use client';

import { useState } from 'react';
import { CircleAlertIcon, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DeleteConfirmDialog({
    open,
    setOpen,
    handleDelete,
    confirmValue,
    title = 'Xác nhận xóa',
    description = 'Không thể hoàn tác hành động này. Để xác nhận, vui lòng nhập',
    label = 'Mã',
    isPending = false,
}: {
    open: boolean;
    // eslint-disable-next-line no-unused-vars
    setOpen: (open: boolean) => void;
    handleDelete: () => void;
    confirmValue: string;
    title?: string;
    description?: string;
    label?: string;
    isPending?: boolean;
}) {
    const [inputValue, setInputValue] = useState('');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                        aria-hidden="true"
                    >
                        <CircleAlertIcon className="opacity-80 text-red-600" size={16} />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="sm:text-center">{title}</DialogTitle>
                        <DialogDescription className="sm:text-center">
                            {description} <span className="text-foreground">{confirmValue}</span>
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form className="space-y-5">
                    <div className="*:not-first:mt-2">
                        <Label>{label}</Label>
                        <Input
                            type="text"
                            placeholder={`Nhập ${confirmValue} để tiến hành xóa`}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="flex-1">
                                Hủy
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            className="flex-1"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={inputValue !== confirmValue || isPending}
                        >
                            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Xóa
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
