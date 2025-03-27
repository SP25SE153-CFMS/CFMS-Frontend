import React, { useState } from 'react';

const TaskLocationForm = ({ onSubmit, initialData }: { onSubmit: any; initialData: any }) => {
    const [formData, setFormData] = useState(
        initialData || {
            taskId: '',
            locationType: '',
            locationId: '',
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
                <label>Location Type:</label>
                <input
                    type="text"
                    name="locationType"
                    value={formData.locationType}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Location ID:</label>
                <input
                    type="text"
                    name="locationId"
                    value={formData.locationId}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default TaskLocationForm;
