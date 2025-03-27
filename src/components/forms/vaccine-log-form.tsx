import React, { useState } from 'react';

const VaccineLogForm = () => {
    const [formData, setFormData] = useState({
        notes: '',
        status: '',
        reaction: '',
        chickenBatchId: '',
        taskId: '',
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
                <label>Notes:</label>
                <input type="text" name="notes" value={formData.notes} onChange={handleChange} />
            </div>
            <div>
                <label>Status:</label>
                <input type="text" name="status" value={formData.status} onChange={handleChange} />
            </div>
            <div>
                <label>Reaction:</label>
                <input
                    type="text"
                    name="reaction"
                    value={formData.reaction}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Chicken Batch ID:</label>
                <input
                    type="text"
                    name="chickenBatchId"
                    value={formData.chickenBatchId}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Task ID:</label>
                <input type="text" name="taskId" value={formData.taskId} onChange={handleChange} />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default VaccineLogForm;
