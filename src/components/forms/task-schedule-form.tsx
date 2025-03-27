import React, { useState } from 'react';

const TaskScheduleForm = () => {
    const [formData, setFormData] = useState({
        frequency: '',
        nextWorkDate: '',
        lastWorkDate: '',
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
        console.log('Form submitted:', formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="frequency">Frequency</label>
                <input
                    type="number"
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="nextWorkDate">Next Work Date</label>
                <input
                    type="date"
                    id="nextWorkDate"
                    name="nextWorkDate"
                    value={formData.nextWorkDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="lastWorkDate">Last Work Date</label>
                <input
                    type="date"
                    id="lastWorkDate"
                    name="lastWorkDate"
                    value={formData.lastWorkDate}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default TaskScheduleForm;
