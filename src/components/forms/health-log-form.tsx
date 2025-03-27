import React, { useState } from 'react';

const HealthLogForm = ({ onSubmit, initialData }: { onSubmit: any; initialData: any }) => {
    const [formData, setFormData] = useState(
        initialData || {
            startDate: '',
            endDate: '',
            notes: '',
            chickenBatchId: '',
            taskId: '',
        },
    );

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Start Date:</label>
                <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>End Date:</label>
                <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Notes:</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} />
            </div>
            <div>
                <label>Chicken Batch ID:</label>
                <input
                    type="text"
                    name="chickenBatchId"
                    value={formData.chickenBatchId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Task ID:</label>
                <input
                    type="text"
                    name="taskId"
                    value={formData.taskId}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default HealthLogForm;
