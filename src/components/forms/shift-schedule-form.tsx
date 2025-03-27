import React, { useState } from 'react';

const ShiftScheduleForm = () => {
    const [formData, setFormData] = useState({
        shiftId: '',
        date: '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="shiftId">Shift ID:</label>
                <input
                    type="text"
                    id="shiftId"
                    name="shiftId"
                    value={formData.shiftId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="date">Date:</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default ShiftScheduleForm;
