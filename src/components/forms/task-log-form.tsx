import React, { useState } from 'react';

const TaskLogForm = () => {
    const [formData, setFormData] = useState({
        taskId: '',
        chickenCoopId: '',
        completedAt: '',
        note: '',
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
                <label>Task ID:</label>
                <input
                    type="text"
                    name="taskId"
                    value={formData.taskId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Chicken Coop ID:</label>
                <input
                    type="text"
                    name="chickenCoopId"
                    value={formData.chickenCoopId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Completed At:</label>
                <input
                    type="datetime-local"
                    name="completedAt"
                    value={formData.completedAt}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Note:</label>
                <textarea name="note" value={formData.note} onChange={handleChange} />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default TaskLogForm;
