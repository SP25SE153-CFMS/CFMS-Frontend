import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shift } from '@/utils/schemas/shift.schema';

interface ShiftFormProps {
    closeDialog: () => void;
    defaultValues?: Shift;
}

const ShiftForm: React.FC<ShiftFormProps> = ({ closeDialog, defaultValues }) => {
    const [shiftName, setShiftName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        if (defaultValues) {
            setShiftName(defaultValues.shiftName);
            setStartTime(defaultValues.startTime);
            setEndTime(defaultValues.endTime);
        }
    }, [defaultValues]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        closeDialog();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="shiftName">Tên ca làm việc</Label>
                <Input
                    id="shiftName"
                    type="text"
                    value={shiftName}
                    onChange={(e) => setShiftName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="startTime">Thời gian bắt đầu</Label>
                <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="endTime">Thời gian kết thúc</Label>
                <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={closeDialog}>
                    Hủy
                </Button>
                <Button type="submit">{defaultValues ? 'Cập nhật' : 'Tạo'}</Button>
            </div>
        </form>
    );
};

export default ShiftForm;
